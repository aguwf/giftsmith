import { ContentTypeDefinition } from "./types";

export const productOptionContentType: ContentTypeDefinition = {
  name: "Product Option",
  description: "Product option content type synced from Medusa",
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
      id: "values",
      name: "Values",
      type: "Array",
      required: false,
      localized: false,
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