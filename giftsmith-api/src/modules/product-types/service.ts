import { MedusaService } from "@medusajs/framework/utils"
import ProductType from "./models/product-type"
import Product from "./models/product"
import { ProductFieldSchema } from "./models/product-type"

class ProductTypeService extends MedusaService({
  product_type: ProductType,
  product: Product,
}) {
  static linkableKeys = {};

  // Product Type Management
  async createProductType(data: {
    name: string
    slug: string
    description?: string
    field_schema: ProductFieldSchema[]
    is_active?: boolean
  }) {
    // Try to create with the data wrapped in a value field as the error suggests
    try {
      return await this.createProduct_types({
        ...data,
        field_schema: data.field_schema as any,
        is_active: data.is_active ?? true
      })
    } catch (error) {
      console.error("Error in createProductType:", error)
      throw error
    }
  }

  async updateProductType(id: string, data: Partial<{
    name: string
    slug: string
    description: string
    field_schema: ProductFieldSchema[]
    is_active: boolean
  }>) {
    return await this.updateProduct_types({
      selector: { id },
      data: {
        ...data,
        field_schema: data.field_schema as any
      }
    })
  }

  async deleteProductType(id: string) {
    return await this.deleteProduct_types([id])
  }

  async getProductType(id: string) {
    return await this.retrieveProduct_type(id)
  }

  async listAllProductTypes() {
    return await this.listProduct_types()
  }

  // Custom Product Management
  async createCustomProduct(data: {
    product_id: string
    product_type_id: string
    custom_attributes: Record<string, any>
  }) {
    return await this.createProducts(data)
  }

  async updateCustomProduct(id: string, data: Partial<{
    product_type_id: string
    custom_attributes: Record<string, any>
  }>) {
    return await this.updateProducts({
      selector: { id },
      data
    })
  }

  async getCustomProduct(productId: string) {
    const [product] = await this.listProducts({
      product_id: productId
    })
    return product
  }

  async getCustomProductByType(productTypeId: string) {
    return await this.listProducts({
      product_type_id: productTypeId
    })
  }

  // Validation
  async validateCustomAttributes(product_type_id: string, custom_attributes: Record<string, any>) {
    const productType = await this.retrieveProduct_type(product_type_id)
    const fieldSchema = productType.field_schema as unknown as ProductFieldSchema[]
    
    const errors: string[] = []
    
    for (const field of fieldSchema) {
      if (field.required && !custom_attributes[field.name]) {
        errors.push(`Field '${field.label}' is required`)
        continue
      }
      
      if (custom_attributes[field.name]) {
        const value = custom_attributes[field.name]
        
        // Type validation
        switch (field.type) {
          case 'text':
          case 'url':
            if (typeof value !== 'string') {
              errors.push(`Field '${field.label}' must be a string`)
            }
            break
          case 'number':
            if (typeof value !== 'number') {
              errors.push(`Field '${field.label}' must be a number`)
            } else {
              if (field.validation?.min && value < field.validation.min) {
                errors.push(`Field '${field.label}' must be at least ${field.validation.min}`)
              }
              if (field.validation?.max && value > field.validation.max) {
                errors.push(`Field '${field.label}' must be at most ${field.validation.max}`)
              }
            }
            break
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`Field '${field.label}' must be a boolean`)
            }
            break
          case 'select':
            if (typeof value !== 'string') {
              errors.push(`Field '${field.label}' must be a string`)
            } else if (field.options && !field.options.includes(value)) {
              errors.push(`Field '${field.label}' must be one of: ${field.options.join(', ')}`)
            }
            break
          case 'date':
            if (!(value instanceof Date) && isNaN(Date.parse(value))) {
              errors.push(`Field '${field.label}' must be a valid date`)
            }
            break
        }
        
        // Pattern validation for text fields
        if (field.type === 'text' && field.validation?.pattern) {
          const regex = new RegExp(field.validation.pattern)
          if (!regex.test(value)) {
            errors.push(`Field '${field.label}' does not match the required pattern`)
          }
        }
      }
    }
    
    return errors
  }
}

export default ProductTypeService 