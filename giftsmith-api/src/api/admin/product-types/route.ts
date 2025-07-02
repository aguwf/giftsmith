import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_TYPES_MODULE } from "../../../modules/product-types";
import ProductTypeService from "../../../modules/product-types/service";
import { z } from "zod";
import { ProductTypeSchema } from "../../middlewares";
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productTypeService = req.scope.resolve(
    PRODUCT_TYPES_MODULE
  ) as ProductTypeService;

  try {
    const productTypes = await productTypeService.listAllProductTypes();
    res.json({ product_types: productTypes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product types" });
  }
};

type ProductType = z.infer<typeof ProductTypeSchema>;

export const POST = async (
  req: MedusaRequest<ProductType>,
  res: MedusaResponse
) => {
  const productTypeService = req.scope.resolve(
    PRODUCT_TYPES_MODULE
  ) as ProductTypeService;
  const body = req.body as any;

  const bodyParsed = JSON.parse(body.value);
  try {
    const productType = await productTypeService.createProductType(bodyParsed);

    res.status(201).json({ product_type: productType });
  } catch (error) {
    res.status(400).json({ error: "Failed to create product type" });
  }
};
