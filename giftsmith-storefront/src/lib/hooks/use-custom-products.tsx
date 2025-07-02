import { useEffect } from "react"
import { useCustomProductsStore } from "@lib/stores/custom-products-store"

type UseCustomProductsProps = {
  pageParam?: number
  productTypeId?: string
  customAttribute?: string
  customValue?: string
  limit?: number
  regionId?: string
}

export function useCustomProducts({
  pageParam = 1,
  productTypeId,
  customAttribute,
  customValue,
  limit = 12,
  regionId,
}: UseCustomProductsProps) {
  const { products, loading, error, fetchProducts } = useCustomProductsStore()

  useEffect(() => {
    fetchProducts({
      productTypeId,
      customAttribute,
      customValue,
      limit,
      pageParam,
      regionId,
    })
  }, [productTypeId, customAttribute, customValue, pageParam, limit, regionId, fetchProducts])

  return { products, loading, error }
} 