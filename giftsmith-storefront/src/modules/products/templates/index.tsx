import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { ProductLocaleDetails } from "@lib/data/locale"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  productLocaleDetails: ProductLocaleDetails
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  productLocaleDetails,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="relative flex small:flex-row flex-col small:items-start py-6 content-container"
        data-testid="product-container"
      >
        <div className="small:top-48 small:sticky flex flex-col gap-y-6 py-8 small:py-0 w-full small:max-w-[300px]">
          <ProductInfo
            product={product}
            productLocaleDetails={productLocaleDetails}
          />
          <ProductTabs product={product} />
        </div>
        <div className="block relative w-full">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="small:top-48 small:sticky flex flex-col gap-y-12 py-8 small:py-0 w-full small:max-w-[300px]">
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
      <div
        className="my-16 small:my-32 content-container"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
