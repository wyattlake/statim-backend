import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../misc/FieldError";
import { CommunityInfo } from "./CommunityInfo";

@ObjectType()
export class CommunityResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => CommunityInfo, { nullable: true })
    community?: CommunityInfo;
}
