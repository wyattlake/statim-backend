import { EditCommunityInput } from "../types/community/EditCommunityInput";
import { FieldError } from "../types/misc/FieldError";

type CommunityWithCreator = {
    creator: {
        uuid: string;
    };
};

export const updateCommunityValidation = (
    fetchedCommunity: CommunityWithCreator | null,
    options: EditCommunityInput
): FieldError[] | null => {
    if (!fetchedCommunity) {
        return [
            {
                field: "communityId",
                error: "Invalid community ID",
            },
        ];
    }
    if (fetchedCommunity.creator.uuid != options.userId) {
        return [
            {
                field: "userId",
                error: "User does not have permission to modify this channel",
            },
        ];
    }
    if (
        options.field == "description" &&
        (options.newValue.length < 2 || options.newValue.length > 200)
    ) {
        return [
            {
                field: "newValue",
                error: "New description must be between 2 and 200 characters",
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
                error: "Community name must be between 2 and 32 characters",
            },
        ];
    }
    return null;
};
