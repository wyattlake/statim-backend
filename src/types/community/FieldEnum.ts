import { registerEnumType } from "type-graphql";

export enum CommunityField {
    Name = "name",
    Description = "description",
}

registerEnumType(CommunityField, {
    name: "CommunityField",
});
