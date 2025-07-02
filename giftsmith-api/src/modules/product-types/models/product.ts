import { model } from "@medusajs/framework/utils"

const Product = model.define("custom_product", {
  id: model.id().primaryKey(),
  product_id: model.text(), // Reference to Medusa product
  product_type_id: model.text(), // Reference to product type
  custom_attributes: model.json(), // Store custom attributes as JSON
//   created_at: model.text(),
//   updated_at: model.text(),
})

export default Product 