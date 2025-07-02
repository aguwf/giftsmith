import { ExecArgs } from "@medusajs/framework/types"
import { PRODUCT_TYPES_MODULE } from "../modules/product-types"
import ProductTypeService from "../modules/product-types/service"

export default async function migrateProductTypes({ container }: ExecArgs) {
  const productTypeService = container.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService

  console.log("Starting product types migration...")

  try {
    // Check if product types already exist
    const existingTypes = await productTypeService.listAllProductTypes()
    
    if (existingTypes.length > 0) {
      console.log(`Found ${existingTypes.length} existing product types. Skipping migration.`)
      return
    }

    // Gift Box Product Type
    console.log("Creating Gift Box product type...")
    const giftBoxType = await productTypeService.createProductType({
      name: "Gift Box",
      slug: "gift-box",
      description: "Customizable gift boxes with various items",
      is_active: true,
      field_schema: [
        {
          name: "box_size",
          type: "select",
          label: "Box Size",
          required: true,
          options: ["small", "medium", "large", "extra-large"],
          description: "Size of the gift box"
        },
        {
          name: "box_color",
          type: "text",
          label: "Box Color",
          required: true,
          description: "Color of the gift box"
        },
        {
          name: "max_items",
          type: "number",
          label: "Maximum Items",
          required: true,
          validation: {
            min: 1,
            max: 20
          },
          description: "Maximum number of items that can fit in the box"
        },
        {
          name: "personalization_available",
          type: "boolean",
          label: "Personalization Available",
          required: false,
          description: "Whether personalization is available for this box"
        },
        {
          name: "personalization_text",
          type: "text",
          label: "Personalization Text",
          required: false,
          description: "Text to be personalized on the box"
        }
      ]
    })

    // Gift Item Product Type
    console.log("Creating Gift Item product type...")
    const giftItemType = await productTypeService.createProductType({
      name: "Gift Item",
      slug: "gift-item",
      description: "Individual gift items that can be added to gift boxes",
      is_active: true,
      field_schema: [
        {
          name: "item_category",
          type: "select",
          label: "Item Category",
          required: true,
          options: ["chocolate", "candy", "toy", "cosmetic", "jewelry", "book", "other"],
          description: "Category of the gift item"
        },
        {
          name: "item_size",
          type: "select",
          label: "Item Size",
          required: true,
          options: ["tiny", "small", "medium", "large"],
          description: "Size of the item"
        },
        {
          name: "fragile",
          type: "boolean",
          label: "Fragile Item",
          required: false,
          description: "Whether the item is fragile and needs special handling"
        },
        {
          name: "expiry_date",
          type: "date",
          label: "Expiry Date",
          required: false,
          description: "Expiry date for perishable items"
        },
        {
          name: "allergen_info",
          type: "text",
          label: "Allergen Information",
          required: false,
          description: "Allergen information for food items"
        }
      ]
    })

    // Gift Card Product Type
    console.log("Creating Gift Card product type...")
    const giftCardType = await productTypeService.createProductType({
      name: "Gift Card",
      slug: "gift-card",
      description: "Digital and physical gift cards",
      is_active: true,
      field_schema: [
        {
          name: "card_type",
          type: "select",
          label: "Card Type",
          required: true,
          options: ["digital", "physical"],
          description: "Type of gift card"
        },
        {
          name: "denomination",
          type: "number",
          label: "Denomination",
          required: true,
          validation: {
            min: 1
          },
          description: "Value of the gift card"
        },
        {
          name: "validity_period",
          type: "number",
          label: "Validity Period (months)",
          required: true,
          validation: {
            min: 1,
            max: 60
          },
          description: "Number of months the card is valid"
        },
        {
          name: "customizable_message",
          type: "boolean",
          label: "Customizable Message",
          required: false,
          description: "Whether customers can add a custom message"
        },
        {
          name: "design_template",
          type: "select",
          label: "Design Template",
          required: false,
          options: ["birthday", "anniversary", "christmas", "valentine", "generic"],
          description: "Design template for the gift card"
        }
      ]
    })

    console.log("✅ Product types migration completed successfully!")
    console.log("Created product types:")
    console.log(`- Gift Box: ${giftBoxType.id}`)
    console.log(`- Gift Item: ${giftItemType.id}`)
    console.log(`- Gift Card: ${giftCardType.id}`)

  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
} 