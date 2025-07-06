import React, { useMemo, useState } from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { useCustomProducts } from "@lib/hooks/use-custom-products"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@medusajs/ui"
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  Sparkles, 
  Gift,
  Heart,
  Star
} from "@medusajs/icons"
import { useRouter } from "next/navigation"
import Package from "@modules/common/icons/package"

const ModernGiftSummary: React.FC = () => {
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
    <motion.div
      className="right-0 bottom-0 left-0 z-50 fixed"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background Blur */}
      <div className="absolute inset-0" />
      
      <div className="relative mx-auto pb-3 max-w-7xl">
        <div className="bg-white/90 shadow-2xl backdrop-blur-sm p-6 border border-white/50 rounded-2xl">
          {/* Header with step title and price */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-xl">{getStepTitle()}</h3>
              <p className="text-gray-600 text-sm">Step {currentStep + 1} of 4</p>
            </div>
            <div className="flex items-center gap-6">
              {/* Price Display */}
              <motion.div
                className="text-right"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-transparent text-2xl">
                  ${(draftPrice / 100).toFixed(2)}
                </div>
                <div className="text-gray-500 text-xs">Total</div>
              </motion.div>

              {/* Navigation and checkout buttons */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2">
                  <motion.button
                    className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 rounded-full w-12 h-12 transition-colors"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="text-gray-600" />
                  </motion.button>

                  {currentStep < 3 && (
                    <div className="relative">
                      <motion.button
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          canProceed()
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={handleNext}
                        disabled={!canProceed()}
                        whileHover={canProceed() ? { scale: 1.05 } : {}}
                        whileTap={canProceed() ? { scale: 0.95 } : {}}
                        onMouseEnter={() => !canProceed() && setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <ChevronRight />
                      </motion.button>
                      
                      <AnimatePresence>
                        {showTooltip && !canProceed() && (
                          <motion.div
                            className="bottom-full left-1/2 z-50 absolute bg-gray-900 shadow-lg mb-2 px-3 py-2 rounded-lg text-white text-sm whitespace-nowrap -translate-x-1/2 transform"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            {getTooltipMessage()}
                            <div className="top-full left-1/2 absolute border-t-4 border-t-gray-900 border-transparent border-r-4 border-l-4 w-0 h-0 -translate-x-1/2 transform"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {currentStep === 3 && (
                  <motion.button
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 hover:from-green-600 to-emerald-500 hover:to-emerald-600 shadow-lg px-8 py-3 rounded-xl font-semibold text-white"
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart />
                    Proceed to Checkout
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Selected Items Summary */}
          <div className="flex items-center gap-4 pb-2 overflow-x-auto">
            {/* Box */}
            {selectedBox && (
              <motion.div
                className="flex items-center gap-3 bg-gradient-to-r from-pink-50 to-purple-50 p-3 border border-pink-200 rounded-xl min-w-fit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-center items-center bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg w-10 h-10">
                  <Package className="text-pink-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{selectedBox.title}</div>
                  <div className="text-gray-600">Box</div>
                </div>
                <motion.button
                  className="flex justify-center items-center bg-red-100 hover:bg-red-200 rounded-full w-6 h-6 transition-colors"
                  onClick={handleRemoveBox}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-red-600 text-xs">×</span>
                </motion.button>
              </motion.div>
            )}

            {/* Items */}
            {items.map((item, index) => (
              <motion.div
                key={item}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 border border-blue-200 rounded-xl min-w-fit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg w-10 h-10">
                  <Gift className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{item}</div>
                  <div className="text-gray-600">Item</div>
                </div>
                <motion.button
                  className="flex justify-center items-center bg-red-100 hover:bg-red-200 rounded-full w-6 h-6 transition-colors"
                  onClick={() => handleRemoveItem(item)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-red-600 text-xs">×</span>
                </motion.button>
              </motion.div>
            ))}

            {/* Card */}
            {card && (
              <motion.div
                className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-pink-50 p-3 border border-red-200 rounded-xl min-w-fit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-center items-center bg-gradient-to-br from-red-200 to-pink-200 rounded-lg w-10 h-10">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{card}</div>
                  <div className="text-gray-600">Card</div>
                </div>
                <motion.button
                  className="flex justify-center items-center bg-red-100 hover:bg-red-200 rounded-full w-6 h-6 transition-colors"
                  onClick={handleRemoveCard}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-red-600 text-xs">×</span>
                </motion.button>
              </motion.div>
            )}

            {/* Sparkles decoration */}
            <motion.div
              className="flex items-center gap-1 text-yellow-500"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ModernGiftSummary 