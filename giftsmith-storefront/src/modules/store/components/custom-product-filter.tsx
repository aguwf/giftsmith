import React, { useState } from "react"
import { useCustomProducts } from "@lib/hooks/use-custom-products"
import { useProductTypes } from "@lib/hooks/use-product-types"

export default function CustomProductFilter() {
  const [selectedProductType, setSelectedProductType] = useState<string>("")
  const [customAttribute, setCustomAttribute] = useState<string>("")
  const [customValue, setCustomValue] = useState<string>("")

  const { productTypes, loading: typesLoading } = useProductTypes()
  const { products, loading: productsLoading, error } = useCustomProducts({
    productTypeId: selectedProductType || undefined,
    customAttribute: customAttribute || undefined,
    customValue: customValue || undefined,
  })

  const selectedType = productTypes.find(pt => pt.id === selectedProductType)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-bold text-2xl">Custom Products</h2>
        
        {/* Product Type Filter */}
        <div>
          <label className="block mb-2 font-medium text-sm">
            Filter by Product Type
          </label>
          <select
            value={selectedProductType}
            onChange={(e) => {
              setSelectedProductType(e.target.value)
              setCustomAttribute("")
              setCustomValue("")
            }}
            className="p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">All Product Types</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Attribute Filter */}
        {selectedType && (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium text-sm">
                Filter by Custom Field
              </label>
              <select
                value={customAttribute}
                onChange={(e) => setCustomAttribute(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select a field</option>
                {selectedType.field_schema.map((field) => (
                  <option key={field.name} value={field.name}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            {customAttribute && (
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Value
                </label>
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Enter value to filter by"
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        {error && (
          <div className="mb-4 text-red-600">
            Error: {error}
          </div>
        )}

        {productsLoading ? (
          <div className="text-gray-600">Loading products...</div>
        ) : (
          <div>
            <h3 className="mb-4 font-semibold text-lg">
              Results ({products.length} products)
            </h3>
            
            {products.length === 0 ? (
              <p className="text-gray-600">No products found matching your criteria.</p>
            ) : (
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="mb-2 font-semibold text-lg">{product.title}</h4>
                    <p className="mb-2 text-gray-600">{product.description}</p>
                    
                    {/* Display custom attributes */}
                    {product.custom_product && (
                      <div className="bg-gray-50 mt-4 p-3 rounded">
                        <h5 className="mb-2 font-medium text-sm">
                          {product.custom_product.product_type.name} Attributes:
                        </h5>
                        <div className="space-y-1">
                          {Object.entries(product.custom_product.custom_attributes).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 