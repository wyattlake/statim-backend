import { ObjectType, Field } from "type-graphql";
import { User } from "../user/User";

@ObjectType()
export class Profile {
    @Field(() => User)
    user!: User;

    @Field(() => String, { nullable: true })
    bio?: string | null;
}
