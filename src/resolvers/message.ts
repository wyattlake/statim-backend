import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { Message } from "../types/message/Message";
import { UserSelect } from "../types/user/User";
import {
    sendMessageErrorHandling,
    sendMessageValidation,
} from "../validation/sendMessageValidation";
import { MessageResponse } from "../types/message/MessageResponse";

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

    @Mutation(() => MessageResponse)
    async sendMessage(
        @Arg("content", () => String) content: string,
        @Arg("userId", () => String) userId: string,
        @Arg("channelId", () => String) channelId: string,
        @Ctx() ctx: Context
    ): Promise<MessageResponse> {
        let errors = sendMessageValidation(content);
        if (errors) return { errors };
        let message;
        try {
            const result = await ctx.prisma.message.create({
                data: {
                    content,
                    user: {
                        connect: { uuid: userId },
                    },
                    channel: {
                        connect: { uuid: channelId },
                    },
                },
                include: {
                    user: {
                        select: UserSelect,
                    },
                },
            });
            message = result;
        } catch (error) {
            errors = sendMessageErrorHandling(error);
            if (errors) return { errors };
        }
        return { message };
    }
}
