import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class User {
    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();

    @Field()
    email!: string;

    @Field(() => String)
    username!: string;
}

export const UserSelect = {
    createdAt: true,
    updatedAt: true,
    email: true,
    username: true,
};
