import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { ChannelInfo } from "../types/channel/ChannelInfo";
import { nanoid } from "nanoid";

@Resolver()
export class ChannelResolver {
    @Mutation(() => ChannelInfo)
    async createChannel(
        @Arg("communityId") communityId: string,
        @Arg("name") name: string,
        @Ctx() ctx: Context
    ): Promise<ChannelInfo> {
        const channel = await ctx.prisma.channel.create({
            data: {
                uuid: nanoid(21),
                name,
                community: { connect: { uuid: communityId } },
            },
        });
        return channel;
    }
}
