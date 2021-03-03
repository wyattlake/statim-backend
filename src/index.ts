import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import express from "express";
const prisma = new PrismaClient({
    log: ["query", "info", `warn`, `error`],
});

async function main() {
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false,
        }),
        context: () => ({ prisma }),
    });

    app.listen(9000, () => {
        console.log("Server started on port 9000");
    });

    apolloServer.applyMiddleware({ app });
}

main()
    .catch((error) => {
        throw error;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
