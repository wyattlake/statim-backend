import "reflect-metadata";
import { User } from "../types/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserResponse } from "../types/UserResponse";
import { Context } from "../types";
import { nanoid } from "nanoid";
import argon2 from "argon2";
import { FullUserInput } from "../types/FullUserInput";
import {
    createUserErrorHandling,
    createUserValidation,
} from "../validation/createUserValidation";

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
        const user = await ctx.prisma.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg("options", () => FullUserInput) options: FullUserInput,
        @Ctx() ctx: Context
    ): Promise<UserResponse> {
        const salt = nanoid();
        const hashedPassword = await argon2.hash(options.password + salt);
        const errors = createUserValidation(options);
        if (errors) return { errors };
        let user;
        try {
            const result = await ctx.prisma.user.create({
                data: {
                    username: options.username,
                    salt,
                    email: options.email,
                    password: hashedPassword,
                },
            });
            user = result;
        } catch (error) {
            const errors = createUserErrorHandling(error);
            return { errors };
        }
        return {
            user,
        };
    }
}
