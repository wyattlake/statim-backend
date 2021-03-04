import { FieldError } from "../types/misc/FieldError";
import { EditUserInput } from "../types/user/EditUserInput";
import argon2 from "argon2";
import { FullUser } from "../types/user/FullUser";
import { emailRegex } from "../constants";
import { ApolloError } from "apollo-server-express";

export const editFieldValidation = async (
    fetchedUser: FullUser | null,
    options: EditUserInput
): Promise<FieldError[] | null> => {
    if (options.field == "email" && !emailRegex.test(options.newValue)) {
        return [
            {
                field: "email",
                error: "Invalid email adress",
            },
        ];
    } else if (
        options.field == "username" &&
        (options.newValue.length < 2 || options.newValue.length > 32)
    ) {
        return [
            {
                field: "username",
                error: "Username must be between 2 and 32 characters",
            },
        ];
    } else if (
        options.field == "password" &&
        (options.newValue.length < 5 || options.newValue.length > 32)
    ) {
        return [
            {
                field: "password",
                error: "Password must be between 5 and 32 characters",
            },
        ];
    }
    if (fetchedUser) {
        const valid = await argon2.verify(
            fetchedUser.password,
            options.password + fetchedUser.salt
        );
        if (!valid) {
            return [
                {
                    field: "password",
                    error: "Incorrect password.",
                },
            ];
        }
    } else {
        return [
            {
                field: "n/a",
                error: "Invalid authorization. Rerouting to login.",
            },
        ];
    }

    return null;
};

export const editfieldErrorHandling = (error: ApolloError): FieldError[] => {
    if (error.code == "P2002") {
        if (error.message.includes("email")) {
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
                    error:
                        "There was an error generating your credentials. Please try again.",
                },
            ];
        }
    } else {
        return [
            {
                field: "n/a",
                error: "An unkown error occured",
            },
        ];
    }
};
