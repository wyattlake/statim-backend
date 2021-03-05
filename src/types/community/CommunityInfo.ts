import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class CommunityInfo {
    @Field(() => String)
    uuid!: string;

    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    description: string | null;

    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();
}

export const CommunitySelect = {
    uuid: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    description: true,
};
