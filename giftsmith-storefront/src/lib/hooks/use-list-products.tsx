import React, { useEffect, useRef, useState, ReactNode, FC } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"

type UseListProductsProps = {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  regionId?: string
}

// Custom hook to fetch list of products (custom products)
export function useListProducts({
  pageParam = 1,
  queryParams,
  regionId,
}: UseListProductsProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  if (!regionId) {
    throw new Error("Region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)
    sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
        `/store/products`,
        {
          method: "GET",
          query: {
            limit,
            offset,
            region_id: regionId,
            fields:
              "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
            ...queryParams,
          },
          cache: "force-cache",
        }
      )
      .then(({ products, count }) => {
        if (!isMounted) return
        setProducts(products)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.message || "Failed to fetch products")
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [regionId, pageParam, JSON.stringify(queryParams)])

  return { products, loading, error }
}
