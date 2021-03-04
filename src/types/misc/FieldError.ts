import { ObjectType, Field } from "type-graphql";
import "reflect-metadata";

@ObjectType()
export class FieldError {
    @Field()
    field!: string;

    @Field()
    error!: string;
}
