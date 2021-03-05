import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { ChannelResponse } from "../types/channel/ChannelResponse";
import { nanoid } from "nanoid";
import {
    createChannelErrorHandling,
    createChannelValidation,
} from "../validation/createChannelValidation";
import { Message, MessageSelect } from "../types/message/Message";
import { EditChannelInput } from "../types/channel/EditChannelInput";
import { updateChannelValidation } from "../validation/updateChannelValidation";

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

    @Mutation(() => ChannelResponse)
    async updateChannelField(
        @Arg("options", () => EditChannelInput) options: EditChannelInput,
        @Ctx() ctx: Context
    ): Promise<ChannelResponse> {
        const fetchedChannel = await ctx.prisma.channel.findUnique({
            where: {
                uuid: options.channelId,
            },
            select: {
                community: {
                    select: {
                        creator: {
                            select: {
                                uuid: true,
                            },
                        },
                    },
                },
            },
        });
        let errors = updateChannelValidation(fetchedChannel, options);
        if (errors) return { errors };
        let newData;
        if (options.field == "name") {
            newData = {
                name: options.newValue,
            };
        } else {
            newData = {
                description: options.newValue,
            };
        }
        let channel;
        try {
            const result = await ctx.prisma.channel.update({
                where: {
                    uuid: options.channelId,
                },
                data: newData,
            });
            channel = result;
        } catch (error) {
            return {
                errors: [
                    {
                        field: "n/a",
                        error: "An unknown error occurred",
                    },
                ],
            };
        }
        return { channel };
    }

    @Mutation(() => Boolean, { nullable: true })
    async deleteChannel(
        @Arg("channelId") channelId: string,
        @Arg("userId") userId: string,
        @Ctx() ctx: Context
    ): Promise<boolean | null> {
        const { count } = await ctx.prisma.channel.deleteMany({
            where: {
                uuid: channelId,
                community: {
                    creator: {
                        uuid: userId,
                    },
                },
            },
        });
        if (count > 0) {
            return true;
        }
        return null;
    }
}
