import { useEffect, useState } from "react"
import { sdk } from "@lib/config"

interface ProductType {
  id: string
  name: string
  slug: string
  description: string
  field_schema: Array<{
    name: string
    type: string
    label: string
    required: boolean
    options?: string[]
    description?: string
  }>
  is_active: boolean
}

export function useProductTypes() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    sdk.client
      .fetch<{ product_types: ProductType[] }>(
        `/store/product-types`,
        {
          method: "GET",
          cache: "force-cache",
        }
      )
      .then(({ product_types }) => {
        if (!isMounted) return
        setProductTypes(product_types)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.message || "Failed to fetch product types")
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { productTypes, loading, error }
} 