import { ContentTypeDefinition } from "./types";

export const productVariantContentType: ContentTypeDefinition = {
  name: "Product Variant",
  description: "Product variant content type synced from Medusa",
  displayField: "title",
  fields: [
    {
      id: "title",
      name: "Title",
      type: "Symbol",
      required: true,
      localized: true,
    },
    {
      id: "product",
      name: "Product",
      type: "Link",
      required: true,
      localized: false,
      validations: [
        {
          linkContentType: ["product"],
        },
      ],
      disabled: false,
      omitted: false,
      linkType: "Entry",
    },
    {
      id: "medusaId",
      name: "Medusa ID",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "productOptionValues",
      name: "Product Option Values",
      type: "Array",
      localized: false,
      required: false,
      items: {
        type: "Link",
        validations: [
          {
            linkContentType: ["productOptionValue"],
          },
        ],
        linkType: "Entry",
      },
      disabled: false,
      omitted: false,
    },
  ],
}; 