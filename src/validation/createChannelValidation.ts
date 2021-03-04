import { FieldError } from "../types/misc/FieldError";
import { ApolloError } from "apollo-server-express";
import { channelRegex } from "../constants";

export const createChannelValidation = (name: string): FieldError[] | null => {
    if (channelRegex.test(name)) {
        return [
            {
                field: "name",
                error:
                    "Channel name can only have lowercase letters and dashes",
            },
        ];
    } else if (name.length < 2 || name.length > 32) {
        return [
            {
                field: "name",
                error: "Channel name must be between 2 and 32 characters",
            },
        ];
    }

    return null;
};

export const createChannelErrorHandling = (
    error: ApolloError
): FieldError[] => {
    if (error.code == "P2025") {
        if (error.message.includes("ChannelToCommunity")) {
            return [
                {
                    field: "communityId",
                    error: "Invalid community ID",
                },
            ];
        }
    } else if (error.code == "P2002") {
        return [
            {
                field: "n/a",
                error:
                    "There was an error generating your credentials. Please try again.",
            },
        ];
    }
    return [
        {
            field: "n/a",
            error: "An unknown error occurred",
        },
    ];
};
