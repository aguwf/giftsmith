"use client"

import React from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import Stepper from "../components/Stepper"
import StepBox from "../components/StepBox"
import StepItems from "../components/StepItems"
import StepCard from "../components/StepCard"
import StepReview from "../components/StepReview"
import { AnimatePresence, motion } from "motion/react"
import GiftSummary from "../components/GiftSummary"

const steps = [StepBox, StepItems, StepCard, StepReview]

const StepContent = () => {
  const { currentStep } = useGiftBuilder()
  const Step = steps[currentStep] || StepBox
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Step />
      </motion.div>
    </AnimatePresence>
  )
}

const GiftBuilderTemplate = () => (
  <div className="flex flex-col bg-gray-50 min-h-screen">
    <Stepper />
    <div className="flex flex-col flex-1 justify-center items-center pb-16">
      <StepContent />
    </div>
    <GiftSummary />
  </div>
)

export default GiftBuilderTemplate
