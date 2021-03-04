import { InputType, Field } from "type-graphql";
import { UserField } from "./FieldEnum";

@InputType()
export class EditUserInput {
    @Field(() => UserField)
    field!: UserField;

    @Field(() => String)
    uuid!: string;

    @Field(() => String)
    newValue!: string;

    @Field(() => String)
    password!: string;
}
