import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class FieldError {
    @Field()
    field!: string;

    @Field()
    error!: string;
}
