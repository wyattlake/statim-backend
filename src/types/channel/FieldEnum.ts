import { registerEnumType } from "type-graphql";

export enum ChannelField {
    Name = "name",
    Description = "description",
}

registerEnumType(ChannelField, {
    name: "ChannelField",
});
