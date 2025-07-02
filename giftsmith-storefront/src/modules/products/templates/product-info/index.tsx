import { ProductLocaleDetails } from "@lib/data/locale"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { documentToHtmlString } from "@contentful/rich-text-html-renderer"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  productLocaleDetails: ProductLocaleDetails
}

const ProductInfo = ({ product, productLocaleDetails }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 mx-auto lg:max-w-[500px]">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-ui-fg-base text-3xl leading-10"
          data-testid="product-title"
        >
          {productLocaleDetails.contentful_product?.title || product.title}
        </Heading>

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {productLocaleDetails.contentful_product?.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: documentToHtmlString(
                  productLocaleDetails.contentful_product?.description
                ),
              }}
            />
          ) : (
            product.description
          )}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
