import React, { useState, useMemo } from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { useCustomProducts } from "@lib/hooks/use-custom-products"
import { itemOptions, cardOptions } from "@lib/constants"
import { stringToSlug } from "@lib/util/common"
import { motion, AnimatePresence } from "motion/react"
import { Button, Text, Heading } from "@medusajs/ui"
import {
  ShoppingCart,
  ArrowLeft,
  Sparkles,
  Heart,
  Gift,
  CheckCircle,
  Star,
  CurrencyDollar,
} from "@medusajs/icons"
import { useRouter } from "next/navigation"
import Package from "@modules/common/icons/package"

const ModernStepReview: React.FC = () => {
  const { box, items, card, setCurrentStep } = useGiftBuilder()
  const router = useRouter()
  const [isRotating, setIsRotating] = useState(false)

  const { products } = useCustomProducts({
    productTypeId: "01JY94DQJEE9Y776FMMB95J5PH",
  })

  // Calculate total price
  const totalPrice = useMemo(() => {
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

  const handleBack = () => {
    setCurrentStep(2)
  }

  const handleCheckout = () => {
    // Navigate to checkout with gift builder data
    const giftData = {
      box,
      items,
      card,
      total: totalPrice,
    }

    // Store in localStorage or pass as query params
    localStorage.setItem("giftBuilderData", JSON.stringify(giftData))
    router.push("/checkout?source=gift-builder")
  }

  const selectedBox = products.find((b) => b.handle === box)
  const selectedCard = cardOptions.find((c) => stringToSlug(c.title) === card)

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-green-500" />
            </motion.div>
            <Heading
              level="h1"
              className="bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold text-transparent text-4xl"
            >
              Review Your Perfect Gift
            </Heading>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-emerald-500" />
            </motion.div>
          </div>
          <Text className="mx-auto max-w-2xl text-gray-600 text-lg">
            Take a final look at your customized gift before proceeding to
            checkout.
          </Text>
        </motion.div>

        <div className="gap-12 grid grid-cols-1 lg:grid-cols-2 mb-12">
          {/* 3D Gift Box Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <h2 className="flex items-center gap-2 mb-6 font-bold text-gray-800 text-2xl">
              <Gift className="w-6 h-6 text-green-500" />
              Your Gift Preview
            </h2>

            {/* 3D Box Container */}
            <div className="relative mb-8 w-80 h-80">
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isRotating ? 360 : 0 }}
                transition={{ duration: 3, ease: "easeInOut" }}
                onHoverStart={() => setIsRotating(true)}
                onHoverEnd={() => setIsRotating(false)}
              >
                {/* Box Base */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 shadow-2xl rounded-2xl rotate-12 scale-95 transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 border-4 border-white/50 rounded-2xl" />
                </div>

                {/* Box Lid */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-300 shadow-xl rounded-2xl -rotate-6 scale-90 transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 border-4 border-white/50 rounded-2xl" />
                </div>

                {/* Ribbon */}
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="bg-gradient-to-b from-red-400 to-red-600 shadow-lg rounded-full w-4 h-32" />
                  <div className="absolute bg-gradient-to-r from-red-400 to-red-600 shadow-lg rounded-full w-32 h-4" />

                  {/* Bow */}
                  <motion.div
                    className="absolute bg-gradient-to-br from-red-500 to-red-700 shadow-lg rounded-full w-16 h-16"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="absolute inset-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full" />
                  </motion.div>
                </div>

                {/* Sparkles Effect */}
                <AnimatePresence>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-yellow-400 rounded-full w-2 h-2"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + i * 10}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Hover Instructions */}
              <motion.div
                className="-bottom-8 left-1/2 absolute text-center -translate-x-1/2 transform"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-gray-600 text-sm">Hover to rotate</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Gift Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="flex items-center gap-2 mb-6 font-bold text-gray-800 text-2xl">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              Gift Details
            </h2>

            <div className="space-y-6 bg-white shadow-lg p-8 rounded-2xl">
              {/* Selected Box */}
              {selectedBox && (
                <motion.div
                  className="flex items-center gap-4 bg-gradient-to-r from-pink-50 to-purple-50 p-4 border border-pink-200 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-center items-center bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg w-16 h-16">
                    <Package className="text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {selectedBox.title}
                    </h3>
                    <p className="text-gray-600 text-sm">Beautiful gift box</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-pink-600">
                      $
                      {(
                        selectedBox.variants?.[0]?.prices?.[0]?.amount / 100
                      ).toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Selected Items */}
              {items.length > 0 && (
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                    <Gift className="text-purple-500" />
                    Selected Items ({items.length})
                  </h4>
                  {items.map((itemSlug, index) => {
                    const item = itemOptions.find(
                      (i) => stringToSlug(i.title) === itemSlug
                    )
                    return item ? (
                      <motion.div
                        key={itemSlug}
                        className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 p-3 border border-blue-200 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg w-12 h-12">
                          <Gift className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">
                            {item.title}
                          </h5>
                          <p className="text-gray-600 text-sm">
                            Perfect addition
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">$5.00</div>
                        </div>
                      </motion.div>
                    ) : null
                  })}
                </motion.div>
              )}

              {/* Selected Card */}
              {selectedCard && (
                <motion.div
                  className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-pink-50 p-4 border border-red-200 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex justify-center items-center bg-gradient-to-br from-red-200 to-pink-200 rounded-lg w-16 h-16">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {selectedCard.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Personal message included
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">$2.00</div>
                  </div>
                </motion.div>
              )}

              {/* Total Price */}
              <motion.div
                className="pt-6 border-gray-200 border-t"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CurrencyDollar className="w-6 h-6 text-green-500" />
                    <span className="font-semibold text-gray-800 text-lg">
                      Total
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold text-transparent text-3xl">
                      ${(totalPrice / 100).toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      Free shipping included
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Special Features */}
              <motion.div
                className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border border-yellow-200 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500" />
                    ))}
                  </div>
                  <span className="font-medium text-yellow-800 text-sm">
                    Premium gift wrapping included
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="secondary"
            size="large"
            className="px-8 py-3 rounded-xl font-semibold"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Card
          </Button>
          <Button
            variant="primary"
            size="large"
            className="bg-gradient-to-r from-green-500 hover:from-green-600 to-emerald-500 hover:to-emerald-600 px-8 py-3 rounded-xl font-semibold"
            onClick={handleCheckout}
          >
            Proceed to Checkout
            <ShoppingCart className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernStepReview
