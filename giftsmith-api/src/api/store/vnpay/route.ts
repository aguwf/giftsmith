import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { dateFormat, ignoreLogger } from "@/modules/vnpay-ver2/utils";
import { VNPay } from "@/modules/vnpay-ver2/vnpay";
import { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from "@/modules/vnpay-ver2";
import { z } from "zod";

// Zod schemas for validation
const VNPayRequestSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  orderId: z.string().min(1, "Order ID is required"),
  orderInfo: z.string().min(1, "Order info is required"),
  locale: z.nativeEnum(VnpLocale).optional().default(VnpLocale.VN),
  currency: z.nativeEnum(VnpCurrCode).optional().default(VnpCurrCode.VND),
  bankCode: z.string().optional(),
});

const VNPayResponseSchema = z.object({
  payment_url: z.string(),
  order_id: z.string(),
  amount: z.number(),
});

const VNPayErrorSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Types inferred from Zod schemas
type VNPayRequest = z.infer<typeof VNPayRequestSchema>;
type VNPayResponse = z.infer<typeof VNPayResponseSchema>;
type VNPayError = z.infer<typeof VNPayErrorSchema>;

// Configuration
export const VNPAY_CONFIG = {
  tmnCode: process.env.VNPAY_TMN_CODE!,
  secureSecret: process.env.VNPAY_HASH_SECRET!,
  vnpayHost: process.env.VNPAY_HOST!,
  queryDrAndRefundHost: process.env.VNPAY_HOST!,
  testMode: true,
  hashAlgorithm: HashAlgorithm.SHA512,
  enableLog: true,
  loggerFn: ignoreLogger, // No logging
  endpoints: {
    paymentEndpoint: "paymentv2/vpcpay.html",
    queryDrRefundEndpoint: "merchant_webapi/api/transaction",
    getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list",
  },
} as const;

// Initialize VNPay instance
const vnpay = new VNPay(VNPAY_CONFIG);

// Utility functions
const getClientIP = (req: MedusaRequest): string => {
  return (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip ||
    "127.0.0.1"
  ) as string;
};

const createExpiryDate = (): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 15);
  return date;
};

const buildPaymentUrl = (params: {
  amount: number;
  orderId: string;
  orderInfo: string;
  ipAddr: string;
  locale: VnpLocale;
  bankCode?: string;
  currency?: VnpCurrCode;
}): string => {
  const { amount, orderId, orderInfo, ipAddr, locale, bankCode, currency } = params;
  
  return vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: ipAddr,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: `${process.env.APP_URL}/payment/callback` || "",
    vnp_Locale: locale,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(createExpiryDate()),
    vnp_CurrCode: currency,
    vnp_BankCode: bankCode,
  });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const validationResult = VNPayRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const error: VNPayError = {
        error: "Invalid request data",
        details: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
      return res.status(400).json(error);
    }

    const { amount, orderId, orderInfo, locale, currency, bankCode } = validationResult.data;

    // Get client IP
    const ipAddr = getClientIP(req);

    // Generate payment URL
    const paymentUrl = buildPaymentUrl({
      amount,
      orderId,
      orderInfo,
      ipAddr,
      locale,
      currency,
      bankCode,
    });

    const response: VNPayResponse = {
      payment_url: paymentUrl,
      order_id: orderId,
      amount: amount,
    };

    res.json(response);

  } catch (error) {
    console.error("Error generating VNPAY payment URL:", error);
    
    const errorResponse: VNPayError = {
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
    
    res.status(500).json(errorResponse);
  }
};
