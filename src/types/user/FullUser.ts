import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FullUser {
    @Field(() => String)
    uuid!: string;

    @Field(() => String)
    email!: string;

    @Field(() => String)
    username!: string;

    @Field(() => String)
    salt!: string;

    @Field(() => String)
    password!: string;
}
