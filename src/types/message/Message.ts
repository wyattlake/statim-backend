import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";
import { User } from "../user/User";

@ObjectType()
export class Message {
    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();

    @Field(() => String)
    content!: string;

    @Field(() => User)
    user!: User;
}
