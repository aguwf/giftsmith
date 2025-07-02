import React from "react"
import GiftBuilderStep from "./GiftBuilderStep"
import { useGiftBuilder, CardType } from "../hooks/use-gift-builder"
import { cardOptions } from "@lib/constants"
import { stringToSlug } from "@lib/util/common"
import { Button } from "@medusajs/ui"

const StepCard: React.FC = () => {
  const { card, setCard, setCurrentStep } = useGiftBuilder()
  return (
    <GiftBuilderStep
      stepNumber={3}
      totalSteps={3}
      title="CHOOSE A CARD"
      description="Select a card to include with your gift. You can add a message later."
      options={cardOptions}
      selected={card}
      onSelect={(opt) => setCard(stringToSlug(opt.title) as CardType)}
      onBack={() => setCurrentStep(1)}
      onNext={() => setCurrentStep(3)}
      nextDisabled={!card}
      getOptionValue={(opt) => stringToSlug(opt.title)}
      renderOption={(opt, isSelected, onSelect) => (
        <div
          key={opt.id}
          className={`border-2 rounded-lg p-4 pb-12 cursor-pointer transition-all duration-200 bg-white shadow-sm hover:shadow-lg flex flex-col items-center w-80 h-80 ${
            isSelected
              ? "border-primary-500/50 ring-1 ring-primary-500/50"
              : "border-gray-200"
          }`}
          onClick={onSelect}
        >
          <img
            src={opt.image.url}
            alt={opt.image.alt || ""}
            className="mb-2 rounded w-full h-full object-cover"
          />
          <div className="font-medium text-center">{opt.title}</div>
        </div>
      )}
    />
  )
}

export default StepCard
