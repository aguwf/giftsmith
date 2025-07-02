import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { PRODUCT_TYPES_MODULE } from "@/modules/product-types";
import ProductTypeService from "@/modules/product-types/service";

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const productTypeService = req.scope.resolve(
    PRODUCT_TYPES_MODULE
  ) as ProductTypeService;
  const { id } = req.params;
  const body = req.body as any;

  if (!id) {
    return res.status(400).json({ error: "Missing product type id" });
  }

  try {
    const updateData = JSON.parse(body.value);
    const updated = await productTypeService.updateProductType(id, updateData);
    res.status(200).json({ product_type: updated });
  } catch (error) {
    res.status(400).json({ error: "Failed to update product type" });
  }
};
