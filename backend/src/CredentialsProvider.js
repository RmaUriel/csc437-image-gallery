import bcrypt from "bcrypt";
import { getEnvVar } from "./getEnvVar.js";

export class CredentialsProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        this.creds = this.mongoClient
            .db()
            .collection(getEnvVar("CREDS_COLLECTION_NAME"));
        this.users = this.mongoClient
            .db()
            .collection(getEnvVar("USERS_COLLECTION_NAME"));
    }

    async registerUser(username, email, password) {
        const existingUser = await this.users.findOne({ username });
        const exitstingCred = await this.creds.findOne({ username });
        if (existingUser || exitstingCred) {
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await this.creds.insertOne({
            username,
            password: hashedPassword,
        });

        await this.users.insertOne({
            username,
            email,
        });

        return true;
    }

    async verifyPassword(username, password) {
        const credsRecord = await this.creds.findOne({ username });

        if (!credsRecord) {
            return false;
        }

        return await bcrypt.compare(password, credsRecord.password);
    }
}