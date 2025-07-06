import React, { useState } from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { useCustomProducts } from "@lib/hooks/use-custom-products"
import { motion, AnimatePresence } from "motion/react"
import { Button, Text, Heading } from "@medusajs/ui"
import { Sparkles, Eye, Heart, ShoppingCart } from "@medusajs/icons"

const ModernStepBox: React.FC = () => {
  const { box, setBox, setCurrentStep } = useGiftBuilder()
  const [hoveredBox, setHoveredBox] = useState<string | null>(null)
  const [selectedBox, setSelectedBox] = useState<string | null>(box)

  const { products } = useCustomProducts({
    productTypeId: "01JY94DQJEE9Y776FMMB95J5PH"
  })

  const handleBoxSelect = (boxHandle: string) => {
    setSelectedBox(boxHandle)
    setBox(boxHandle)
  }

  const handleNext = () => {
    if (selectedBox) {
      setCurrentStep(1)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 px-4 py-12 min-h-screen">
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
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
            <Heading level="h1" className="bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-transparent text-4xl">
              Choose Your Perfect Box
            </Heading>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-pink-500" />
            </motion.div>
          </div>
          <Text className="mx-auto max-w-2xl text-gray-600 text-lg">
            Start your gift journey by selecting a beautiful box that matches your style. 
            Each box is carefully crafted to make your gift extra special.
          </Text>
        </motion.div>

        {/* Box Grid */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {products.map((product, index) => {
            const isSelected = selectedBox === product.handle
            const isHovered = hoveredBox === product.handle

            return (
              <motion.div
                key={product.handle}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredBox(product.handle)}
                onHoverEnd={() => setHoveredBox(null)}
              >
                {/* Box Card */}
                <motion.div
                  className={`relative bg-white rounded-2xl p-6 cursor-pointer overflow-hidden ${
                    isSelected 
                      ? "ring-4 ring-purple-500 shadow-2xl shadow-purple-500/30" 
                      : "shadow-lg hover:shadow-xl"
                  } transition-all duration-300`}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    rotateY: 5
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBoxSelect(product.handle)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50" />
                  
                  {/* Image Container */}
                  <div className="relative mb-6">
                    <motion.div
                      className="relative rounded-xl overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      
                      {/* Quick Actions */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 flex justify-center items-center gap-4 bg-black/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.button
                              className="flex justify-center items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 text-white transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Eye className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              className="flex justify-center items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 text-white transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart className="w-5 h-5" />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Selection Indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="-top-2 -right-2 absolute flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg rounded-full w-8 h-8"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4 text-white" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  <div className="z-10 relative">
                    <h3 className="mb-2 font-bold text-gray-800 text-lg">
                      {product.title}
                    </h3>
                    <p className="mb-4 text-gray-600 text-sm line-clamp-3">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-purple-600 text-2xl">
                        ${(product.variants?.[0]?.prices?.[0]?.amount / 100).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Special Features */}
                    {product.title === "Light Pink" && (
                      <motion.div
                        className="bg-gradient-to-r from-pink-100 to-purple-100 mb-4 p-3 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-pink-500" />
                          <span className="font-medium text-pink-700 text-sm">
                            Custom Embroidery Available
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Select Button */}
                    <motion.button
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      whileHover={!isSelected ? { scale: 1.02 } : {}}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSelected ? "Selected" : "Select Box"}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Navigation */}
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="secondary"
            size="large"
            className="px-8 py-3 rounded-xl font-semibold"
            onClick={() => setCurrentStep(0)}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="large"
            className="bg-gradient-to-r from-purple-500 hover:from-purple-600 to-pink-500 hover:to-pink-600 px-8 py-3 rounded-xl font-semibold"
            onClick={handleNext}
            disabled={!selectedBox}
          >
            Continue to Items
            <ShoppingCart className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernStepBox 