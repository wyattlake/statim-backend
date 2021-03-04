import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { ChannelInfo } from "../types/channel/ChannelInfo";
import { nanoid } from "nanoid";
import { CommunityInfo } from "../types/community/CommunityInfo";

@Resolver()
export class CommunityResolver {
    @Mutation(() => ChannelInfo)
    async createCommunity(
        @Arg("creatorId") creatorId: string,
        @Arg("name") name: string,
        @Ctx() ctx: Context
    ): Promise<CommunityInfo> {
        const community = await ctx.prisma.community.create({
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
        return community;
    }
}
