import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ChannelInfo {
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

export const ChannelInfoSelect = {
    uuid: true,
    createdAt: true,
    updatedAt: true,
    name: true,
    description: true,
};
