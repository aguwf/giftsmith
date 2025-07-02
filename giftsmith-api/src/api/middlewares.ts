// import {
//   defineMiddlewares,
//   validateAndTransformBody,
// } from "@medusajs/framework/http";
import { z } from "zod";

export const ProductTypeSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  field_schema: z.array(z.any()),
  is_active: z.boolean().optional(),
});

// export default defineMiddlewares({
//   routes: [
//     {
//       matcher: "/admin/product-types",
//       method: "POST",
//       middlewares: [validateAndTransformBody(ProductTypeSchema)],
//     },
//   ],
// });
