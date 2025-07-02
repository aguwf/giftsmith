import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_TYPES_MODULE } from "../../../../../modules/product-types"
import ProductTypeService from "../../../../../modules/product-types/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const productTypeService = req.scope.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService
  const productModuleService = req.scope.resolve("product")
  
  try {
    // Get the Medusa product
    const product = await productModuleService.retrieveProduct(id)
    
    // Get custom product data
    const customProduct = await productTypeService.getCustomProduct(id)
    
    // Get product type info if custom product exists
    let productType: any = null
    if (customProduct) {
      productType = await productTypeService.getProductType(customProduct.product_type_id)
    }
    
    res.json({
      product,
      custom_product: customProduct,
      product_type: productType
    })
  } catch (error) {
    res.status(404).json({ error: "Product not found" })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const productTypeService = req.scope.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService
  const body = req.body as {
    product_type_id: string
    custom_attributes: Record<string, any>
  }
  
  try {
    // Check if custom product already exists
    const existingCustomProduct = await productTypeService.getCustomProduct(id)
    
    if (existingCustomProduct) {
      // Update existing custom product
      const updatedProduct = await productTypeService.updateCustomProduct(existingCustomProduct.id, {
        product_type_id: body.product_type_id,
        custom_attributes: body.custom_attributes
      })
      res.json({ custom_product: updatedProduct })
    } else {
      // Create new custom product
      const newCustomProduct = await productTypeService.createCustomProduct({
        product_id: id,
        product_type_id: body.product_type_id,
        custom_attributes: body.custom_attributes
      })
      res.status(201).json({ custom_product: newCustomProduct })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to save custom product data" })
  }
} 