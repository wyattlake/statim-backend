import { registerEnumType } from "type-graphql";

export enum UserField {
    Username = "username",
    Email = "email",
    Password = "password",
}

registerEnumType(UserField, {
    name: "UserField",
});
