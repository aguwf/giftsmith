import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_TYPES_MODULE } from "../../../../modules/product-types"
import ProductTypeService from "../../../../modules/product-types/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const productTypeService = req.scope.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService
  
  try {
    const customProduct = await productTypeService.retrieveProduct(id)
    res.json({ custom_product: customProduct })
  } catch (error) {
    res.status(404).json({ error: "Custom product not found" })
  }
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const productTypeService = req.scope.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService
  const body = req.body as {
    product_type_id?: string
    custom_attributes?: Record<string, any>
  }
  
  try {
    // Validate custom attributes if provided
    if (body.custom_attributes && body.product_type_id) {
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
    }
    
    const updatedProduct = await productTypeService.updateCustomProduct(id, {
      product_type_id: body.product_type_id,
      custom_attributes: body.custom_attributes
    })
    
    res.json({ custom_product: updatedProduct })
  } catch (error) {
    res.status(400).json({ error: "Failed to update custom product" })
  }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const productTypeService = req.scope.resolve(PRODUCT_TYPES_MODULE) as ProductTypeService
  
  try {
    await productTypeService.deleteProducts([id])
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ error: "Failed to delete custom product" })
  }
} 