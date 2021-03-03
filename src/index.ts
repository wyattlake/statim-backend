import { PrismaClient } from "@prisma/client";
import express from "express";
const prisma = new PrismaClient();

async function main() {
    const app = express();

    app.listen(9000, () => {
        console.log("Server started on port 9000");
    });
}

main()
    .catch((error) => {
        throw error;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
