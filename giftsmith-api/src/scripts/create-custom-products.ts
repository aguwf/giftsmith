import { ExecArgs } from "@medusajs/framework/types"
import ProductTypeService from "../modules/product-types/service"

export default async function createCustomProducts({ container }: ExecArgs) {
  console.log("🚀 Creating custom products with attributes...")

  try {
    // Get product module service
    const productModuleService = container.resolve("product")
    
    // Get product types service
    const productTypeService = container.resolve("product_types") as ProductTypeService

    // Get all existing products
    const [products] = await productModuleService.listAndCountProducts()
    console.log(`Found ${products.length} existing products`)

    // Get all product types
    const productTypes = await productTypeService.listAllProductTypes()
    console.log(`Found ${productTypes.length} product types`)

    if (productTypes.length === 0) {
      console.log("❌ No product types found. Please create product types first.")
      return
    }

    let createdCount = 0
    let skippedCount = 0

    for (const product of products) {
      try {
        // Check if custom product already exists
        const existingCustomProduct = await productTypeService.getCustomProduct(product.id)
        
        if (existingCustomProduct) {
          console.log(`⏭️  Skipping ${product.title} (already has custom attributes)`)
          skippedCount++
          continue
        }

        // Determine product type based on title/handle
        let productTypeId: string | undefined = undefined
        let customAttributes: Record<string, any> = {}

        const title = product.title?.toLowerCase() || ""
        const handle = product.handle?.toLowerCase() || ""

        // Find matching product type
        if (title.includes("gift box") || title.includes("box") || handle.includes("gift-box")) {
          const giftBoxType = productTypes.find(pt => pt.slug === "gift-box")
          if (giftBoxType) {
            productTypeId = giftBoxType.id
            customAttributes = {
              box_size: "medium",
              box_color: "white",
              max_items: 5,
              personalization_available: true
            }
          }
        } else if (title.includes("gift card") || title.includes("card") || handle.includes("gift-card")) {
          const giftCardType = productTypes.find(pt => pt.slug === "gift-card")
          if (giftCardType) {
            productTypeId = giftCardType.id
            customAttributes = {
              card_type: "digital",
              denomination: 50,
              validity_period: 12,
              customizable_message: true,
              design_template: "generic"
            }
          }
        } else {
          // Default to gift item
          const giftItemType = productTypes.find(pt => pt.slug === "gift-item")
          if (giftItemType) {
            productTypeId = giftItemType.id
            customAttributes = {
              item_category: "other",
              item_size: "medium",
              fragile: false
            }
          }
        }

        if (productTypeId) {
          // Validate custom attributes
          const validationErrors = await productTypeService.validateCustomAttributes(
            productTypeId,
            customAttributes
          )

          if (validationErrors.length > 0) {
            console.log(`⚠️  Validation errors for ${product.title}:`, validationErrors)
            continue
          }

          // Create custom product
          await productTypeService.createCustomProduct({
            product_id: product.id,
            product_type_id: productTypeId,
            custom_attributes: customAttributes
          })

          console.log(`✅ Created custom product: ${product.title}`)
          createdCount++
        } else {
          console.log(`⚠️  No suitable product type found for: ${product.title}`)
          skippedCount++
        }

      } catch (error) {
        console.error(`❌ Failed to create custom product for ${product.title}:`, error)
        skippedCount++
      }
    }

    console.log("\n📊 Summary:")
    console.log(`- Created: ${createdCount} custom products`)
    console.log(`- Skipped: ${skippedCount} products`)
    console.log(`- Total processed: ${products.length} products`)

    console.log("\n🎉 Custom products creation completed!")
    console.log("\n📚 Next steps:")
    console.log("1. Use the API to view custom products:")
    console.log("   GET /admin/custom-products")
    console.log("2. Filter by product type:")
    console.log("   GET /admin/custom-products?product_type_id=xxx")
    console.log("3. Update custom attributes as needed")

  } catch (error) {
    console.error("❌ Failed to create custom products:", error)
    throw error
  }
} 