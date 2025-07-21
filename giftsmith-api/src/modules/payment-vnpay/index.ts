import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"
import VnpayProviderService from "./services/vnpay-provider"

export default ModuleProvider(Modules.PAYMENT, {
  services: [VnpayProviderService],
})