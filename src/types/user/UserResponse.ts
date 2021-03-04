import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../misc/FieldError";
import { AuthUser } from "./AuthUser";

@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => AuthUser, { nullable: true })
    user?: AuthUser;
}
