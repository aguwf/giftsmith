import { ContentTypeDefinition } from "./types";

export const bannerGroupContentType: ContentTypeDefinition = {
  name: "Banner Group",
  description: "Main model for creating banner displays",
  displayField: "groupName",
  fields: [
    {
      id: "groupName",
      name: "Group Name",
      type: "Symbol",
      required: true,
      localized: true,
    },
    {
      id: "groupCode",
      name: "Group Code",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "bannerItems",
      name: "Banner Items",
      type: "Array",
      required: true,
      localized: false,
      items: {
        type: "Link",
        linkType: "Entry",
        validations: [
          {
            linkContentType: ["bannerItem"],
          },
        ],
      },
    },
    {
      id: "displayType",
      name: "Display Type",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        {
          in: ["Single Image", "Auto Carousel", "Manual Carousel", "Grid Layout"],
        },
      ],
    },
    // Carousel Settings
    {
      id: "autoPlay",
      name: "Auto Play",
      type: "Boolean",
      required: false,
      localized: false,
    },
    {
      id: "autoPlaySpeed",
      name: "Auto Play Speed (seconds)",
      type: "Integer",
      required: false,
      localized: false,
    },
    {
      id: "showDots",
      name: "Show Dots",
      type: "Boolean",
      required: false,
      localized: false,
    },
    {
      id: "showArrows",
      name: "Show Arrows",
      type: "Boolean",
      required: false,
      localized: false,
    },
    {
      id: "infiniteLoop",
      name: "Infinite Loop",
      type: "Boolean",
      required: false,
      localized: false,
    },
    // Grid Settings
    {
      id: "desktopColumns",
      name: "Desktop Columns",
      type: "Integer",
      required: false,
      localized: false,
      validations: [
        {
          range: {
            min: 1,
            max: 4,
          },
        },
      ],
    },
    {
      id: "tabletColumns",
      name: "Tablet Columns",
      type: "Integer",
      required: false,
      localized: false,
      validations: [
        {
          range: {
            min: 1,
            max: 3,
          },
        },
      ],
    },
    {
      id: "mobileColumns",
      name: "Mobile Columns",
      type: "Integer",
      required: false,
      localized: false,
      validations: [
        {
          range: {
            min: 1,
            max: 2,
          },
        },
      ],
    },
    // Banner Size
    {
      id: "height",
      name: "Height",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        {
          in: ["Small (200px)", "Medium (400px)", "Large (600px)", "Full Screen"],
        },
      ],
    },
    {
      id: "aspectRatio",
      name: "Aspect Ratio",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        {
          in: ["16:9", "4:3", "1:1", "Free"],
        },
      ],
    },
  ],
}; 