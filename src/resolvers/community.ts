import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { nanoid } from "nanoid";
import { CommunityResponse } from "../types/community/CommunityResponse";
import {
    createCommunityErrorHandling,
    createCommunityValidation,
} from "../validation/createCommunityValidation";
import { ChannelInfo, ChannelInfoSelect } from "../types/channel/ChannelInfo";

@Resolver()
export class CommunityResolver {
    @Query(() => [ChannelInfo], { nullable: true })
    async listChannels(
        @Arg("communityId") communityId: string,
        @Ctx() ctx: Context
    ): Promise<ChannelInfo[] | null> {
        const result = await ctx.prisma.community.findUnique({
            where: {
                uuid: communityId,
            },
            select: {
                channels: {
                    select: ChannelInfoSelect,
                },
            },
        });
        if (result) {
            return result.channels;
        }
        return null;
    }
    @Mutation(() => CommunityResponse)
    async createCommunity(
        @Arg("creatorId") creatorId: string,
        @Arg("name") name: string,
        @Ctx() ctx: Context
    ): Promise<CommunityResponse> {
        let errors = createCommunityValidation(name);
        if (errors) return { errors };
        let community;
        try {
            const result = await ctx.prisma.community.create({
                data: {
                    uuid: nanoid(21),
                    name,
                    creator: {
                        connect: { uuid: creatorId },
                    },
                    users: {},
                    channels: {},
                },
            });
            community = result;
        } catch (error) {
            errors = createCommunityErrorHandling(error);
            return { errors };
        }
        return { community };
    }
}
