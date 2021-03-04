import { FieldError } from "../types/misc/FieldError";
import { ApolloError } from "apollo-server-express";

export const sendMessageValidation = (content: string): FieldError[] | null => {
    if (content.length == 0) {
        return [
            {
                field: "content",
                error: "Message cannot be empty",
            },
        ];
    } else if (content.length >= 2000) {
        return [
            {
                field: "content",
                error: "Message must be under 2000 characters",
            },
        ];
    }

    return null;
};

export const sendMessageErrorHandling = (error: ApolloError): FieldError[] => {
    if (error.code == "P2025") {
        if (error.message.includes("MessageToUser")) {
            return [
                {
                    field: "userId",
                    error: "Invalid user ID",
                },
            ];
        } else if (error.message.includes("ChannelToMessage")) {
            return [
                {
                    field: "channelId",
                    error: "Invalid channel ID",
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
