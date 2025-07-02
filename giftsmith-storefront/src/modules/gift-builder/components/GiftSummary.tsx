import React, { useMemo, useState } from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { itemOptions, cardOptions } from "@lib/constants"
import { stringToSlug } from "@lib/util/common"
import { Button } from "@medusajs/ui"
import { XMark, ChevronLeft, ChevronRight } from "@medusajs/icons"
import { useCustomProducts } from "@lib/hooks/use-custom-products"
import { useRouter } from "next/navigation"

const GiftSummary: React.FC = () => {
  const {
    box,
    setBox,
    items,
    setItems,
    card,
    setCard,
    currentStep,
    setCurrentStep,
  } = useGiftBuilder()
  const router = useRouter()
  const [showTooltip, setShowTooltip] = useState(false)

  const { products } = useCustomProducts({
    productTypeId: "01JY94DQJEE9Y776FMMB95J5PH",
  })

  // Calculate draft price
  const draftPrice = useMemo(() => {
    let total = 0

    // Add box price
    const selectedBox = products.find((b) => b.handle === box)
    if (selectedBox) {
      total += selectedBox.variants?.[0]?.prices?.[0]?.amount || 0
    }

    // Add items price (assuming each item costs $5)
    total += items.length * 500 // $5.00 in cents

    // Add card price (assuming card costs $2)
    if (card) {
      total += 200 // $2.00 in cents
    }

    return total
  }, [box, items, card, products])

  const handleRemoveBox = () => {
    setBox(null)
    setCurrentStep(0)
  }

  const handleRemoveItem = (itemToRemove: string) => {
    setItems(items.filter((item) => item !== itemToRemove))
    if (items.length === 1) {
      setCurrentStep(1)
    }
  }

  const handleRemoveCard = () => {
    setCard(null)
    setCurrentStep(2)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleCheckout = () => {
    // Navigate to checkout with gift builder data
    const giftData = {
      box,
      items,
      card,
      total: draftPrice,
    }

    // Store in localStorage or pass as query params
    localStorage.setItem("giftBuilderData", JSON.stringify(giftData))
    router.push("/checkout?source=gift-builder")
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return box
      case 1:
        return items.length > 0
      case 2:
        return true // Card is optional
      case 3:
        return true // Ready for checkout
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Choose Your Box"
      case 1:
        return "Select Items"
      case 2:
        return "Add a Card (Optional)"
      case 3:
        return "Review & Checkout"
      default:
        return "Gift Builder"
    }
  }

  const getTooltipMessage = () => {
    switch (currentStep) {
      case 0:
        return "Please select a box first"
      case 1:
        return "Please add at least one item"
      case 2:
        return "Card is optional, you can proceed"
      default:
        return ""
    }
  }

  if (!box && items.length === 0 && !card) {
    return null
  }

  // Find selected box object from backend data
  const selectedBox = products.find((b) => b.handle === box)

  return (
    <div className="right-0 bottom-0 left-0 z-50 fixed bg-white shadow-lg border-gray-200 border-t">
      <div className="mx-auto p-4 max-w-7xl">
        {/* Header with step title and price */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-lg">{getStepTitle()}</h3>
            <p className="text-gray-600 text-sm">Step {currentStep + 1} of 4</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Navigation and checkout buttons */}
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="large"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 rounded-full w-11 h-11"
                >
                  <ChevronLeft />
                </Button>

                {currentStep < 3 && (
                  <div className="relative">
                    <Button
                      variant="primary"
                      size="large"
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="flex items-center gap-1 rounded-full w-11 h-11"
                      onMouseEnter={() => !canProceed() && setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <ChevronRight />
                    </Button>
                    {showTooltip && !canProceed() && (
                      <div className="bottom-full left-1/2 z-50 absolute bg-gray-900 shadow-lg mb-2 px-3 py-2 rounded-lg text-white text-sm whitespace-nowrap -translate-x-1/2 transform">
                        {getTooltipMessage()}
                        <div className="top-full left-1/2 absolute border-t-4 border-t-gray-900 border-transparent border-r-4 border-l-4 w-0 h-0 -translate-x-1/2 transform"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {currentStep === 3 && (
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleCheckout}
                  className="px-6 rounded-xl"
                >
                  Proceed to Checkout
                </Button>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Draft Total</p>
              <p className="font-bold text-lg">
                ${(draftPrice / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Selected items */}
        <div
          className={
            "relative overflow-x-auto max-w-full bg-gray-50 rounded-xl border border-gray-200 p-2 pr-10 mb-4 custom-scrollbar fade-right"
          }
        >
          <div className="flex flex-nowrap gap-2 sm:gap-4">
            {selectedBox && (
              <div className="flex flex-shrink-0 items-center gap-2 bg-white shadow-sm hover:shadow-md p-2 border border-gray-200 hover:border-indigo-200 rounded-xl min-w-[10rem] max-w-[16rem] transition">
                <img
                  src={selectedBox.thumbnail}
                  alt={selectedBox.title}
                  className="rounded w-12 h-12 object-cover"
                />
                <span className="text-sm">{selectedBox.title}</span>
                <Button
                  variant="transparent"
                  size="small"
                  onClick={handleRemoveBox}
                  aria-label="Remove box"
                  className="hover:bg-red-50"
                >
                  <XMark />
                </Button>
              </div>
            )}

            {items.map((itemSlug) => {
              const selectedItem = itemOptions.find(
                (i) => stringToSlug(i.title) === itemSlug
              )
              if (!selectedItem) return null
              return (
                <div
                  key={itemSlug}
                  className="flex flex-shrink-0 items-center gap-2 bg-white shadow-sm hover:shadow-md p-2 border border-gray-200 hover:border-indigo-200 rounded-xl min-w-[10rem] max-w-[16rem] transition"
                >
                  <img
                    src={selectedItem.feature_image.url}
                    alt={selectedItem.feature_image.alt || selectedItem.title}
                    className="rounded w-12 h-12 object-cover"
                  />
                  <span className="text-sm">{selectedItem.title}</span>
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => handleRemoveItem(itemSlug)}
                    aria-label={`Remove ${selectedItem.title}`}
                    className="hover:bg-red-50"
                  >
                    <XMark />
                  </Button>
                </div>
              )
            })}

            {card &&
              (() => {
                const selectedCard = cardOptions.find(
                  (c) => stringToSlug(c.title) === card
                )
                if (!selectedCard) return null
                return (
                  <div className="flex flex-shrink-0 items-center gap-2 bg-white shadow-sm hover:shadow-md p-2 border border-gray-200 hover:border-indigo-200 rounded-xl min-w-[10rem] max-w-[16rem] transition">
                    <img
                      src={selectedCard.image.url}
                      alt={selectedCard.image.alt || selectedCard.title}
                      className="rounded w-12 h-12 object-cover"
                    />
                    <span className="text-sm">{selectedCard.title}</span>
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={handleRemoveCard}
                      aria-label="Remove card"
                      className="hover:bg-red-50"
                    >
                      <XMark />
                    </Button>
                  </div>
                )
              })()}
          </div>
        </div>

        {/* Progress indicator */}
        {/* <div className="mt-4">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded ${
                  step <= currentStep 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default GiftSummary
