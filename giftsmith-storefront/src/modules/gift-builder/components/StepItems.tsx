import React from "react"
import GiftBuilderStep from "./GiftBuilderStep"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { stringToSlug } from "@lib/util/common"
import { itemOptions } from "@lib/constants"
import { Button } from "@medusajs/ui"

const StepItems: React.FC = () => {
  const { items, setItems, setCurrentStep } = useGiftBuilder()

  return (
    <GiftBuilderStep
      stepNumber={2}
      totalSteps={3}
      title="CHOOSE YOUR ITEMS"
      description="Pick the items you want to include in your gift box. You can select multiple items."
      options={itemOptions}
      selected={items}
      onSelect={(opt) => {
        const slug = stringToSlug(opt.title)
        setItems(
          items.includes(slug)
            ? items.filter((v) => v !== slug)
            : [...items, slug]
        )
      }}
      onBack={() => setCurrentStep(0)}
      onNext={() => setCurrentStep(2)}
      nextDisabled={items.length === 0}
      getOptionValue={(opt) => stringToSlug(opt.title)}
      renderOption={(opt, isSelected, onSelect) => (
        <div
          key={opt.id}
          className={`flex h-80 w-56 cursor-pointer flex-col items-center rounded-lg border-2 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-lg ${
            isSelected
              ? "border-primary-500/50 ring-1 ring-primary-500/50"
              : "border-gray-200"
          }`}
          onClick={onSelect}
        >
          <img
            src={opt.feature_image.url}
            alt={opt.feature_image.alt || ""}
            className="mb-2 rounded w-full h-full object-cover"
          />
          <div className="font-medium text-center">{opt.title}</div>
        </div>
      )}
    />
  )
}

export default StepItems
