import { ContentTypeDefinition } from "./types";

export const bannerTemplateContentType: ContentTypeDefinition = {
  name: "Banner Template",
  description: "Pre-designed banner styles",
  displayField: "templateName",
  fields: [
    {
      id: "templateName",
      name: "Template Name",
      type: "Symbol",
      required: true,
      localized: true,
    },
    {
      id: "description",
      name: "Description",
      type: "Text",
      required: true,
      localized: true,
    },
    {
      id: "previewImage",
      name: "Preview Image",
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
      id: "templateType",
      name: "Template Type",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        {
          in: [
            "Hero Banner",
            "Card Banner",
            "Sidebar Banner",
            "Footer Banner",
          ],
        },
      ],
    },
    {
      id: "templateCode",
      name: "Template Code",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        {
          regexp: {
            pattern: "^[a-z0-9-]+$",
            flags: "i",
          },
        },
      ],
    },
  ],
}; 