import React, { useState, useEffect } from "react";
import { useAdminProduct } from "medusa-react";
import {
  Button,
  Input,
  Select,
  Switch,
  Textarea,
  Heading,
  Text,
} from "@medusajs/ui";
import Card from "./common/Card";

interface CustomProductDataProps {
  productId: string;
}

interface ProductType {
  id: string;
  name: string;
  slug: string;
  field_schema: Array<{
    name: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
    description?: string;
    validation?: {
      min?: number;
      max?: number;
    };
  }>;
}

interface CustomProduct {
  id: string;
  product_id: string;
  product_type_id: string;
  custom_attributes: Record<string, any>;
}

const CustomProductData: React.FC<CustomProductDataProps> = ({ productId }) => {
  const { product } = useAdminProduct(productId);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>("");
  const [customAttributes, setCustomAttributes] = useState<Record<string, any>>(
    {}
  );
  const [customProduct, setCustomProduct] = useState<CustomProduct | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch product types
  useEffect(() => {
    fetchProductTypes();
  }, []);

  // Fetch custom product data
  useEffect(() => {
    if (productId) {
      fetchCustomProductData();
    }
  }, [productId]);

  const fetchProductTypes = async () => {
    try {
      const response = await fetch("/admin/product-types");
      const data = await response.json();
      setProductTypes(data.product_types || []);
    } catch (error) {
      console.error("Failed to fetch product types:", error);
    }
  };

  const fetchCustomProductData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/admin/products/${productId}/custom-data`);
      const data = await response.json();

      if (data.custom_product) {
        setCustomProduct(data.custom_product);
        setSelectedProductType(data.custom_product.product_type_id);
        setCustomAttributes(data.custom_product.custom_attributes || {});
      }
    } catch (error) {
      console.error("Failed to fetch custom product data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductTypeChange = (productTypeId: string) => {
    setSelectedProductType(productTypeId);
    // Reset custom attributes when product type changes
    setCustomAttributes({});
  };

  const handleAttributeChange = (fieldName: string, value: any) => {
    setCustomAttributes((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedProductType) {
      alert("Please select a product type");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/admin/products/${productId}/custom-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_type_id: selectedProductType,
          custom_attributes: customAttributes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCustomProduct(data.custom_product);
        alert("Custom product data saved successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to save custom product data:", error);
      alert("Failed to save custom product data");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: any) => {
    const value = customAttributes[field.name] || "";

    switch (field.type) {
      case "text":
        return (
          <div>
            <Text className="text-gray-900 dark:text-gray-100">{field.label}</Text>
            <Input
              key={field.name}
              value={value}
              onChange={(e) =>
                handleAttributeChange(field.name, e.target.value)
              }
              placeholder={field.description}
              required={field.required}
            />
          </div>
        );

      case "number":
        return (
          <div>
            <Text className="text-gray-900 dark:text-gray-100">{field.label}</Text>
            <Input
              key={field.name}
              type="number"
              value={value}
              onChange={(e) =>
                handleAttributeChange(field.name, Number(e.target.value))
              }
              placeholder={field.description}
              required={field.required}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          </div>
        );

      case "boolean":
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Switch
              checked={value}
              onCheckedChange={(checked) =>
                handleAttributeChange(field.name, checked)
              }
            />
            <Text className="text-gray-900 dark:text-gray-100">{field.label}</Text>
          </div>
        );

      case "select":
        return (
          <div>
            <Text className="text-gray-900 dark:text-gray-100">{field.label}</Text>
            <Select
              key={field.name}
              value={value}
              onValueChange={(val) => handleAttributeChange(field.name, val)}
              required={field.required}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select an option" />
              </Select.Trigger>
              <Select.Content>
                {field.options?.map((option: string) => (
                  <Select.Item key={option} value={option}>
                    {option}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
        );

      case "date":
        return (
          <div>
            <Text className="text-gray-900 dark:text-gray-100">{field.label}</Text>
            <Input
              key={field.name}
              type="date"
              value={value}
              onChange={(e) =>
                handleAttributeChange(field.name, e.target.value)
              }
              required={field.required}
            />
          </div>
        );

      default:
        return (
          <div>
            <Text className="text-gray-900 dark:text-gray-100">{field.label}</Text>
            <Textarea
              key={field.name}
              value={value}
              onChange={(e) =>
                handleAttributeChange(field.name, e.target.value)
              }
              placeholder={field.description}
              required={field.required}
            />
          </div>
        );
    }
  };

  const selectedType = productTypes.find((pt) => pt.id === selectedProductType);

  if (loading) {
    return <div className="text-gray-900 dark:text-gray-100">Loading custom product data...</div>;
  }

  return (
    <Card className="p-6">
      <Heading level="h2" className="mb-4 text-gray-900 dark:text-gray-100">
        Custom Product Data
      </Heading>

      <div className="space-y-4">
        {/* Product Type Selection */}
        <div>
          <Text className="text-gray-900 dark:text-gray-100">Product Type</Text>
          <Select
            value={selectedProductType}
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
        {selectedType && (
          <div className="space-y-4">
            <Heading level="h3" className="font-medium text-gray-900 dark:text-gray-100 text-lg">
              Custom Attributes for {selectedType.name}
            </Heading>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              {selectedType.field_schema?.map((field) => (
                <div key={field.name} className="space-y-2">
                  {renderField(field)}
                  {field.description && (
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      {field.description}
                    </Text>
                  )}
                </div>
              ))}
            </div>

            <Button onClick={handleSave} disabled={saving} className="mt-4">
              {saving ? "Saving..." : "Save Custom Data"}
            </Button>
          </div>
        )}

        {/* Current Custom Data Display */}
        {customProduct && (
          <div className="bg-gray-50 dark:bg-gray-700 mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded">
            <Heading level="h3" className="mb-2 font-medium text-gray-900 dark:text-gray-100 text-lg">
              Current Custom Data
            </Heading>
            <pre className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded overflow-auto text-gray-900 dark:text-gray-100 text-sm">
              {JSON.stringify(customProduct.custom_attributes, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CustomProductData;
