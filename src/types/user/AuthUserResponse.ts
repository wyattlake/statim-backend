import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../misc/FieldError";
import { AuthUser } from "./AuthUser";

@ObjectType()
export class AuthUserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => AuthUser, { nullable: true })
    user?: AuthUser;
}
