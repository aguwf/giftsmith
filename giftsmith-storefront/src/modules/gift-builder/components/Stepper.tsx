import React from "react"
import { useGiftBuilder } from "../hooks/use-gift-builder"
import { clx } from "@medusajs/ui"

const stepLabels = ["Packaging", "Items", "Card", "Done"]

const Stepper: React.FC = () => {
  const { currentStep, setCurrentStep } = useGiftBuilder()
  return (
    <div className="flex justify-center items-center gap-2 py-8">
      {stepLabels.map((label, idx) => (
        <React.Fragment key={label}>
          <div
            className={clx(
              "relative flex flex-col items-center w-1/4",
              idx <= currentStep ? "cursor-pointer" : ""
            )}
            onClick={() => {
              // Only allow clicking on completed steps or current step
              if (idx <= currentStep) {
                setCurrentStep(idx)
              }
            }}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                idx === currentStep
                  ? "border-primary-500 bg-primary-500 text-white"
                  : idx < currentStep
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-300 bg-white text-gray-400"
              } ${idx <= currentStep ? "cursor-pointer" : ""}`}
            >
              {idx + 1}
            </div>
            <span
              className={`text-xs mt-2 ${
                idx === currentStep
                  ? "font-semibold text-black"
                  : "text-gray-400"
              } ${idx <= currentStep ? "cursor-pointer" : ""}`}
            >
              {label}
            </span>
            {idx < stepLabels.length - 1 && (
              <div className="top-[15px] left-[60%] absolute bg-gray-200 w-4/5 h-0.5" />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default Stepper
