import { FieldError } from "../types/misc/FieldError";
import { ApolloError } from "apollo-server-express";

export const createCommunityValidation = (
    name: string
): FieldError[] | null => {
    if (name.length < 2 || name.length > 32) {
        return [
            {
                field: "name",
                error: "Community name must be between 2 and 32 characters",
            },
        ];
    }

    return null;
};

export const createCommunityErrorHandling = (
    error: ApolloError
): FieldError[] => {
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
