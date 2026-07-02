import morgan, { StreamOptions } from "morgan";
import logger from "../config/logger.js";

// Map Morgan's stream receiver directly into Winston's HTTP logger level
const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

// Skip high-volume HTTP logging if we are running in a production pipeline
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  // Choose the layout format (:method :url :status :res[content-length] - :response-time ms)
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export default morganMiddleware;