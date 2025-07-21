import crypto from "crypto";
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
  ProviderWebhookPayload,
  ListPaymentMethodsInput,
  ListPaymentMethodsOutput,
  SavePaymentMethodInput,
  SavePaymentMethodOutput,
  CreateAccountHolderInput,
  CreateAccountHolderOutput,
  UpdateAccountHolderInput,
  UpdateAccountHolderOutput,
  DeleteAccountHolderInput,
  DeleteAccountHolderOutput,
} from "@medusajs/framework/types";
import {
  AbstractPaymentProvider,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils";
import {
  VNPay,
  VNPayConfig,
  BuildPaymentUrl,
  ReturnQueryFromVNPay,
  QueryDr,
  generateRandomString,
  dateFormat,
  getDateInGMT7,
  VnpTransactionType,
  VnpLocale,
} from "../../vnpay-ver2";
import { PaymentProviderKeys } from "../types";
import { getAmountFromSmallestUnit } from "../utils/helper";

// VNPAY configuration type extending the library's config
export type VnpayOptions = VNPayConfig & {
  returnUrl: string;
  ipnUrl: string;
};

abstract class VnpayBase extends AbstractPaymentProvider<VnpayOptions> {
  static identifier = PaymentProviderKeys.VNPAY;
  protected readonly options_: VnpayOptions;
  protected container_: Record<string, unknown>;
  protected vnpay_: VNPay;

  static validateOptions(options: VnpayOptions): void {
    if (!options.tmnCode || !options.secureSecret) {
      throw new Error("Missing required VNPAY configuration options");
    }
  }

  protected constructor(
    cradle: Record<string, unknown>,
    options: VnpayOptions
  ) {
    // @ts-ignore
    super(...arguments);
    this.container_ = cradle;
    this.options_ = options;

    // Initialize VNPay instance
    this.vnpay_ = new VNPay({
      tmnCode: options.tmnCode,
      secureSecret: options.secureSecret,
      vnpayHost: options.vnpayHost,
      testMode: options.testMode,
      hashAlgorithm: options.hashAlgorithm,
      enableLog: options.enableLog,
      loggerFn: options.loggerFn,
      endpoints: options.endpoints,
    });
  }

  // Initiate payment: returns a URL to redirect the user to VNPAY
  async initiatePayment({
    currency_code,
    amount,
    data,
    context,
  }: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const sessionId = data?.session_id as string;
    const orderId = (data?.order_id as string) || sessionId;

    // Convert amount to VNPAY format (multiply by 100)
    const vnpAmount = Math.round((amount as number) * 100);

    // Get client IP from context or use default
    const clientIp = ((context as any)?.ip as string) || "127.0.0.1";

    // Create payment data for VNPAY
    const paymentData: BuildPaymentUrl = {
      vnp_Amount: vnpAmount,
      vnp_OrderInfo: `Thanh toan don hang: ${orderId}`,
      vnp_TxnRef: orderId,
      vnp_IpAddr: clientIp,
      vnp_ReturnUrl: this.options_.returnUrl,
      vnp_CurrCode: currency_code as any,
      vnp_Locale: "vn" as any,
      vnp_OrderType: "other" as any,
      vnp_BankCode: "VNPAYQR",
    };

    // Build payment URL using VNPAY library
    const paymentUrl = this.vnpay_.buildPaymentUrl(paymentData);

    return {
      id: sessionId,
      data: {
        payment_url: paymentUrl,
        order_id: orderId,
        amount: vnpAmount,
        currency_code,
      },
    };
  }

  // Handle return URL from VNPAY (to be called from your route handler)
  async handleReturnUrl(
    query: Record<string, string>
  ): Promise<WebhookActionResult> {
    try {
      // Verify the return URL using VNPAY library
      const result = this.vnpay_.verifyReturnUrl(query as ReturnQueryFromVNPay);

      if (!result.isSuccess) {
        return {
          action: PaymentActions.FAILED,
          data: {
            session_id: query.vnp_TxnRef,
            amount: parseInt(query.vnp_Amount as string) / 100,
          },
        };
      }

      // Map VNPAY response code to Medusa action
      const action = this.mapVnpayResponseCode(query.vnp_ResponseCode);

      return {
        action,
        data: {
          session_id: query.vnp_TxnRef,
          amount: parseInt(query.vnp_Amount as string) / 100,
        },
      };
    } catch (error) {
      return {
        action: PaymentActions.FAILED,
        data: {
          session_id: query.vnp_TxnRef,
          amount: parseInt(query.vnp_Amount as string) / 100,
        },
      };
    }
  }

  // Handle IPN from VNPAY (to be called from your route handler)
  async handleIpnUrl(
    query: Record<string, string>
  ): Promise<WebhookActionResult> {
    try {
      // Verify the IPN call using VNPAY library
      const result = this.vnpay_.verifyIpnCall(query as ReturnQueryFromVNPay);

      if (!result.isSuccess) {
        return {
          action: PaymentActions.FAILED,
          data: {
            session_id: query.vnp_TxnRef,
            amount: parseInt(query.vnp_Amount as string) / 100,
          },
        };
      }

      // Map VNPAY response code to Medusa action
      const action = this.mapVnpayResponseCode(query.vnp_ResponseCode);

      return {
        action,
        data: {
          session_id: query.vnp_TxnRef,
          amount: parseInt(query.vnp_Amount as string) / 100,
        },
      };
    } catch (error) {
      return {
        action: PaymentActions.FAILED,
        data: {
          session_id: query.vnp_TxnRef,
          amount: parseInt(query.vnp_Amount as string) / 100,
        },
      };
    }
  }

  // Get payment status (query VNPAY API)
  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const orderId = input?.data?.id as string;
    if (!orderId) {
      throw new Error("No order ID provided while getting payment status");
    }

    // You must provide all required fields for QueryDr
    // We'll use dummy values for missing fields for now, but in production, these should be real values from your order/payment record
    const now = new Date();
    const yyyyMMddHHmmss = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    try {
      // Query VNPAY for transaction status
      const result = await this.vnpay_.queryDr({
        vnp_TxnRef: orderId,
        vnp_RequestId: orderId,
        vnp_TransactionDate: Number(yyyyMMddHHmmss),
        vnp_IpAddr: "127.0.0.1",
        vnp_TransactionNo: 0,
        vnp_OrderInfo: `Truy van don hang: ${orderId}`,
        vnp_CreateDate: Number(yyyyMMddHHmmss),
      });

      if (result.isSuccess) {
        const status = this.mapVnpayResponseCode(result.vnp_ResponseCode);
        return {
          data: result,
          status: this.mapPaymentActionToStatus(status),
        };
      } else {
        return {
          data: result,
          status: PaymentSessionStatus.ERROR,
        };
      }
    } catch (error) {
      return {
        data: { error: (error as Error).message },
        status: PaymentSessionStatus.ERROR,
      };
    }
  }

  // Refund payment (call VNPAY refund API)
  async refundPayment({
    amount,
    data,
    context,
  }: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const orderId = data?.id as string;
    if (!orderId) {
      throw new Error("No order ID provided while refunding payment");
    }

    try {
      const refundRequestDate = dateFormat(getDateInGMT7(new Date()));
      const orderCreatedAt = dateFormat(getDateInGMT7(new Date()));
      const vnpAmount = Math.round(amount as number);
      const createBy = data?.created_by as string;
      const ipAddr = data?.ipAddr as string;

      // Call VNPAY refund API
      const result = await this.vnpay_.refund({
        vnp_RequestId: `${orderId}_refund_${Date.now()}`,
        vnp_TxnRef: orderId,
        vnp_Amount: vnpAmount,
        vnp_OrderInfo: `Hoan tien don hang: ${orderId}`,
        vnp_CreateBy: createBy,
        vnp_CreateDate: refundRequestDate,
        vnp_IpAddr: ipAddr,
        vnp_TransactionDate: orderCreatedAt,
        vnp_TransactionType: VnpTransactionType.FULL_REFUND,
        vnp_Locale: VnpLocale.VN,
      });

      if (result.isSuccess) {
        return { data: { ...data, refund_result: result } };
      } else {
        throw new Error(`Refund failed: ${result.message}`);
      }
    } catch (error) {
      throw new Error(`An error occurred in refundPayment: ${error.message}`);
    }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const event = this.constructWebhookEvent(webhookData);
    const intent = event.data.object as any;
    // const intent = event.data.object as VNPAY.PaymentIntent;

    const { currency } = intent;

    switch (event.type) {
      case "payment_intent.created":
      case "payment_intent.processing":
        return {
          action: PaymentActions.PENDING,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        };
      case "payment_intent.canceled":
        return {
          action: PaymentActions.CANCELED,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        };
      case "payment_intent.payment_failed":
        return {
          action: PaymentActions.FAILED,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        };
      case "payment_intent.requires_action":
        return {
          action: PaymentActions.REQUIRES_MORE,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        };
      case "payment_intent.amount_capturable_updated":
        return {
          action: PaymentActions.AUTHORIZED,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(
              intent.amount_capturable,
              currency
            ),
          },
        };
      case "payment_intent.partially_funded":
        return {
          action: PaymentActions.REQUIRES_MORE,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(
              intent.next_action?.display_bank_transfer_instructions
                ?.amount_remaining ?? intent.amount,
              currency
            ),
          },
        };
      case "payment_intent.succeeded":
        return {
          action: PaymentActions.SUCCESSFUL,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount_received, currency),
          },
        };

      default:
        return { action: PaymentActions.NOT_SUPPORTED };
    }
  }

  /**
   * Constructs Stripe Webhook event
   * @param {object} data - the data of the webhook request: req.body
   *    ensures integrity of the webhook event
   * @return {object} Stripe Webhook event
   */
  constructWebhookEvent(data: ProviderWebhookPayload["payload"]) {
    const signature = data.headers["stripe-signature"] as string;

    // return this.vnpay_.webhooks.constructEvent(
    //   data.rawData as string | Buffer,
    //   signature,
    //   this.options_.webhookSecret
    // );
    return {
        type: "payment_intent.created",
        data: {
            object: {
                id: "pi_1234567890",
                amount: 1000,
                currency: "usd",
            }
        }
    }
  }

  // Utility: Map VNPAY response code to Medusa PaymentActions
  protected mapVnpayResponseCode(code: string | number): PaymentActions {
    const codeStr = code.toString();
    switch (codeStr) {
      case "00":
        return PaymentActions.SUCCESSFUL;
      case "24":
        return PaymentActions.CANCELED;
      case "01":
      case "02":
      case "07":
      case "09":
      case "10":
      case "11":
      case "12":
      case "13":
      case "51":
      case "65":
      case "75":
      case "79":
      case "99":
        return PaymentActions.FAILED;
      default:
        return PaymentActions.NOT_SUPPORTED;
    }
  }

  // Utility: Map PaymentActions to PaymentSessionStatus
  protected mapPaymentActionToStatus(
    action: PaymentActions
  ): PaymentSessionStatus {
    switch (action) {
      case PaymentActions.SUCCESSFUL:
        return PaymentSessionStatus.CAPTURED;
      case PaymentActions.FAILED:
        return PaymentSessionStatus.ERROR;
      case PaymentActions.CANCELED:
        return PaymentSessionStatus.CANCELED;
      case PaymentActions.REQUIRES_MORE:
        return PaymentSessionStatus.REQUIRES_MORE;
      case PaymentActions.PENDING:
        return PaymentSessionStatus.PENDING;
      default:
        return PaymentSessionStatus.PENDING;
    }
  }

  // The following methods are not supported by VNPAY or are not relevant
  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    return this.getPaymentStatus(input);
  }
  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return { data: {} };
  }
  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: {} };
  }
  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: {} };
  }
  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    return { data: {} };
  }
  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: {} };
  }
  async listPaymentMethods(
    input: ListPaymentMethodsInput
  ): Promise<ListPaymentMethodsOutput> {
    return [];
  }
  async savePaymentMethod(
    input: SavePaymentMethodInput
  ): Promise<SavePaymentMethodOutput> {
    return { id: "", data: {} };
  }
  async createAccountHolder(
    input: CreateAccountHolderInput
  ): Promise<CreateAccountHolderOutput> {
    return { id: "" };
  }
  async updateAccountHolder(
    input: UpdateAccountHolderInput
  ): Promise<UpdateAccountHolderOutput> {
    return { data: {} };
  }
  async deleteAccountHolder(
    input: DeleteAccountHolderInput
  ): Promise<DeleteAccountHolderOutput> {
    return {};
  }
}

export default VnpayBase;
