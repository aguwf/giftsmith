"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export type BoxType = string | null
export type ItemType = "candle" | "mug" | "notebook" | "chocolate"
export type CardType = "birthday" | "thankyou" | "congrats" | null

interface GiftBuilderContextProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  box: BoxType
  setBox: (box: BoxType) => void
  items: string[]
  setItems: (items: string[]) => void
  card: CardType
  setCard: (card: CardType) => void
}

const GiftBuilderContext = createContext<GiftBuilderContextProps | undefined>(
  undefined
)

const STORAGE_KEY = "gift-builder-state"

// Helper function to validate step based on selections
const getValidStep = (step: number, box: BoxType, items: string[], card: CardType): number => {
  // For step 0, allow it regardless of selections
  if (step === 0) return 0

  // Keep existing logic for other steps
  if (!box) return 0
  if (step === 1) return 1
  if (items.length === 0) return 1
  if (step === 2) return 2
  if (!card) return 2
  return 3
}

// Helper function to get initial state from URL and localStorage
const getInitialState = () => {
  if (typeof window === "undefined") {
    return {
      step: 0,
      box: null,
      items: [],
      card: null
    }
  }

  // Get URL parameters
  const params = new URLSearchParams(window.location.search)
  const boxParam = params.get('box') as BoxType
  const itemsParam = params.get('items')?.split(',')
  const cardParam = params.get('card') as CardType
  const stepParam = params.get('step')

  // Get localStorage data
  const savedState = localStorage.getItem(STORAGE_KEY)
  const parsedState = savedState ? JSON.parse(savedState) : null

  // Combine URL params and localStorage data
  const state = {
    box: boxParam || (parsedState?.box || null),
    items: itemsParam || (parsedState?.items || []),
    card: cardParam || (parsedState?.card || null),
    step: stepParam ? parseInt(stepParam, 10) : (parsedState?.step || 0)
  }

  // Validate step
  state.step = getValidStep(state.step, state.box, state.items, state.card)

  return state
}

export const GiftBuilderProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize all state at once
  const initialState = getInitialState()
  const [currentStep, setCurrentStepState] = useState(initialState.step)
  const [box, setBoxState] = useState<BoxType>(initialState.box)
  const [items, setItemsState] = useState<string[]>(initialState.items)
  const [card, setCardState] = useState<CardType>(initialState.card)

  // Update URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams()
    
    // Always include step in URL
    params.set('step', currentStep.toString())
    
    // Add other parameters if they exist
    if (box) params.set('box', box)
    if (items.length > 0) params.set('items', items.join(','))
    if (card) params.set('card', card)

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }, [box, items, card, currentStep, router])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const validStep = getValidStep(currentStep, box, items, card)
      const state = {
        step: validStep,
        box,
        items,
        card
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [currentStep, box, items, card])

  const setCurrentStep = (step: number) => {
    const validStep = getValidStep(step, box, items, card)
    setCurrentStepState(validStep)
  }

  const setBox = (newBox: BoxType) => {
    setBoxState(newBox)
    // If box is cleared, reset step to 0
    if (!newBox) {
      setCurrentStepState(0)
    }
  }

  const setItems = (newItems: string[]) => {
    setItemsState(newItems)
    // If items are cleared, reset step to 1
    if (newItems.length === 0) {
      setCurrentStepState(1)
    }
  }

  const setCard = (newCard: CardType) => {
    setCardState(newCard)
    // If card is cleared, reset step to 2
    if (!newCard) {
      setCurrentStepState(2)
    }
  }

  return (
    <GiftBuilderContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        box,
        setBox,
        items,
        setItems,
        card,
        setCard,
      }}
    >
      {children}
    </GiftBuilderContext.Provider>
  )
}

export const useGiftBuilder = () => {
  const ctx = useContext(GiftBuilderContext)
  if (!ctx)
    throw new Error("useGiftBuilder must be used within GiftBuilderProvider")
  return ctx
}
