import { emailRegex } from "../constants";
import { FullUserInput } from "src/types/FullUserInput";
import { FieldError } from "../types/FieldError";
import { ApolloError } from "apollo-server-express";

export const createUserValidation = (
    options: FullUserInput
): FieldError[] | null => {
    if (!emailRegex.test(options.email)) {
        return [
            {
                field: "email",
                error: "Invalid email address",
            },
        ];
    }

    if (options.username.length < 2 || options.username.length > 32) {
        return [
            {
                field: "username",
                error: "Username must be between 2 and 32 characters",
            },
        ];
    }

    if (options.password.length < 5 || options.password.length > 32) {
        return [
            {
                field: "password",
                error: "Password must be between 5 and 32 characters",
            },
        ];
    }

    return null;
};

export const createUserErrorHandling = (error: ApolloError): FieldError[] => {
    if (error.code == "P2002") {
        return [
            {
                field: "email",
                error: "This email is already in use",
            },
        ];
    } else {
        return [
            {
                field: "n/a",
                error: "An unkown error occured",
            },
        ];
    }
};
