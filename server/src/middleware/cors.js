
import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000",   
   "http://localhost:5173",
   "https://orange-island-0855ce403.2.azurestaticapps.net"

];

export const corsMiddleware = cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});
