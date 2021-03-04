import { ObjectType, Field } from "type-graphql";
import { User, UserSelect } from "../user/User";

@ObjectType()
export class Message {
    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();

    @Field(() => String)
    content: string;

    @Field(() => User)
    user: User | null;
}

export const MessageSelect = {
    createdAt: true,
    updatedAt: true,
    content: true,
    user: {
        select: UserSelect,
    },
};
