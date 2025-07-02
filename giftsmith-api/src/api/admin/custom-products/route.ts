import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_TYPES_MODULE } from "../../../modules/product-types"
import ProductTypeService from "../../../modules/product-types/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productTypeService = req.scope.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService
  const { product_type_id } = req.query
  
  try {
    let products
    if (product_type_id) {
      products = await productTypeService.getCustomProductByType(product_type_id as string)
    } else {
      products = await productTypeService.listProducts()
    }
    
    res.json({ products })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch custom products" })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const productTypeService = req.scope.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService
  const body = req.body as {
    product_id: string
    product_type_id: string
    custom_attributes: Record<string, any>
  }
  
  try {
    // Validate custom attributes against product type schema
    const validationErrors = await productTypeService.validateCustomAttributes(
      body.product_type_id,
      body.custom_attributes
    )
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validationErrors 
      })
    }
    
    const customProduct = await productTypeService.createCustomProduct({
      product_id: body.product_id,
      product_type_id: body.product_type_id,
      custom_attributes: body.custom_attributes
    })
    
    res.status(201).json({ custom_product: customProduct })
  } catch (error) {
    res.status(400).json({ error: "Failed to create custom product" })
  }
} 