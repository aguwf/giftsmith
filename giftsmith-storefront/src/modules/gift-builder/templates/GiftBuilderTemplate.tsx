"use client"

import React from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import ModernStepper from "../components/ModernStepper"
import ModernStepBox from "../components/ModernStepBox"
import ModernStepItems from "../components/ModernStepItems"
import ModernStepCard from "../components/ModernStepCard"
import ModernStepReview from "../components/ModernStepReview"
import { AnimatePresence, motion } from "motion/react"
import ModernGiftSummary from "../components/ModernGiftSummary"

const steps = [ModernStepBox, ModernStepItems, ModernStepCard, ModernStepReview]

const StepContent = () => {
  const { currentStep } = useGiftBuilder()
  const Step = steps[currentStep] || ModernStepBox
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full"
      >
        <Step />
      </motion.div>
    </AnimatePresence>
  )
}

const GiftBuilderTemplate = () => (
  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen">
    <ModernStepper />
    <div className="flex-1">
      <StepContent />
    </div>
    <ModernGiftSummary />
  </div>
)

export default GiftBuilderTemplate
