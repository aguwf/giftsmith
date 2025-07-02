import { FunctionComponent } from 'react'

interface BuildYourOwnLoadingProps {}

const BuildYourOwnLoading: FunctionComponent<BuildYourOwnLoadingProps> = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="bg-gray-200 rounded-md w-3/4 h-8 animate-pulse" />
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 border rounded-lg">
            <div className="bg-gray-200 rounded-md h-48 animate-pulse" />
            <div className="bg-gray-200 rounded-md w-3/4 h-4 animate-pulse" />
            <div className="bg-gray-200 rounded-md w-1/2 h-4 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuildYourOwnLoading
