import { useGiftBuilderStore } from "@lib/stores/gift-builder-store"

export const useGiftBuilder = () => {
  const {
    currentStep,
    box,
    items,
    card,
    setCurrentStep,
    setBox,
    setItems,
    setCard,
    reset
  } = useGiftBuilderStore()

  return {
    currentStep,
    setCurrentStep,
    box,
    setBox,
    items,
    setItems,
    card,
    setCard,
    reset
  }
}

// Re-export types for convenience
export type { BoxType, ItemType, CardType } from "@lib/stores/gift-builder-store" 