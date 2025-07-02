import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

export type BoxType = string | null
export type ItemType = "candle" | "mug" | "notebook" | "chocolate"
export type CardType = "birthday" | "thankyou" | "congrats" | null

interface GiftBuilderSlice {
  currentStep: number
  box: BoxType
  items: string[]
  card: CardType
  setCurrentStep: (step: number) => void
  setBox: (box: BoxType) => void
  setItems: (items: string[]) => void
  setCard: (card: CardType) => void
  reset: () => void
}

const STORAGE_KEY = "gift-builder-state"

const getValidStep = (step: number, box: BoxType, items: string[], card: CardType): number => {
  if (step === 0) return 0
  if (!box) return 0
  if (step === 1) return 1
  if (items.length === 0) return 1
  if (step === 2) return 2
  if (!card) return 2
  return 3
}

const getInitialState = (): Omit<GiftBuilderSlice, 'setCurrentStep' | 'setBox' | 'setItems' | 'setCard' | 'reset'> => {
  if (typeof window === "undefined") {
    return {
      currentStep: 0,
      box: null,
      items: [],
      card: null
    }
  }
  const params = new URLSearchParams(window.location.search)
  const boxParam = params.get('box') as BoxType
  const itemsParam = params.get('items')?.split(',')
  const cardParam = params.get('card') as CardType
  const stepParam = params.get('step')
  const state = {
    box: boxParam || null,
    items: itemsParam || [],
    card: cardParam || null,
    currentStep: stepParam ? parseInt(stepParam, 10) : 0
  }
  state.currentStep = getValidStep(state.currentStep, state.box, state.items, state.card)
  return state
}

const updateURL = (state: { currentStep: number; box: BoxType; items: string[]; card: CardType }) => {
  if (typeof window === "undefined") return
  const params = new URLSearchParams()
  params.set('step', state.currentStep.toString())
  if (state.box) params.set('box', state.box)
  if (state.items.length > 0) params.set('items', state.items.join(','))
  if (state.card) params.set('card', state.card)
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState({}, '', newUrl)
}

const createGiftBuilderSlice = (set: any, get: any): GiftBuilderSlice => ({
  ...getInitialState(),
  setCurrentStep: (step: number) => {
    set((state: GiftBuilderSlice) => {
      const validStep = getValidStep(step, state.box, state.items, state.card)
      state.currentStep = validStep
    })
  },
  setBox: (newBox: BoxType) => {
    set((state: GiftBuilderSlice) => {
      state.box = newBox
      if (!newBox) {
        state.currentStep = getValidStep(0, newBox, state.items, state.card)
      }
    })
  },
  setItems: (newItems: string[]) => {
    set((state: GiftBuilderSlice) => {
      state.items = newItems
      if (newItems.length === 0) {
        state.currentStep = getValidStep(1, state.box, newItems, state.card)
      }
    })
  },
  setCard: (newCard: CardType) => {
    set((state: GiftBuilderSlice) => {
      state.card = newCard
      if (!newCard) {
        state.currentStep = getValidStep(2, state.box, state.items, newCard)
      }
    })
  },
  reset: () => {
    set((state: GiftBuilderSlice) => {
      state.currentStep = 0
      state.box = null
      state.items = []
      state.card = null
    })
  }
})

export const useGiftBuilderStore = create<GiftBuilderSlice>()(
  persist(
    immer((set, get) => ({
      ...createGiftBuilderSlice(set, get)
    })),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        currentStep: state.currentStep,
        box: state.box,
        items: state.items,
        card: state.card
      }),
      onRehydrateStorage: () => (state: any) => {
        if (state) updateURL(state)
      }
    }
  )
)

// Subscribe to state changes and update URL
if (typeof window !== "undefined") {
  useGiftBuilderStore.subscribe((state: GiftBuilderSlice) => {
    updateURL(state)
  })
} 