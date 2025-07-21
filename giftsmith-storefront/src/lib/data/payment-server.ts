"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ payment_providers }) => {
      return payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    })
    .catch(() => {
      return null
    })
}

export const createPayment = async (payload: any) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client.fetch(`/store/vnpay`, {
    method: "POST",
    body: payload,
    headers,
  })
}

export interface PaymentUrlRequest {
  amount: number
  orderId: string
  orderInfo: string
  currency?: string
  returnUrl?: string
  cancelUrl?: string
  locale?: string
  bankCode?: string
}

export interface PaymentUrlResponse {
  payment_url: string
  order_id: string
  amount: number
}

/**
 * Server action to generate payment URL with auth headers
 */
export async function generatePaymentUrlServer(
  provider: string,
  request: PaymentUrlRequest
): Promise<PaymentUrlResponse | null> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_url")),
  }

  let endpoint = ""

  if (provider.startsWith("pp_vnpay_")) {
    endpoint = "/store/vnpay"
  } else {
    throw new Error(`Unsupported payment provider: ${provider}`)
  }

  return sdk.client
    .fetch<PaymentUrlResponse | null>(`${endpoint}`, {
      method: "POST",
      headers,
      body: request,
      next,
      cache: "force-cache",
    })
    .then((res) => {
      return res
    })
    .catch(() => {
      return null
    })
}
