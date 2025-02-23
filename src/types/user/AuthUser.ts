import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class AuthUser {
    @Field(() => String)
    uuid!: string;

    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();

    @Field()
    email!: string;

    @Field(() => String)
    username!: string;
}

export const AuthUserSelect = {
    uuid: true,
    createdAt: true,
    updatedAt: true,
    email: true,
    username: true,
};
