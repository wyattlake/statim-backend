import "reflect-metadata";
import { User } from "../types/user/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserResponse } from "../types/user/UserResponse";
import { Context } from "../types/misc/Context";
import { nanoid } from "nanoid";
import argon2 from "argon2";
import { FullUserInput } from "../types/user/FullUserInput";
import {
    createUserErrorHandling,
    createUserValidation,
} from "../validation/createUserValidation";
import { EditUserInput } from "../types/user/EditUserInput";
import {
    editfieldErrorHandling,
    editFieldValidation,
} from "../validation/editFieldValidation";

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async fetchUsers(@Ctx() ctx: Context) {
        const users: User[] = await ctx.prisma.user.findMany();
        return users;
    }

    @Query(() => User, { nullable: true })
    async fetchUser(
        @Arg("auth") auth: string,
        @Ctx() ctx: Context
    ): Promise<User | null> {
        const user = await ctx.prisma.user.findUnique({
            where: {
                auth,
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
        const auth = nanoid(21);
        if (errors) return { errors };
        let user;
        try {
            const result = await ctx.prisma.user.create({
                data: {
                    username: options.username,
                    auth,
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

    @Mutation(() => UserResponse)
    async updateUserField(
        @Arg("options", () => EditUserInput) options: EditUserInput,
        @Ctx() ctx: Context
    ): Promise<UserResponse> {
        const fetchedUser = await ctx.prisma.user.findUnique({
            where: {
                auth: options.auth,
            },
        });

        const errors = await editFieldValidation(fetchedUser, options);
        if (errors) return { errors };

        let newData;
        if (options.field == "username") {
            newData = {
                username: options.newValue,
            };
        } else if (options.field == "email") {
            newData = {
                email: options.newValue,
            };
        } else {
            const auth = nanoid(21);
            const hashedPassword = await argon2.hash(
                options.newValue + fetchedUser!.salt
            );
            newData = {
                auth,
                password: hashedPassword,
            };
        }

        let user;
        try {
            const result = await ctx.prisma.user.update({
                where: {
                    auth: options.auth,
                },
                data: newData,
            });
            user = result;
        } catch (error) {
            const errors = editfieldErrorHandling(error);
            return { errors };
        }

        return { user };
    }
}
