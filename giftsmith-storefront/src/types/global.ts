import { StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export declare type StepperProps = {
  children: React.ReactElement | React.ReactElement[]
  showProgressBar?: boolean
  defaultActiveStep?: number
  backBtn?: React.ReactNode
  continueBtn?: React.ReactNode
  submitBtn?: React.ReactNode
  onContinue?: (step: number) => void
  onPrev?: (step: number) => void
  onSubmit?: (step: number) => void
  btnPos?:
    | "center"
    | "end"
    | "flex-end"
    | "flex-start"
    | "inherit"
    | "initial"
    | "left"
    | "normal"
    | "revert"
    | "right"
    | "space-around"
    | "space-between"
    | "space-evenly"
    | "start"
    | "stretch"
    | "unset"
  barWidth?: string
  strokeColor?: string
  fillStroke?: string
  stroke?: number
  activeColor?: string
  activeProgressBorder?: string
  progressBarClassName?: string
  contentBoxClassName?: string
  allowClickControl?: boolean
}
