import React from 'react'
import { useGiftBuilder } from '../hooks/use-gift-builder'

const boxOptions = [
  {
    label: 'Original Creme',
    value: 'creme',
    img: 'https://placehold.co/200x200?text=Creme+Box',
  },
  {
    label: 'Matte Black',
    value: 'black',
    img: 'https://placehold.co/200x200?text=Black+Box',
  },
  {
    label: 'Light Pink',
    value: 'pink',
    img: 'https://placehold.co/200x200?text=Pink+Bag',
  },
]
const itemOptions = [
  {
    label: 'Candle',
    value: 'candle',
    img: 'https://placehold.co/120x120?text=Candle',
  },
  {
    label: 'Mug',
    value: 'mug',
    img: 'https://placehold.co/120x120?text=Mug',
  },
  {
    label: 'Notebook',
    value: 'notebook',
    img: 'https://placehold.co/120x120?text=Notebook',
  },
  {
    label: 'Chocolate',
    value: 'chocolate',
    img: 'https://placehold.co/120x120?text=Chocolate',
  },
]
const cardOptions = [
  {
    label: 'Happy Birthday',
    value: 'birthday',
    img: 'https://placehold.co/120x80?text=Birthday+Card',
  },
  {
    label: 'Thank You',
    value: 'thankyou',
    img: 'https://placehold.co/120x80?text=Thank+You+Card',
  },
  {
    label: 'Congrats',
    value: 'congrats',
    img: 'https://placehold.co/120x80?text=Congrats+Card',
  },
]

const StepReview: React.FC = () => {
  const { box, items, card, setCurrentStep } = useGiftBuilder()
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h2 className="mb-2 font-bold text-2xl text-center">REVIEW YOUR GIFT</h2>
      <h3 className="mb-4 text-xl text-center">REVIEW YOUR GIFT</h3>
      <p className="mb-8 text-gray-500 text-center">
        Review your selections before adding to cart.
      </p>
      <div className="flex md:flex-row flex-col justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <span className="mb-2 font-semibold">Box</span>
          <img
            src={boxOptions.find((b) => b.value === box)?.img}
            alt="Box"
            className="mb-1 rounded w-24 h-24 object-cover"
          />
          <span className="text-gray-700 text-sm">
            {boxOptions.find((b) => b.value === box)?.label}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-2 font-semibold">Items</span>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const opt = itemOptions.find((i) => i.value === item)
              return (
                <div key={item} className="flex flex-col items-center">
                  <img
                    src={opt?.img}
                    alt={opt?.label}
                    className="mb-1 rounded w-12 h-12 object-cover"
                  />
                  <span className="text-gray-700 text-xs">{opt?.label}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-2 font-semibold">Card</span>
          <img
            src={cardOptions.find((c) => c.value === card)?.img}
            alt="Card"
            className="mb-1 rounded w-16 h-10 object-cover"
          />
          <span className="text-gray-700 text-xs">
            {cardOptions.find((c) => c.value === card)?.label}
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="bg-gray-200 px-8 py-2 rounded text-gray-700"
          onClick={() => setCurrentStep(2)}
        >
          Back
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 px-8 py-2 rounded text-white transition-all"
          onClick={() => {
            console.log(box, items, card)
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default StepReview
