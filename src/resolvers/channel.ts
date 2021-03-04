import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { ChannelResponse } from "../types/channel/ChannelResponse";
import { nanoid } from "nanoid";
import {
    createChannelErrorHandling,
    createChannelValidation,
} from "../validation/createChannelValidation";
import { Message, MessageSelect } from "../types/message/Message";

@Resolver()
export class ChannelResolver {
    @Query(() => [Message], { nullable: true })
    async fetchMessages(
        @Arg("channelId") channelId: string,
        @Arg("cursor", () => Number, { nullable: true }) cursor: number | null,
        @Arg("take") take: number,
        @Ctx() ctx: Context
    ): Promise<Message[] | null> {
        let result;
        if (cursor) {
            result = await ctx.prisma.channel.findUnique({
                where: {
                    uuid: channelId,
                },
                select: {
                    messages: {
                        take,
                        skip: 1,
                        cursor: {
                            id: cursor,
                        },
                        orderBy: {
                            id: "asc",
                        },
                        select: MessageSelect,
                    },
                },
            });
        } else {
            result = await ctx.prisma.channel.findUnique({
                where: {
                    uuid: channelId,
                },
                select: {
                    messages: {
                        take,
                        orderBy: {
                            id: "asc",
                        },
                        select: MessageSelect,
                    },
                },
            });
        }
        if (result) {
            return result.messages;
        }
        return null;
    }
    @Mutation(() => ChannelResponse)
    async createChannel(
        @Arg("communityId") communityId: string,
        @Arg("name") name: string,
        @Ctx() ctx: Context
    ): Promise<ChannelResponse> {
        let errors = createChannelValidation(name);
        if (errors) return { errors };
        let channel;
        try {
            const result = await ctx.prisma.channel.create({
                data: {
                    uuid: nanoid(21),
                    name,
                    community: { connect: { uuid: communityId } },
                },
            });
            channel = result;
        } catch (error) {
            errors = createChannelErrorHandling(error);
            return { errors };
        }
        return { channel };
    }
}
