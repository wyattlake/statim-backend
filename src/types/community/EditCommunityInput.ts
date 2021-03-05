import { InputType, Field } from "type-graphql";
import { CommunityField } from "./FieldEnum";

@InputType()
export class EditCommunityInput {
    @Field(() => CommunityField)
    field!: CommunityField;

    @Field(() => String)
    communityId!: string;

    @Field(() => String)
    newValue!: string;

    @Field(() => String)
    userId!: string;
}
