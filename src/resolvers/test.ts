import "reflect-metadata";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class TestResolver {
    @Query(() => String)
    test() {
        return "Success!";
    }
}
