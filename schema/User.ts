import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class User {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();

    @Field()
    email: string;

    @Field(() => String)
    username?: string;
}
