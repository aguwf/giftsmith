import React from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { motion, AnimatePresence } from "motion/react"
import { Check, Gift, Heart, Star } from "@medusajs/icons"
import Package from "@modules/common/icons/package"

const stepConfig = [
  {
    label: "Choose Box",
    icon: Package,
    description: "Select your perfect box"
  },
  {
    label: "Add Items", 
    icon: Gift,
    description: "Pick your favorite items"
  },
  {
    label: "Add Card",
    icon: Heart,
    description: "Include a personal message"
  },
  {
    label: "Review",
    icon: Star,
    description: "Preview and checkout"
  }
]

const ModernStepper: React.FC = () => {
  const { currentStep, setCurrentStep } = useGiftBuilder()

  return (
    <div className="relative bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Progress Bar Background */}
        <div className="relative mb-8">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / stepConfig.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="relative flex justify-between items-start">
          {stepConfig.map((step, idx) => {
            const Icon = step.icon
            const isCompleted = idx < currentStep
            const isActive = idx === currentStep
            const isClickable = idx <= currentStep

            return (
              <motion.div
                key={step.label}
                className="z-10 relative flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* Step Circle */}
                <motion.div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30"
                      : isCompleted
                      ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
                      : "bg-white border-2 border-gray-300 shadow-md"
                  }`}
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  onClick={() => isClickable && setCurrentStep(idx)}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon 
                          className={`${
                            isActive ? "text-white" : "text-gray-400"
                          }`} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pulse effect for active step */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  <h3 className={`font-semibold text-sm ${
                    isActive ? "text-purple-600" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}>
                    {step.label}
                  </h3>
                  <p className="mt-1 max-w-24 text-gray-400 text-xs">
                    {step.description}
                  </p>
                </motion.div>

                {/* Step Number */}
                <motion.div
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  {idx + 1}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress Text */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 text-sm">
            Step {currentStep + 1} of {stepConfig.length} • 
            <span className="ml-1 font-semibold text-purple-600">
              {Math.round(((currentStep + 1) / stepConfig.length) * 100)}% Complete
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernStepper 