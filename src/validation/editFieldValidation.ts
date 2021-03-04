import { FieldError } from "../types/misc/FieldError";
import { EditUserInput } from "../types/user/EditUserInput";
import argon2 from "argon2";
import { FullUser } from "../types/user/FullUser";
import { emailRegex } from "../constants";

export const editFieldValidation = (
    fetchedUser: FullUser | null,
    options: EditUserInput
): FieldError[] | null => {
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
        if (
            !argon2.verify(
                fetchedUser.password,
                options.password + fetchedUser.salt
            )
        ) {
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
