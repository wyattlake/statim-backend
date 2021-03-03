import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Profile {
    @Field(() => ID)
    id: number;

    @Field(() => User)
    user: User;

    @Field(() => String, { nullable: true })
    bio?: string | null;
}
