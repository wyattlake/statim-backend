import { ApolloError } from "apollo-server-express";

export const listChannelsErrorHandling = (error: ApolloError) => {
    if (error.code == "P2025") {
        if (error.message.includes("CommunityToUser")) {
            return [
                {
                    field: "creatorId",
                    error: "Invalid creator ID",
                },
            ];
        }
    }
    return [
        {
            field: "n/a",
            error: "An unknown error occurred",
        },
    ];
};
