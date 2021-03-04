import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../misc/FieldError";
import { ChannelInfo } from "./ChannelInfo";

@ObjectType()
export class ChannelResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => ChannelInfo, { nullable: true })
    channel?: ChannelInfo;
}
