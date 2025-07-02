import { ContentTypeDefinition } from "./types";

export const productOptionValueContentType: ContentTypeDefinition = {
  name: "Product Option Value",
  description: "Product option value content type synced from Medusa",
  displayField: "value",
  fields: [
    {
      id: "value",
      name: "Value",
      type: "Symbol",
      required: true,
      localized: true,
    },
    {
      id: "medusaId",
      name: "Medusa ID",
      type: "Symbol",
      required: true,
      localized: false,
    },
  ],
}; 