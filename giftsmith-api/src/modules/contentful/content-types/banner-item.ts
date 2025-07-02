import { ContentTypeDefinition } from "./types";

export const bannerItemContentType: ContentTypeDefinition = {
  name: "Banner Item",
  description: "Individual banner content",
  displayField: "bannerName",
  fields: [
    {
      id: "bannerName",
      name: "Banner Name",
      type: "Symbol",
      required: true,
      localized: true,
    },
    {
      id: "image",
      name: "Image",
      type: "Link",
      required: true,
      localized: false,
      linkType: "Asset",
      validations: [
        {
          linkMimetypeGroup: ["image"],
        },
      ],
    },
    {
      id: "mobileImage",
      name: "Mobile Image",
      type: "Link",
      required: false,
      localized: false,
      linkType: "Asset",
      validations: [
        {
          linkMimetypeGroup: ["image"],
        },
      ],
    },
    {
      id: "title",
      name: "Title",
      type: "Symbol",
      required: false,
      localized: true,
    },
    {
      id: "description",
      name: "Description",
      type: "Text",
      required: false,
      localized: true,
    },
    {
      id: "linkUrl",
      name: "Link URL",
      type: "Symbol",
      required: false,
      localized: false,
      validations: [
        {
          regexp: {
            pattern: "^https?://",
            flags: "i",
          },
        },
      ],
    },
    {
      id: "openInNewTab",
      name: "Open in New Tab",
      type: "Boolean",
      required: false,
      localized: false,
    },
    {
      id: "displayOrder",
      name: "Display Order",
      type: "Integer",
      required: true,
      localized: false,
      validations: [
        {
          range: {
            min: 1,
          },
        },
      ],
    },
    {
      id: "isActive",
      name: "Is Active",
      type: "Boolean",
      required: true,
      localized: false,
    },
  ],
}; 