
import express from "express";
import { ObjectId } from "mongodb";


export function registerImageRoutes(app, imageProvider) {
    const router = express.Router();


    router.get("/", async (req, res) => {
        try {
            const images = await imageProvider.getAllImages();
            return res.json(images);
        } catch (err) {
            console.error("GET /api/images error:", err);
            return res.status(500).send({
                error: "Server Error",
                message: String(err?.message ?? err),
            });
        }
    });

    router.get("/:id", async (req, res) => {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(404).send({
                error: "Not Found",
                message: "No image with that ID",
            });
        }

        try {
            const image = await imageProvider.getOneImage(id);
            if (!image) {
                return res.status(404).send({
                    error: "Not Found",
                    message: "No image with that ID",
                });
            }
            return res.json(image);
        } catch (err) {
            console.error("GET /api/images/:id error:", err);
            return res.status(500).send({
                error: "Server Error",
                message: String(err?.message ?? err),
            });
        }
    });

    router.patch("/:id", async (req, res) => {
        const id = req.params.id;
        const { name } = req.body ?? {};


        if (!ObjectId.isValid(id)) {
            return res.status(404).send({
                error: "Not Found",
                message: "Image does not exist",
            });
        }


        if (typeof name !== "string") {
            return res.status(400).send({
                error: "Bad Request",
                message: "Request body must be JSON with a string 'name' field",
            });
        }

        const MAX_NAME_LENGTH = 100;
        if (name.length > MAX_NAME_LENGTH) {
            return res.status(413).send({
                error: "Content Too Large",
                message: `Image name exceeds ${MAX_NAME_LENGTH} characters`,
            });
        }

        try {
            const image = await imageProvider.getOneImage(id);
            if (!image) {
                return res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist",
                })
            }

            if (image.authorId !== req.userInfo.username){
                return res.status(403).send({
                    error:" Forbidden",
                    message: "This user does not own this image",
                })
            }
            await imageProvider.updateImageName(id, name);
            return res.status(204).send();

        } catch (err) {
            console.error("PATCH /api/images/:id error:", err);
            return res.status(500).send({
                error: "Server Error",
                message: String(err?.message ?? err),
            });
        }
    });


    app.use("/api/images", router);
}