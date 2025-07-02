import { ContentTypeDefinition } from "./types";

export const productContentType: ContentTypeDefinition = {
  name: "Product",
  description: "Product content type synced from Medusa",
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
      id: "handle",
      name: "Handle",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "medusaId",
      name: "Medusa ID",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      type: "RichText",
      name: "description",
      id: "description",
      validations: [
        {
          enabledMarks: [
            "bold",
            "italic",
            "underline",
            "code",
            "superscript",
            "subscript",
            "strikethrough",
          ],
        },
        {
          nodes: {
            "heading-1": true,
            "heading-2": true,
            "heading-3": true,
            "heading-4": true,
            "heading-5": true,
            "heading-6": true,
            "ordered-list": true,
            "unordered-list": true,
            "hr": true,
            "blockquote": true,
            "embedded-entry-block": true,
            "embedded-asset-block": true,
            "table": true,
            "asset-hyperlink": true,
            "embedded-entry-inline": true,
            "entry-hyperlink": true,
            "hyperlink": true,
          },
        },
      ],
      localized: true,
      required: true,
    },
    {
      type: "Symbol",
      name: "subtitle",
      id: "subtitle",
      localized: true,
      required: false,
      validations: [],
    },
    {
      type: "Array",
      items: {
        type: "Link",
        linkType: "Asset",
        validations: [],
      },
      name: "images",
      id: "images",
      localized: true,
      required: false,
      validations: [],
    },
    {
      id: "productVariants",
      name: "Product Variants",
      type: "Array",
      localized: false,
      required: false,
      items: {
        type: "Link",
        validations: [
          {
            linkContentType: ["productVariant"],
          },
        ],
        linkType: "Entry",
      },
      disabled: false,
      omitted: false,
    },
    {
      id: "productOptions",
      name: "Product Options",
      type: "Array",
      localized: false,
      required: false,
      items: {
        type: "Link",
        validations: [
          {
            linkContentType: ["productOption"],
          },
        ],
        linkType: "Entry",
      },
      disabled: false,
      omitted: false,
    },
  ],
}; 