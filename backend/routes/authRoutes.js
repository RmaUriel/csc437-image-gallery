import express from "express";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../src/getEnvVar.js";

function generateAuthToken(username) {
    return new Promise((resolve, reject) => {
        const payload = { username };
        jwt.sign(
            payload,
            getEnvVar("JWT_SECRET"),
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token);
            }
        );
    });
}

export function registerAuthRoutes(app, credentialsProvider) {
    const router = express.Router();

    router.post("/users", async (req, res) => {
        const { username, email, password } = req.body ?? {};

        if (!username || !email || !password) {
            return res.status(400).send({
                error: "Bad request",
                message: "Missing username, email, or password",
            });
        }

        try {
            const created = await credentialsProvider.registerUser(
                username,
                email,
                password
            );

            if (!created) {
                return res.status(409).send({
                    error: "Conflict",
                    message: "Username already taken",
                });
            }

            return res.status(201).send();
        } catch (err) {
            console.error("POST /api/users error:", err);
            return res.status(500).send({
                error: "Server Error",
                message: String(err?.message ?? err),
            });
        }
    });

    router.post("/auth/tokens", async (req, res) => {
        const { username, password } = req.body ?? {};

        if (!username || !password) {
            return res.status(400).send({
                error: "Bad request",
                message: "Missing username or password",
            });
        }

        try {
            const isValid = await credentialsProvider.verifyPassword(
                username,
                password
            );

            if (!isValid) {
                return res.status(401).send({
                    error: "Unauthorized",
                    message: "Invalid username or password",
                });
            }

            const token = await generateAuthToken(username);
            return res.status(200).send({ token });
        } catch (err) {
            console.error("POST /api/auth/tokens error:", err);
            return res.status(500).send({
                error: "Server Error",
                message: String(err?.message ?? err),
            });
        }
    });

    app.use("/api", router);
}