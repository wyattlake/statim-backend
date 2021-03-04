import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "vm";
import { Message } from "../types/message/Message";

@Resolver()
export class MessageResolver {
    @Mutation(() => Message)
    async sendMessage(
        @Arg("content", () => String) content: string,
        @Arg("auth", () => String) auth: string,
        @Ctx() ctx: Context
    ): Promise<Message> {
        const message: Message = await ctx.prisma.message.create({
            data: {
                content,
                user: {
                    connect: { auth },
                },
            },
            include: {
                user: {
                    select: {
                        createdAt: true,
                        updatedAt: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
        return message;
    }
}
