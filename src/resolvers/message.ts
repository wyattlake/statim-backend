import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { Message } from "../types/message/Message";
import { UserSelect } from "../types/user/User";

@Resolver()
export class MessageResolver {
    @Query(() => [Message])
    async fetchMessages(@Ctx() ctx: Context) {
        const messages = ctx.prisma.message.findMany({
            select: {
                content: true,
                user: {
                    select: UserSelect,
                },
            },
        });
        return messages;
    }

    @Mutation(() => Message)
    async sendMessage(
        @Arg("content", () => String) content: string,
        @Arg("auth", () => String) auth: string,
        @Ctx() ctx: Context
    ): Promise<Message> {
        const message = await ctx.prisma.message.create({
            data: {
                content,
                user: {
                    connect: { auth },
                },
            },
            include: {
                user: {
                    select: UserSelect,
                },
            },
        });
        return message;
    }
}
