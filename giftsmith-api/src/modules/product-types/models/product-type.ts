import { model } from "@medusajs/framework/utils"

export interface ProductFieldSchema {
  name: string
  type: "text" | "number" | "boolean" | "select" | "json" | "date" | "url" | "textarea"
  label: string
  required: boolean
  options?: string[] // For select fields
  description?: string
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

const ProductType = model.define("custom_product_type", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),
  description: model.text(),
  field_schema: model.json(),
  is_active: model.boolean(),
})

export default ProductType 