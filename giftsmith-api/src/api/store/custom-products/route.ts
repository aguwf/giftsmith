import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_TYPES_MODULE } from "../../../modules/product-types";
import ProductTypeService from "../../../modules/product-types/service";
import { title } from "process";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productTypeService = req.scope.resolve(
    PRODUCT_TYPES_MODULE
  ) as ProductTypeService;
  const {
    product_type_id,
    custom_attribute,
    custom_value,
    limit = "12",
    offset = "0",
  } = req.query;

  try {
    // Get all custom products first (without pagination parameters)
    let products = await productTypeService.listProducts({});

    // Filter by product type if specified
    if (product_type_id) {
      products = products.filter((p) => p.product_type_id === product_type_id);
    }

    // Filter by custom attribute if specified
    if (custom_attribute && custom_value) {
      products = products.filter((p) => {
        const customAttrs = p.custom_attributes || {};
        return customAttrs[custom_attribute as string] === custom_value;
      });
    }

    // Apply pagination after filtering
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    const paginatedProducts = products.slice(offsetNum, offsetNum + limitNum);

    // Get the base product information for each custom product
    const productModuleService = req.scope.resolve("product");
    const enrichedProducts = await Promise.all(
      paginatedProducts.map(async (customProduct) => {
        try {
          const baseProduct = await productModuleService.retrieveProduct(
            customProduct.product_id
          );
          const productType = await productTypeService.retrieveProduct_type(
            customProduct.product_type_id
          );

          return {
            ...baseProduct,
            custom_product: {
              id: customProduct.id,
              product_type: productType,
              custom_attributes: customProduct.custom_attributes,
            },
          };
        } catch (error) {
          console.error(
            `Failed to fetch product ${customProduct.product_id}:`,
            error
          );
          return null;
        }
      })
    );

    // Filter out null values (products that couldn't be fetched)
    const validProducts = enrichedProducts
      .filter((p) => p !== null)
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        handle: p.handle,
        thumbnail: p.thumbnail,
        custom_product: {
          id: p.custom_product.id,
          custom_attributes: p.custom_product.custom_attributes,
        },
      }));

    res.json({
      products: validProducts,
      count: products.length, // Total count before pagination
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (error) {
    console.error("Error fetching custom products:", error);
    res.status(500).json({ error: "Failed to fetch custom products" });
  }
};
