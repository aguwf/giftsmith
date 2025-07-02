import { Module } from "@medusajs/framework/utils"
import ProductTypeService from "./service"

export const PRODUCT_TYPES_MODULE = "product_types"

export default Module(PRODUCT_TYPES_MODULE, {
  service: ProductTypeService,
}) 