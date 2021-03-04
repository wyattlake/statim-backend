import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../misc/FieldError";
import { Message } from "./Message";

@ObjectType()
export class MessageResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Message, { nullable: true })
    message?: Message;
}
