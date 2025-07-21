import VnpayBase from "../core/vnpay-base";
import { PaymentIntentOptions, PaymentProviderKeys } from "../types";

class VnpayProviderService extends VnpayBase {
  static identifier = PaymentProviderKeys.VNPAY;

  constructor(_, options) {
    super(_, options);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {};
  }
}

export default VnpayProviderService;
