import "reflect-metadata";
import { User, UserSelect } from "../types/user/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
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
import { FullUser } from "../types/user/FullUser";
import { UserResponse } from "../types/user/UserResponse";
import { AuthUserSelect } from "../types/user/AuthUser";

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async fetchUsers(@Ctx() ctx: Context) {
        const users: User[] = await ctx.prisma.user.findMany({
            select: UserSelect,
        });
        return users;
    }

    @Query(() => User, { nullable: true })
    async fetchUser(
        @Arg("userId") userId: string,
        @Ctx() ctx: Context
    ): Promise<User | null> {
        const user = await ctx.prisma.user.findUnique({
            where: {
                uuid: userId,
            },
            select: UserSelect,
        });
        return user;
    }

    @Mutation(() => Boolean, { nullable: true })
    async deleteUser(
        @Arg("userId") userId: string,
        @Ctx() ctx: Context
    ): Promise<boolean | null> {
        try {
            await ctx.prisma.user.delete({
                where: {
                    uuid: userId,
                },
            });
        } catch (_) {
            return null;
        }
        return true;
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg("options", () => FullUserInput) options: FullUserInput,
        @Ctx() ctx: Context
    ): Promise<UserResponse> {
        const salt = nanoid(21);
        const hashedPassword = await argon2.hash(options.password + salt);
        const errors = createUserValidation(options);
        if (errors) return { errors };
        let user;
        try {
            const result = await ctx.prisma.user.create({
                data: {
                    username: options.username,
                    uuid: nanoid(21),
                    salt,
                    email: options.email,
                    password: hashedPassword,
                },
                select: AuthUserSelect,
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
        const fetchedUser: FullUser | null = await ctx.prisma.user.findUnique({
            where: {
                uuid: options.uuid,
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
            const uuid = nanoid(21);
            const hashedPassword = await argon2.hash(
                options.newValue + fetchedUser!.salt
            );
            newData = {
                uuid,
                password: hashedPassword,
            };
        }

        let user;
        try {
            const result = await ctx.prisma.user.update({
                where: {
                    uuid: options.uuid,
                },
                data: newData,
                select: AuthUserSelect,
            });
            user = result;
        } catch (error) {
            const errors = editfieldErrorHandling(error);
            return { errors };
        }

        return { user };
    }
}
