import "reflect-metadata";
import { User } from "../schema/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserResponse } from "../schema/UserResponse";
import { Context } from "src/types";
import { nanoid } from "nanoid";
import argon2 from "argon2";

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async fetchUsers(@Ctx() ctx: Context) {
        const users: User[] = await ctx.prisma.user.findMany();
        return users;
    }

    @Query(() => User, { nullable: true })
    async fetchUser(
        @Arg("id") id: number,
        @Ctx() ctx: Context
    ): Promise<User | null> {
        const users = await ctx.prisma.user.findUnique({
            where: {
                id,
            },
        });
        return users;
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg("username", () => String) username: string,
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
        @Ctx() ctx: Context
    ): Promise<UserResponse> {
        const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if (!emailRegex.test(email)) {
            return {
                errors: [
                    {
                        field: "email",
                        error: "Invalid email address",
                    },
                ],
            };
        }
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
        return {
            user,
        };
    }
}
