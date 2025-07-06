import React, { useState } from "react"
import { useGiftBuilder, CardType } from "../hooks/use-gift-builder"
import { cardOptions } from "@lib/constants"
import { stringToSlug } from "@lib/util/common"
import { motion, AnimatePresence } from "motion/react"
import { Button, Text, Heading, Textarea } from "@medusajs/ui"
import { Heart, ChatBubbleLeftRight, ArrowLeft, ArrowRight, Sparkles, DocumentText } from "@medusajs/icons"

const ModernStepCard: React.FC = () => {
  const { card, setCard, setCurrentStep } = useGiftBuilder()
  const [selectedCard, setSelectedCard] = useState<CardType>(card)
  const [message, setMessage] = useState("")
  const [selectedFont, setSelectedFont] = useState("serif")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const fontOptions = [
    { value: "serif", label: "Elegant", preview: "serif" },
    { value: "sans", label: "Modern", preview: "sans-serif" },
    { value: "cursive", label: "Handwritten", preview: "cursive" },
    { value: "mono", label: "Clean", preview: "monospace" }
  ]

  const handleCardSelect = (cardType: CardType) => {
    setSelectedCard(cardType)
    setCard(cardType)
  }

  const handleNext = () => {
    setCurrentStep(3)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 px-4 py-12 min-h-screen">
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
              <Sparkles className="w-8 h-8 text-pink-500" />
            </motion.div>
            <Heading level="h1" className="bg-clip-text bg-gradient-to-r from-pink-600 to-red-600 font-bold text-transparent text-4xl">
              Add a Personal Touch
            </Heading>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-red-500" />
            </motion.div>
          </div>
          <Text className="mx-auto max-w-2xl text-gray-600 text-lg">
            Choose a beautiful card and write a heartfelt message to make your gift truly special.
          </Text>
        </motion.div>

        <div className="gap-12 grid grid-cols-1 lg:grid-cols-2 mb-12">
          {/* Card Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="flex items-center gap-2 mb-6 font-bold text-gray-800 text-2xl">
              <Heart className="w-6 h-6 text-pink-500" />
              Choose Your Card
            </h2>
            
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              {cardOptions.map((cardOption, index) => {
                const cardSlug = stringToSlug(cardOption.title) as CardType
                const isSelected = selectedCard === cardSlug
                const isHovered = hoveredCard === cardSlug

                return (
                  <motion.div
                    key={cardOption.id}
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onHoverStart={() => setHoveredCard(cardSlug)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <motion.div
                      className={`relative bg-white rounded-2xl p-6 cursor-pointer overflow-hidden ${
                        isSelected 
                          ? "ring-4 ring-pink-500 shadow-2xl shadow-pink-500/30" 
                          : "shadow-lg hover:shadow-xl"
                      } transition-all duration-300`}
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        rotateY: 5
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCardSelect(cardSlug)}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-red-50 opacity-50" />
                      
                      {/* Card Preview */}
                      <div className="relative mb-6">
                        <motion.div
                          className="relative bg-gradient-to-br from-pink-100 to-red-100 p-4 rounded-xl overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={cardOption.image.url}
                            alt={cardOption.image.alt || cardOption.title}
                            className="rounded-lg w-full h-48 object-cover"
                          />
                          
                          {/* Card Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                          
                          {/* Quick Actions */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                className="absolute inset-0 flex justify-center items-center gap-4 bg-black/40 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <motion.button
                                  className="flex justify-center items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 text-white transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <ChatBubbleLeftRight className="w-5 h-5" />
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        {/* Selection Indicator */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              className="-top-2 -right-2 absolute flex justify-center items-center bg-gradient-to-br from-pink-500 to-red-500 shadow-lg rounded-full w-8 h-8"
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
                          {cardOption.title}
                        </h3>
                        <p className="mb-4 text-gray-600 text-sm">
                          Perfect for expressing your feelings
                        </p>

                        {/* Select Button */}
                        <motion.button
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          whileHover={!isSelected ? { scale: 1.02 } : {}}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSelected ? "Selected" : "Choose Card"}
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Message Customization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="flex items-center gap-2 mb-6 font-bold text-gray-800 text-2xl">
              <ChatBubbleLeftRight className="w-6 h-6 text-red-500" />
              Personalize Your Message
            </h2>

            <div className="bg-white shadow-lg p-8 rounded-2xl">
              {/* Font Selection */}
              <div className="mb-6">
                <label className="block flex items-center gap-2 mb-3 font-medium text-gray-700 text-sm">
                  <DocumentText className="w-4 h-4" />
                  Choose Font Style
                </label>
                <div className="gap-3 grid grid-cols-2">
                  {fontOptions.map((font) => (
                    <motion.button
                      key={font.value}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedFont === font.value
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedFont(font.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="mb-1 font-medium text-sm">{font.label}</div>
                      <div 
                        className="text-xs"
                        style={{ fontFamily: font.preview }}
                      >
                        Sample text
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="block mb-3 font-medium text-gray-700 text-sm">
                  Your Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt message here..."
                  className="p-4 border-2 border-gray-200 focus:border-pink-500 rounded-xl focus:ring-2 focus:ring-pink-200 w-full transition-all duration-300"
                  rows={6}
                  style={{ fontFamily: selectedFont === "serif" ? "serif" : selectedFont === "sans" ? "sans-serif" : selectedFont === "cursive" ? "cursive" : "monospace" }}
                />
                <div className="flex justify-between items-center mt-2 text-gray-500 text-xs">
                  <span>Make it personal and meaningful</span>
                  <span>{message.length}/500</span>
                </div>
              </div>

              {/* Message Preview */}
              {message && (
                <motion.div
                  className="bg-gradient-to-br from-pink-50 to-red-50 mb-6 p-6 border border-pink-200 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4 className="mb-3 font-semibold text-gray-800">Preview:</h4>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    style={{ fontFamily: selectedFont === "serif" ? "serif" : selectedFont === "sans" ? "sans-serif" : selectedFont === "cursive" ? "cursive" : "monospace" }}
                  >
                    {message}
                  </div>
                </motion.div>
              )}

              {/* Quick Message Templates */}
              <div className="mb-6">
                <label className="block mb-3 font-medium text-gray-700 text-sm">
                  Quick Templates
                </label>
                <div className="gap-2 grid grid-cols-1">
                  {[
                    "Happy Birthday! Wishing you a day filled with joy and laughter.",
                    "Thank you for being such an amazing friend. You mean the world to me.",
                    "Congratulations on your special day! You deserve all the happiness in the world.",
                    "Just wanted to let you know how much you're appreciated. Thank you!"
                  ].map((template, index) => (
                    <motion.button
                      key={index}
                      className="hover:bg-gray-50 p-3 rounded-lg text-gray-600 text-sm text-left transition-colors"
                      onClick={() => setMessage(template)}
                      whileHover={{ x: 5 }}
                    >
                      {template}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="secondary"
            size="large"
            className="px-8 py-3 rounded-xl font-semibold"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Items
          </Button>
          <Button
            variant="primary"
            size="large"
            className="bg-gradient-to-r from-pink-500 hover:from-pink-600 to-red-500 hover:to-red-600 px-8 py-3 rounded-xl font-semibold"
            onClick={handleNext}
          >
            Continue to Review
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernStepCard 