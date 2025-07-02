import React from "react"
import GiftBuilderStep from "./GiftBuilderStep"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { useListProducts } from "@lib/hooks/use-list-products"
import { useCustomProducts } from "@lib/hooks/use-custom-products"

const StepBox: React.FC = () => {
  const { box, setBox, setCurrentStep, currentStep } = useGiftBuilder()
  const { products } = useCustomProducts({
    productTypeId: "01JY94DQJEE9Y776FMMB95J5PH"
  })

  return (
    <GiftBuilderStep
      stepNumber={1}
      totalSteps={3}
      title="CHOOSE YOUR BOX COLOR"
      description="Welcome to the easiest way to send someone a custom gift, in 3 simple steps. Add to cart and repeat for multiple boxes, or update your quantity in the cart."
      options={products}
      selected={box}
      onSelect={(opt) => {
        setBox(opt.handle)
        console.log(opt)
      }}
      onNext={() => setCurrentStep(1)}
      nextDisabled={!box}
      renderOption={(opt, isSelected, onSelect) => (
        <div
          key={opt.handle}
          className={`flex h-80 w-56 cursor-pointer flex-col items-center rounded-lg border-2 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-lg ${
            isSelected
              ? "border-primary-500/50 ring-1 ring-primary-500/50"
              : "border-gray-200"
          }`}
          onClick={onSelect}
        >
          <img
            src={opt.thumbnail}
            alt={opt.title}
            className="mb-4 rounded w-40 h-40 object-cover"
          />
          <div className="font-medium text-center">{opt.title}</div>
          <div className="mt-2 text-gray-500 text-xs text-center text-ellipsis line-clamp-4">
            {opt.description}
          </div>
          {opt.title === "Light Pink" && (
            <div className="mt-2 text-blue-500 text-xs underline cursor-pointer">
              ADD EMBROIDERY +
            </div>
          )}
        </div>
      )}
    />
  )
}

export default StepBox
