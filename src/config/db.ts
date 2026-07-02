import dotenv from "dotenv";
import { Server } from "node:http";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client"
dotenv.config();

const connectionString = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export const connectDB = () => {
    return prisma.$connect();
};

export const shutdown = (server: Server | undefined) => {
    if (!server) {
        process.exit(0);
    }

    server.close(async (err) => {
        if (err) {
            console.error('Error during HTTP server shutdown:', err);
            process.exit(1);
        }
        
        console.log('\nServer closed successfully');
        
        try {
            await prisma.$disconnect();
            console.log("================ Database disconnected ================");
            process.exit(0);
        } catch (dbErr) {
            console.error('Error during database disconnection:', dbErr);
            process.exit(1);
        }
    });
};

export default prisma;