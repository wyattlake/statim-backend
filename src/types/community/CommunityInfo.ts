import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class CommunityInfo {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    uuid!: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();
}
