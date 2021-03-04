import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import express from "express";
import { MessageResolver } from "./resolvers/message";
import { ChannelResolver } from "./resolvers/channel";
import { CommunityResolver } from "./resolvers/community";
const prisma = new PrismaClient();

async function main() {
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                UserResolver,
                MessageResolver,
                ChannelResolver,
                CommunityResolver,
            ],
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
