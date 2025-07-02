import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_TYPES_MODULE } from "../../../modules/product-types"
import ProductTypeService from "../../../modules/product-types/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productTypeService = req.scope.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService
  
  try {
    const productTypes = await productTypeService.listAllProductTypes()
    
    // Only return active product types for the storefront
    const activeProductTypes = productTypes.filter(pt => pt.is_active)
    
    res.json({ product_types: activeProductTypes })
  } catch (error) {
    console.error("Error fetching product types:", error)
    res.status(500).json({ error: "Failed to fetch product types" })
  }
} 