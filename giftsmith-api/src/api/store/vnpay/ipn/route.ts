import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { VNPay } from "@/modules/vnpay-ver2/vnpay";
import { VNPAY_CONFIG } from "../route";
import {
  ReturnQueryFromVNPay,
  VerifyReturnUrl,
} from "@/modules/vnpay-ver2/types";
import {
  InpOrderAlreadyConfirmed,
  IpnFailChecksum,
  IpnInvalidAmount,
  IpnOrderNotFound,
  IpnSuccess,
  IpnUnknownError,
} from "@/modules/vnpay-ver2";
import { IOrderModuleService } from "@medusajs/framework/types";

const vnpay = new VNPay(VNPAY_CONFIG);

const findOrderById = async (
  orderService: IOrderModuleService,
  orderId: string
) => {
  const order = await orderService.retrieveOrder(orderId);
  return order;
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const orderModuleService = req.scope.resolve("order");
    const verify: VerifyReturnUrl = vnpay.verifyIpnCall(
      req.query as ReturnQueryFromVNPay
    );
    if (!verify.isVerified) {
      return res.json(IpnFailChecksum);
    }

    if (!verify.isSuccess) {
      return res.json(IpnUnknownError);
    }

    // Tìm đơn hàng trong cơ sở dữ liệu
    const foundOrder = await findOrderById(
      orderModuleService,
      verify.vnp_TxnRef
    ); // Phương thức tìm đơn hàng theo id, bạn cần tự triển khai

    // Nếu không tìm thấy đơn hàng hoặc mã đơn hàng không khớp
    if (!foundOrder || verify.vnp_TxnRef !== foundOrder.id) {
      return res.json(IpnOrderNotFound);
    }

    // Nếu số tiền thanh toán không khớp
    if (verify.vnp_Amount !== foundOrder.total) {
      return res.json(IpnInvalidAmount);
    }

    // Nếu đơn hàng đã được xác nhận trước đó
    if (foundOrder.status === "completed") {
      return res.json(InpOrderAlreadyConfirmed);
    }

    /**
     * Sau khi xác thực đơn hàng thành công,
     * bạn có thể cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
     */
    foundOrder.status = "completed";
    // await updateOrder(foundOrder); // Hàm cập nhật trạng thái đơn hàng, bạn cần tự triển khai

    // Sau đó cập nhật trạng thái trở lại cho VNPay để họ biết bạn đã xác nhận đơn hàng
    return res.json(IpnSuccess);
  } catch (error) {
    console.log(`verify error: ${error}`);
    return res.json(IpnUnknownError);
  }
};
