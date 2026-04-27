import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

// Clerk proxy must be mounted before body parsers (streams raw bytes)
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// Security headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xFrameOptions: { action: "deny" },
    xContentTypeOptions: true,
    dnsPrefetchControl: { allow: false },
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
  }),
);

app.disable("x-powered-by");

// General rate limit: 200 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
  handler(req: Request, res: Response, _next: NextFunction, options) {
    logger.warn({ ip: req.ip, path: req.path }, "Rate limit exceeded");
    res.status(options.statusCode).json(options.message);
  },
});

// Strict rate limit for write operations: 30 requests per 15 minutes per IP
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many write requests. Please try again later." },
  handler(req: Request, res: Response, _next: NextFunction, options) {
    logger.warn({ ip: req.ip, path: req.path }, "Write rate limit exceeded");
    res.status(options.statusCode).json(options.message);
  },
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// CORS with credentials enabled for Clerk session cookies
app.use(cors({ credentials: true, origin: true }));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Clerk session middleware — populates req.auth on every request
app.use(clerkMiddleware());

// Apply general rate limiting to all API routes
app.use("/api", generalLimiter);

// Apply strict rate limiting to mutating methods
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    writeLimiter(req, res, next);
  } else {
    next();
  }
});

// Audit log: record all mutating requests with timestamp
app.use("/api", (req: Request, _res: Response, next: NextFunction) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    logger.info(
      {
        audit: true,
        method: req.method,
        path: req.path,
        ip: req.ip,
        ts: new Date().toISOString(),
      },
      "API write operation",
    );
  }
  next();
});

app.use("/api", router);

// Global error handler — sanitizes stack traces in production
app.use(
  (err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = (err as { status?: number; statusCode?: number }).status
      ?? (err as { statusCode?: number }).statusCode
      ?? 500;
    logger.error({ err, path: req.path }, "Unhandled server error");
    res.status(statusCode).json({
      error:
        process.env.NODE_ENV === "production"
          ? "An internal error occurred"
          : err.message,
    });
  },
);

export default app;
