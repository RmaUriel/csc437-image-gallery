import { getEnvVar } from "./getEnvVar.js";

export class ImageProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        this.images = this.mongoClient
            .db()
            .collection(getEnvVar("IMAGES_COLLECTION_NAME"));
        this.usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");
    }

    getAllImages() {
        const pipeline = [];

        pipeline.push({
            $lookup: {
                from: this.usersCollectionName,
                localField: "authorId",
                foreignField: "username",
                as: "author",
            },
        });

        pipeline.push({
            $unwind: {
                path: "$author",
                preserveNullAndEmptyArrays: true,
            },
        });

        return this.images.aggregate(pipeline).toArray();
    }
}