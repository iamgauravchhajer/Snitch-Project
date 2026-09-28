import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "../routes/auth.routes.js";
import productRouter from "../routes/product.routes.js";
import cartRouter from "../routes/cart.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, "../../../client");

const app = express();

app.use(cors({
    origin: (origin, cb) => cb(null, origin || '*'),
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

app.use(express.static(clientPath));

app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ success: false, message: "API endpoint not found" });
    }
    res.sendFile(path.join(clientPath, "index.html"));
});

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export default app;