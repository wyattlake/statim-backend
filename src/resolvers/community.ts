import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../types/misc/Context";
import { nanoid } from "nanoid";
import { CommunityResponse } from "../types/community/CommunityResponse";
import {
    createCommunityErrorHandling,
    createCommunityValidation,
} from "../validation/createCommunityValidation";
import { ChannelInfo, ChannelInfoSelect } from "../types/channel/ChannelInfo";
import { EditCommunityInput } from "../types/community/EditCommunityInput";
import { updateCommunityValidation } from "../validation/updateCommunityValidation";

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
                    description: null,
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

    @Mutation(() => CommunityResponse)
    async updateCommunity(
        @Arg("options", () => EditCommunityInput) options: EditCommunityInput,
        @Ctx() ctx: Context
    ): Promise<CommunityResponse> {
        const fetchedCommunity = await ctx.prisma.community.findUnique({
            where: {
                uuid: options.communityId,
            },
            select: {
                creator: {
                    select: {
                        uuid: true,
                    },
                },
            },
        });
        let errors = updateCommunityValidation(fetchedCommunity, options);
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
        let community;
        try {
            const result = await ctx.prisma.community.update({
                where: {
                    uuid: options.communityId,
                },
                data: newData,
            });
            community = result;
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
        return { community };
    }

    @Mutation(() => Boolean, { nullable: true })
    async deleteCommunity(
        @Arg("communityId") communityId: string,
        @Arg("userId") userId: string,
        @Ctx() ctx: Context
    ): Promise<boolean | null> {
        const { count } = await ctx.prisma.community.deleteMany({
            where: {
                uuid: communityId,
                creator: {
                    uuid: userId,
                },
            },
        });
        if (count > 0) {
            return true;
        }
        return null;
    }
}
