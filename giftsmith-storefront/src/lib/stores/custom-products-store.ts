import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { sdk } from "@lib/config"

interface CustomProduct {
  id: string
  title: string
  handle: string
  thumbnail: string
  description?: string
  [key: string]: any
}

interface CustomProductsSlice {
  products: CustomProduct[]
  loading: boolean
  error: string | null
  cache: Record<string, { products: CustomProduct[]; timestamp: number }>
  fetchProducts: (params: {
    productTypeId?: string
    customAttribute?: string
    customValue?: string
    limit?: number
    pageParam?: number
    regionId?: string
  }) => Promise<void>
  getCachedProducts: (cacheKey: string) => CustomProduct[] | null
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const STORAGE_KEY = "custom-products-cache"

const createCustomProductsSlice = (set: any, get: any): CustomProductsSlice => ({
  products: [],
  loading: false,
  error: null,
  cache: {},

  fetchProducts: async (params) => {
    const {
      productTypeId,
      customAttribute,
      customValue,
      limit = 12,
      pageParam = 1,
      regionId,
    } = params

    const cacheKey = JSON.stringify({ productTypeId, customAttribute, customValue, limit, pageParam, regionId })
    const cached = get().cache[cacheKey]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set((state: CustomProductsSlice) => {
        state.products = cached.products
        state.loading = false
        state.error = null
      })
      return
    }

    set((state: CustomProductsSlice) => {
      state.loading = true
      state.error = null
    })

    try {
      const offset = (pageParam - 1) * limit
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })

      if (productTypeId) {
        queryParams.append('product_type_id', productTypeId)
      }

      if (customAttribute && customValue) {
        queryParams.append('custom_attribute', customAttribute)
        queryParams.append('custom_value', customValue)
      }

      const { products } = await sdk.client.fetch<{ products: CustomProduct[]; count: number }>(
        `/store/custom-products?${queryParams.toString()}`,
        {
          method: "GET",
          cache: "force-cache",
        }
      )

      set((state: CustomProductsSlice) => {
        state.products = products
        state.loading = false
        state.error = null
        state.cache[cacheKey] = { products, timestamp: Date.now() }
      })
    } catch (error) {
      set((state: CustomProductsSlice) => {
        state.loading = false
        state.error = error instanceof Error ? error.message : "Failed to fetch custom products"
      })
    }
  },

  getCachedProducts: (cacheKey) => {
    const cached = get().cache[cacheKey]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.products
    }
    return null
  }
})

export const useCustomProductsStore = create<CustomProductsSlice>()(
  persist(
    immer((set, get) => ({
      ...createCustomProductsSlice(set, get)
    })),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        cache: state.cache
      })
    }
  )
) 