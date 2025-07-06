import React, { useState } from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { stringToSlug } from "@lib/util/common"
import { itemOptions } from "@lib/constants"
import { motion, AnimatePresence } from "motion/react"
import { Button, Text, Heading } from "@medusajs/ui"
import { Plus, Minus, ShoppingCart, ArrowLeft, Sparkles, Star } from "@medusajs/icons"

const ModernStepItems: React.FC = () => {
  const { items, setItems, setCurrentStep } = useGiftBuilder()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const handleItemToggle = (itemSlug: string) => {
    const newItems = items.includes(itemSlug)
      ? items.filter((v) => v !== itemSlug)
      : [...items, itemSlug]
    setItems(newItems)
    
    // Initialize quantity if adding new item
    if (!items.includes(itemSlug)) {
      setQuantities(prev => ({ ...prev, [itemSlug]: 1 }))
    } else {
      // Remove quantity when removing item
      const newQuantities = { ...quantities }
      delete newQuantities[itemSlug]
      setQuantities(newQuantities)
    }
  }

  const handleQuantityChange = (itemSlug: string, newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantities(prev => ({ ...prev, [itemSlug]: newQuantity }))
    }
  }

  const handleNext = () => {
    if (items.length > 0) {
      setCurrentStep(2)
    }
  }

  const getItemQuantity = (itemSlug: string) => quantities[itemSlug] || 1

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-12 min-h-screen">
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
              <Sparkles className="w-8 h-8 text-blue-500" />
            </motion.div>
            <Heading level="h1" className="bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-transparent text-4xl">
              Choose Your Items
            </Heading>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
          </div>
          <Text className="mx-auto max-w-2xl text-gray-600 text-lg">
            Select the perfect items to fill your gift box. Mix and match to create a unique combination.
          </Text>
        </motion.div>

        {/* Selected Items Summary */}
        {items.length > 0 && (
          <motion.div
            className="bg-white shadow-lg mb-8 p-6 border border-purple-100 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-full w-3 h-3 animate-pulse" />
                <span className="font-semibold text-gray-800">
                  {items.length} item{items.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Star className="w-5 h-5" />
                <span className="font-medium">Great choices!</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Items Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {itemOptions.map((item, index) => {
            const itemSlug = stringToSlug(item.title)
            const isSelected = items.includes(itemSlug)
            const isHovered = hoveredItem === itemSlug
            const quantity = getItemQuantity(itemSlug)

            return (
              <motion.div
                key={item.id}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredItem(itemSlug)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                {/* Item Card */}
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
                  onClick={() => handleItemToggle(itemSlug)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
                  
                  {/* Image Container */}
                  <div className="relative mb-6">
                    <motion.div
                      className="relative rounded-xl overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={item.feature_image.url}
                        alt={item.feature_image.alt || item.title}
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
                              <Plus className="w-5 h-5" />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Selection Indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="-top-2 -right-2 absolute flex justify-center items-center bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg rounded-full w-8 h-8"
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
                      {item.title}
                    </h3>
                    <p className="mb-4 text-gray-600 text-sm line-clamp-2">
                      {item.body_html.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>

                    {/* Price */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-purple-600 text-2xl">
                        ${item.variants[0]?.price || "5.00"}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star className="w-4 h-4" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="mb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-700 text-sm">Quantity:</span>
                            <div className="flex items-center gap-3">
                              <motion.button
                                className="flex justify-center items-center bg-white shadow-sm hover:shadow-md rounded-full w-8 h-8 transition-shadow"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleQuantityChange(itemSlug, Math.max(1, quantity - 1))
                                }}
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </motion.button>
                              <span className="w-8 font-semibold text-gray-800 text-center">
                                {quantity}
                              </span>
                              <motion.button
                                className="flex justify-center items-center bg-white shadow-sm hover:shadow-md rounded-full w-8 h-8 transition-shadow"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleQuantityChange(itemSlug, quantity + 1)
                                }}
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Select Button */}
                    <motion.button
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      whileHover={!isSelected ? { scale: 1.02 } : {}}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSelected ? "Selected" : "Add to Box"}
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
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Box
          </Button>
          <Button
            variant="primary"
            size="large"
            className="bg-gradient-to-r from-purple-500 hover:from-purple-600 to-blue-500 hover:to-blue-600 px-8 py-3 rounded-xl font-semibold"
            onClick={handleNext}
            disabled={items.length === 0}
          >
            Continue to Card
            <ShoppingCart className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernStepItems 