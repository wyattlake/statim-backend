import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { ChannelResponse } from "../types/channel/ChannelResponse";
import { nanoid } from "nanoid";
import {
    createChannelErrorHandling,
    createChannelValidation,
} from "../validation/createChannelValidation";

@Resolver()
export class ChannelResolver {
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
