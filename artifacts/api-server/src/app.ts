import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Trust the reverse proxy (required for correct IP resolution behind Replit/nginx)
app.set("trust proxy", 1);

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

// Remove the X-Powered-By header so the server technology is not advertised
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

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

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

app.use("/api", router);

export default app;
