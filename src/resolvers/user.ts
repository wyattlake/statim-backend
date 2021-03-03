import "reflect-metadata";
import { User } from "../schema/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "src/types";
import { nanoid } from "nanoid";
import argon2 from "argon2";

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async fetch_users(@Ctx() ctx: Context) {
        const users: User[] = await ctx.prisma.user.findMany();
        return users;
    }

    @Mutation(() => User)
    async create_user(
        @Arg("username", () => String) username: string,
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
        @Ctx() ctx: Context
    ): Promise<User> {
        const salt = nanoid();
        const hashedPassword = await argon2.hash(password + salt);
        const user = await ctx.prisma.user.create({
            data: {
                username,
                salt,
                email,
                password: hashedPassword,
            },
        });
        return user;
    }
}
