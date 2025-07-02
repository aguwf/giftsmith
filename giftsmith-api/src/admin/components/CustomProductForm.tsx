import React from "react";
import { Button, Input, Textarea, Select, Switch } from "@medusajs/ui";

interface ProductType {
  id: string;
  name: string;
  description: string;
  field_schema: Record<string, any>;
}

interface CustomProductFormProps {
  formData: {
    id: string;
    product_id: string;
    product_type_id: string;
    custom_attributes: Record<string, any>;
  };
  productTypes: ProductType[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onProductTypeChange: (productTypeId: string) => void;
  onAttributeChange: (key: string, value: any) => void;
  onFormDataChange: (data: any) => void;
}

const CustomProductForm: React.FC<CustomProductFormProps> = ({
  formData,
  productTypes,
  onSubmit,
  onCancel,
  onProductTypeChange,
  onAttributeChange,
  onFormDataChange,
}) => {
  const renderAttributeInput = (key: string, schema: any) => {
    const { type, options, label } = schema;

    switch (type) {
      case "string":
        return (
          <Input
            value={formData.custom_attributes[key] || ""}
            onChange={(e) => onAttributeChange(key, e.target.value)}
            placeholder={`Enter ${label}`}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={formData.custom_attributes[key] || ""}
            onChange={(e) =>
              onAttributeChange(key, parseFloat(e.target.value))
            }
            placeholder={`Enter ${label}`}
          />
        );
      case "select":
        return (
          <Select
            value={formData.custom_attributes[key] || ""}
            onValueChange={(value) => onAttributeChange(key, value)}
          >
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
            checked={formData.custom_attributes[key] || false}
            onCheckedChange={(checked) => onAttributeChange(key, checked)}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={formData.custom_attributes[key] || ""}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                custom_attributes: {
                  ...formData.custom_attributes,
                  [key]: e.target.value,
                },
              })
            }
            placeholder={`Enter ${label}`}
            rows={3}
          />
        );
      default:
        return (
          <Input
            value={formData.custom_attributes[key] || ""}
            onChange={(e) => onAttributeChange(key, e.target.value)}
            placeholder={`Enter ${key}`}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
            Product ID
          </label>
          <Input
            value={formData.product_id}
            onChange={(e) =>
              onFormDataChange({ ...formData, product_id: e.target.value })
            }
            placeholder="Enter product ID"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
            Product Type
          </label>
          <Select
            value={formData.product_type_id}
            onValueChange={onProductTypeChange}
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

        {formData.product_type_id && (
          <div>
            <label className="block mb-4 font-medium text-gray-900 dark:text-gray-100 text-lg">
              Custom Attributes
            </label>
            <div className="space-y-4">
              {productTypes.find(
                (type) => type.id === formData.product_type_id
              )?.field_schema &&
                Object.entries(
                  productTypes.find(
                    (type) => type.id === formData.product_type_id
                  )!.field_schema
                ).map(([key, schema]) => (
                  <div key={key}>
                    <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm capitalize">
                      {schema.label}
                    </label>
                    {renderAttributeInput(schema.name, schema)}
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit">
            {formData.id ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CustomProductForm; 