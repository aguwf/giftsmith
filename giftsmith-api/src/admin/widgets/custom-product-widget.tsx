import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Input, Select, Switch, Textarea, Heading } from "@medusajs/ui";

// Types
interface FieldSchema {
  name: string;
  type: "string" | "number" | "select" | "boolean" | "textarea";
  label: string;
  options?: string[];
}

interface ProductType {
  id: string;
  name: string;
  description: string;
  field_schema: Record<string, FieldSchema>;
}

interface CustomProduct {
  id: string;
  product_id: string;
  product_type_id: string;
  custom_attributes: Record<string, any>;
}

interface FormData {
  product_type_id: string;
  custom_attributes: Record<string, any>;
}

interface CustomProductWidgetProps {
  data: {
    id: string;
  };
}

// Constants
const API_ENDPOINTS = {
  PRODUCT_TYPES: "/admin/product-types",
  CUSTOM_DATA: (productId: string) => `/admin/products/${productId}/custom-data`,
} as const;

// Utility functions
const formatAttributeValue = (key: string, value: any): string => {
  if (typeof value === "boolean") {
    return value ? "✅ Yes" : "❌ No";
  }
  if (typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
  }
  return String(value);
};

const normalizeAttributeKey = (key: string): string => {
  return key.toLowerCase().replace(/\s+/g, "_");
};

// Component for rendering individual attribute inputs
interface AttributeInputProps {
  schema: FieldSchema;
  value: any;
  onChange: (key: string, value: any) => void;
}

const AttributeInput = ({ schema, value, onChange }: AttributeInputProps) => {
  const { type, options, label, name } = schema;

  const handleChange = useCallback((newValue: any) => {
    onChange(name, newValue);
  }, [onChange, name]);

  switch (type) {
    case "string":
      return (
        <Input
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${label}`}
        />
      );
    
    case "number":
      return (
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
          placeholder={`Enter ${label}`}
        />
      );
    
    case "select":
      return (
        <Select value={value || ""} onValueChange={handleChange}>
          <Select.Trigger>
            <Select.Value placeholder={`Select ${label}`} />
          </Select.Trigger>
          <Select.Content>
            {options?.map((option: string) => (
              <Select.Item key={option} value={option}>
                {option}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      );
    
    case "boolean":
      return (
        <Switch
          checked={value || false}
          onCheckedChange={handleChange}
        />
      );
    
    case "textarea":
      return (
        <Textarea
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${label}`}
          rows={3}
        />
      );
    
    default:
      return (
        <Input
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${label}`}
        />
      );
  }
};

// Component for displaying current custom data
interface CustomDataDisplayProps {
  customProduct: CustomProduct;
}

const CustomDataDisplay = ({ customProduct }: CustomDataDisplayProps) => {
  const attributes = Object.entries(customProduct.custom_attributes);

  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-6 border-gray-200 dark:border-gray-700 border-t">
      <h3 className="mb-3 font-medium text-gray-900 dark:text-gray-100 text-sm">
        Current Custom Data:
      </h3>
      <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
        {attributes.map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm capitalize">
              {key.replace(/_/g, " ")}:
            </span>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              {formatAttributeValue(key, value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
const CustomProductWidget = ({ data: product }: CustomProductWidgetProps) => {
  // State
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [customProduct, setCustomProduct] = useState<CustomProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    product_type_id: "",
    custom_attributes: {},
  });

  // Memoized values
  const selectedProductType = useMemo(() => 
    productTypes.find((type) => type.id === formData.product_type_id),
    [productTypes, formData.product_type_id]
  );

  // API functions
  const fetchProductTypes = useCallback(async (): Promise<ProductType[]> => {
    const response = await fetch(API_ENDPOINTS.PRODUCT_TYPES);
    if (!response.ok) {
      throw new Error(`Failed to fetch product types: ${response.statusText}`);
    }
    const data = await response.json();
    return data.product_types || [];
  }, []);

  const fetchCustomData = useCallback(async (): Promise<CustomProduct | null> => {
    const response = await fetch(API_ENDPOINTS.CUSTOM_DATA(product.id));
    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to fetch custom data: ${response.statusText}`);
    }
    if (response.status === 404) {
      return null;
    }
    const data = await response.json();
    return data.custom_product || null;
  }, [product.id]);

  const saveCustomData = useCallback(async (data: FormData): Promise<CustomProduct> => {
    const response = await fetch(API_ENDPOINTS.CUSTOM_DATA(product.id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to save custom data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.custom_product;
  }, [product.id]);

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [types, customData] = await Promise.all([
          fetchProductTypes(),
          fetchCustomData(),
        ]);

        setProductTypes(types);

        if (customData) {
          setCustomProduct(customData);
          setFormData({
            product_type_id: customData.product_type_id,
            custom_attributes: customData.custom_attributes,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (product?.id) {
      fetchData();
    }
  }, [product?.id, fetchProductTypes, fetchCustomData]);

  // Event handlers
  const handleProductTypeChange = useCallback((productTypeId: string) => {
    const selectedType = productTypes.find((type) => type.id === productTypeId);
    if (selectedType) {
      const initialAttributes: Record<string, any> = {};
      Object.keys(selectedType.field_schema).forEach((key) => {
        initialAttributes[key] = formData.custom_attributes[key] || "";
      });

      setFormData({
        product_type_id: productTypeId,
        custom_attributes: initialAttributes,
      });
    }
  }, [productTypes, formData.custom_attributes]);

  const handleAttributeChange = useCallback((key: string, value: any) => {
    const normalizedKey = normalizeAttributeKey(key);
    setFormData((prev) => ({
      ...prev,
      custom_attributes: {
        ...prev.custom_attributes,
        [normalizedKey]: value,
      },
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!formData.product_type_id) return;

    setSaving(true);
    setError(null);

    try {
      const result = await saveCustomData(formData);
      setCustomProduct(result);
      // Could add a toast notification here for success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save custom data");
      console.error("Error saving custom data:", err);
    } finally {
      setSaving(false);
    }
  }, [formData, saveCustomData]);

  // Render loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="text-gray-900 dark:text-gray-100">
          Loading custom product data...
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <Heading level="h2" className="font-sans font-medium text-gray-900 dark:text-gray-100 h1-core">
          Custom Attributes
        </Heading>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Improve your product with custom attributes.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 px-6">
        {/* Product Type Selection */}
        <div>
          <label className="block mb-4 font-medium text-gray-900 text-md dark:text-gray-100">
            Product Type
          </label>
          <Select
            value={formData.product_type_id}
            onValueChange={handleProductTypeChange}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select a product type" />
            </Select.Trigger>
            <Select.Content>
              {productTypes.map((type) => (
                <Select.Item key={type.id} value={type.id}>
                  {type.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {/* Custom Attributes */}
        {selectedProductType && (
          <div>
            <label className="block mb-4 font-medium text-gray-900 text-md dark:text-gray-100">
              Custom Attributes
            </label>
            <div className="space-y-3">
              {Object.entries(selectedProductType.field_schema).map(
                ([key, schema]) => (
                  <div key={key}>
                    <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100 text-sm capitalize">
                      {schema.label}
                    </label>
                    <AttributeInput
                      schema={schema}
                      value={formData.custom_attributes[schema.name]}
                      onChange={handleAttributeChange}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          isLoading={saving}
          disabled={!formData.product_type_id}
        >
          Save Custom Data
        </Button>
      </div>

      {/* Current Custom Data Display */}
      {customProduct && <CustomDataDisplay customProduct={customProduct} />}
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default CustomProductWidget;
