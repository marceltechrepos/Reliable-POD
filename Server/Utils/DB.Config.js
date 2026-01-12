import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

const ConnectDB = async () => {
    let attempts = 0;

    const connect = async () => {
        try {
            console.log(`📡 Connecting to MongoDB... (Attempt ${attempts + 1})`);

            await mongoose.connect(process.env.MONGO_URL, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                minPoolSize: 2,
                retryWrites: true,
                w: "majority",
            });

            console.log("✅ MongoDB connected successfully");

            // Attach event listeners once connected
            mongoose.connection.on("disconnected", () => {
                console.error("⚠️ MongoDB disconnected. Attempting to reconnect...");
                connect();
            });

            mongoose.connection.on("error", (err) => {
                console.error("❌ MongoDB connection error:", err.message);
            });

        } catch (err) {
            attempts++;
            console.error(`❌ Connection failed: ${err.message}`);

            if (attempts >= MAX_RETRIES) {
                console.error("⛔ Max retries reached. Exiting application.");
                process.exit(1);
            }

            const backoff = RETRY_DELAY * attempts;
            console.log(`⏳ Retrying in ${backoff / 1000} seconds...`);

            await new Promise((res) => setTimeout(res, backoff));
            return connect(); // retry
        }
    };

    connect();

    // Graceful shutdown
    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("👋 MongoDB connection closed gracefully");
        process.exit(0);
    });
};

export default ConnectDB;