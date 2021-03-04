import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class ChannelInfo {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    uuid!: string;

    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();

    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    description: string | null;
}
