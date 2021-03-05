import { channelRegex } from "../constants";
import { EditChannelInput } from "../types/channel/EditChannelInput";
import { FieldError } from "../types/misc/FieldError";

type ChannelWithCreator = {
    community: {
        creator: {
            uuid: string;
        };
    };
};

export const updateChannelValidation = (
    fetchedChannel: ChannelWithCreator | null,
    options: EditChannelInput
): FieldError[] | null => {
    if (!fetchedChannel) {
        return [
            {
                field: "channelId",
                error: "Invalid channel ID",
            },
        ];
    }
    if (fetchedChannel.community.creator.uuid != options.userId) {
        return [
            {
                field: "userId",
                error: "User does not have permission to modify this channel",
            },
        ];
    }
    if (
        options.field == "description" &&
        (options.newValue.length < 2 || options.newValue.length > 64)
    ) {
        return [
            {
                field: "newValue",
                error: "New description must be between 2 and 64 characters",
            },
        ];
    }
    if (options.field == "name" && !channelRegex.test(options.newValue)) {
        return [
            {
                field: "name",
                error:
                    "Channel name can only have lowercase letters and dashes",
            },
        ];
    }
    if (
        options.field == "name" &&
        (options.newValue.length < 2 || options.newValue.length > 32)
    ) {
        return [
            {
                field: "name",
                error: "Channel name must be between 2 and 32 characters",
            },
        ];
    }
    return null;
};
