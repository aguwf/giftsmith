// src/modules/vnpay-payment/helpers.ts

import { BigNumberInput } from "@medusajs/framework/types"
import { BigNumber, MathBN } from "@medusajs/framework/utils";
import * as crypto from "crypto";
import * as querystring from "qs";

export class VNPayHelper {
  /**
   * Sắp xếp object theo alphabet
   */
  static sortObject(obj: any): any {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();

    keys.forEach((key) => {
      sorted[key] = obj[key];
    });

    return sorted;
  }

  /**
   * Tạo secure hash cho request
   */
  static createSecureHash(params: any, secretKey: string): string {
    const sortedParams = this.sortObject(params);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return signed;
  }

  /**
   * Parse response code thành message
   */
  static getResponseMessage(responseCode: string): string {
    const responseMessages: Record<string, string> = {
      "00": "Giao dịch thành công",
      "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
      "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
      "10": "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
      "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
      "12": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
      "13": "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).",
      "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
      "51": "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
      "65": "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
      "75": "Ngân hàng thanh toán đang bảo trì.",
      "79": "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.",
      "99": "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
    };

    return responseMessages[responseCode] || "Lỗi không xác định";
  }
}

function getCurrencyMultiplier(currency) {
  const currencyMultipliers = {
    0: [
      "BIF",
      "CLP",
      "DJF",
      "GNF",
      "JPY",
      "KMF",
      "KRW",
      "MGA",
      "PYG",
      "RWF",
      "UGX",
      "VND",
      "VUV",
      "XAF",
      "XOF",
      "XPF",
    ],
    3: ["BHD", "IQD", "JOD", "KWD", "OMR", "TND"],
  };

  currency = currency.toUpperCase();
  let power = 2;
  for (const [key, value] of Object.entries(currencyMultipliers)) {
    if (value.includes(currency)) {
      power = parseInt(key, 10);
      break;
    }
  }
  return Math.pow(10, power);
}

/**
 * Converts an amount to the format required by Stripe based on currency.
 * https://docs.stripe.com/currencies
 * @param {BigNumberInput} amount - The amount to be converted.
 * @param {string} currency - The currency code (e.g., 'USD', 'JOD').
 * @returns {number} - The converted amount in the smallest currency unit.
 */
export function getSmallestUnit(
  amount: BigNumberInput,
  currency: string
): number {
  const multiplier = getCurrencyMultiplier(currency);

  let amount_ =
    Math.round(new BigNumber(MathBN.mult(amount, multiplier)).numeric) /
    multiplier;

  const smallestAmount = new BigNumber(MathBN.mult(amount_, multiplier));

  let numeric = smallestAmount.numeric;
  // Check if the currency requires rounding to the nearest ten
  if (multiplier === 1e3) {
    numeric = Math.ceil(numeric / 10) * 10;
  }

  return parseInt(numeric.toString().split(".").shift()!, 10);
}

/**
 * Converts an amount from the smallest currency unit to the standard unit based on currency.
 * @param {BigNumberInput} amount - The amount in the smallest currency unit.
 * @param {string} currency - The currency code (e.g., 'USD', 'JOD').
 * @returns {number} - The converted amount in the standard currency unit.
 */
export function getAmountFromSmallestUnit(
  amount: BigNumberInput,
  currency: string
): number {
  const multiplier = getCurrencyMultiplier(currency);
  const standardAmount = new BigNumber(MathBN.div(amount, multiplier));
  return standardAmount.numeric;
}
