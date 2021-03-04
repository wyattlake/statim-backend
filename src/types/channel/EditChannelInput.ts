import { InputType, Field } from "type-graphql";
import { ChannelField } from "./FieldEnum";

@InputType()
export class EditChannelInput {
    @Field(() => ChannelField)
    field!: ChannelField;

    @Field(() => String)
    channelId!: string;

    @Field(() => String)
    newValue!: string;

    @Field(() => String)
    userId!: string;
}
