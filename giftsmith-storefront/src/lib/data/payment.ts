import { isVnpay } from "@lib/constants"

/**
 * Checks if a payment method requires external URL generation
 */
export function requiresExternalPayment(providerId?: string): boolean {
  return isVnpay(providerId) || false
}

/**
 * Gets the payment provider name for display
 */
export function getPaymentProviderName(providerId?: string): string {
  if (isVnpay(providerId)) {
    return "VNPay"
  }
  return providerId || "Unknown"
}
