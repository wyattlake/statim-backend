import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { nanoid } from "nanoid";
import { CommunityResponse } from "../types/community/CommunityResponse";
import {
    createCommunityErrorHandling,
    createCommunityValidation,
} from "../validation/createCommunityValidation";

@Resolver()
export class CommunityResolver {
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
