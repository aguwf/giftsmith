import { defineRouteConfig } from "@medusajs/admin-sdk";
import { useState, useEffect } from "react";
import { Button, Input, Textarea, Select } from "@medusajs/ui";
import Modal from "../../components/common/Modal";

interface ProductType {
  id: string;
  name: string;
  description: string;
  field_schema: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const ProductTypesPage = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    field_schema: "",
  });
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [showSchemaExample, setShowSchemaExample] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    id: '',
    name: '',
    description: '',
    field_schema: '',
  });
  const [updateSchemaError, setUpdateSchemaError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const response = await fetch("/admin/product-types");
      const data = await response.json();
      setProductTypes(data.product_types || []);
    } catch (error) {
      console.error("Error fetching product types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (schemaError) {
      alert("Please fix the schema errors before submitting.");
      return;
    }

    try {
      const schema = JSON.parse(formData.field_schema);
      const response = await fetch("/admin/product-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: JSON.stringify({
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/ /g, "-"),
            description: formData.description,
            field_schema: schema,
          }),
        }),
      });

      if (response.ok) {
        closeModal();
        fetchProductTypes();
      }
    } catch (error) {
      console.error("Error creating product type:", error);
    }
  };

  const deleteProductType = async (id: string) => {
    if (confirm("Are you sure you want to delete this product type?")) {
      try {
        await fetch(`/admin/product-types/${id}`, {
          method: "DELETE",
        });
        fetchProductTypes();
      } catch (error) {
        console.error("Error deleting product type:", error);
      }
    }
  };

  const formatSchemaDisplay = (schema: Record<string, any>) => {
    return Object.entries(schema).map(([key, config]) => {
      const { type, options, required, min, max, description, label } =
        config as any;

      return {
        key,
        type,
        options,
        required,
        min,
        max,
        description,
        label,
      };
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      string: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      number: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      boolean: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      select: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      textarea: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const validateSchema = (schemaText: string) => {
    try {
      const schema = JSON.parse(schemaText);
      if (typeof schema !== "object" || schema === null) {
        return "Schema must be a valid JSON object";
      }

      for (const [key, config] of Object.entries(schema)) {
        if (typeof config !== "object" || config === null) {
          return `Field "${key}" must be an object`;
        }

        const { type, options, required, min, max } = config as any;

        if (!type || typeof type !== "string") {
          return `Field "${key}" must have a valid "type" property`;
        }

        if (
          !["string", "number", "boolean", "select", "textarea"].includes(type)
        ) {
          return `Field "${key}" has invalid type "${type}". Supported types: string, number, boolean, select, textarea`;
        }

        if (type === "select" && (!options || !Array.isArray(options))) {
          return `Field "${key}" of type "select" must have an "options" array`;
        }

        if (type === "number" && min !== undefined && typeof min !== "number") {
          return `Field "${key}" has invalid "min" value`;
        }

        if (type === "number" && max !== undefined && typeof max !== "number") {
          return `Field "${key}" has invalid "max" value`;
        }
      }

      return null;
    } catch (error) {
      return "Invalid JSON format";
    }
  };

  const handleSchemaChange = (value: string) => {
    setFormData({ ...formData, field_schema: value });
    const error = validateSchema(value);
    setSchemaError(error);
  };

  const insertSchemaTemplate = (template: string) => {
    setFormData({ ...formData, field_schema: template });
    setSchemaError(null);
  };

  const closeModal = () => {
    setShowForm(false);
    setFormData({ name: "", description: "", field_schema: "" });
    setSchemaError(null);
    setShowSchemaExample(false);
  };

  const openUpdateModal = (type: ProductType) => {
    setUpdateFormData({
      id: type.id,
      name: type.name,
      description: type.description,
      field_schema: JSON.stringify(type.field_schema, null, 2),
    });
    setUpdateSchemaError(null);
    setShowUpdateForm(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateForm(false);
    setUpdateFormData({ id: '', name: '', description: '', field_schema: '' });
    setUpdateSchemaError(null);
  };

  const handleUpdateSchemaChange = (value: string) => {
    setUpdateFormData({ ...updateFormData, field_schema: value });
    const error = validateSchema(value);
    setUpdateSchemaError(error);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateSchemaError) {
      alert('Please fix the schema errors before submitting.');
      return;
    }
    try {
      const schema = JSON.parse(updateFormData.field_schema);
      const response = await fetch(`/admin/product-types/${updateFormData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: JSON.stringify({
            name: updateFormData.name,
            slug: updateFormData.name.toLowerCase().replace(/ /g, '-'),
            description: updateFormData.description,
            field_schema: schema,
          }),
        }),
      });
      if (response.ok) {
        closeUpdateModal();
        fetchProductTypes();
      }
    } catch (error) {
      console.error('Error updating product type:', error);
    }
  };

  if (loading) {
    return <div className="text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-2xl">Product Types</h1>
        <Button onClick={() => setShowForm(true)}>
          Create New Product Type
        </Button>
      </div>

      {/* Modal */}
      <Modal isOpen={showForm} onClose={closeModal} size="xl">
        <Modal.Title>Create New Product Type</Modal.Title>

        <Modal.Body>
          <form onSubmit={handleSubmit} id="product-type-form">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Gift Box, Gift Card"
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe this product type..."
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Field Schema (JSON)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => setShowSchemaExample(!showSchemaExample)}
                    >
                      {showSchemaExample ? "Hide" : "Show"} Examples
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() =>
                        insertSchemaTemplate(`{
  "box_size": {
    "type": "select",
    "options": ["small", "medium", "large"],
    "required": true,
    "description": "Size of the gift box"
  },
  "box_color": {
    "type": "string",
    "required": false,
    "description": "Color of the gift box"
  },
  "max_items": {
    "type": "number",
    "min": 1,
    "max": 20,
    "required": true,
    "description": "Maximum number of items"
  },
  "personalization": {
    "type": "boolean",
    "required": false,
    "description": "Allow personalization"
  }
}`)
                      }
                    >
                      Insert Template
                    </Button>
                  </div>

                  {showSchemaExample && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <h5 className="mb-2 font-medium text-blue-900 dark:text-blue-100 text-sm">
                        Schema Examples:
                      </h5>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium text-blue-800 dark:text-blue-200">String field:</span>
                          <code className="bg-blue-100 dark:bg-blue-800 ml-1 px-1 rounded text-blue-800 dark:text-blue-200">{`{"type": "string", "required": true}`}</code>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800 dark:text-blue-200">Select field:</span>
                          <code className="bg-blue-100 dark:bg-blue-800 ml-1 px-1 rounded text-blue-800 dark:text-blue-200">{`{"type": "select", "options": ["option1", "option2"], "required": true}`}</code>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800 dark:text-blue-200">
                            Number with range:
                          </span>
                          <code className="bg-blue-100 dark:bg-blue-800 ml-1 px-1 rounded text-blue-800 dark:text-blue-200">{`{"type": "number", "min": 1, "max": 100, "required": true}`}</code>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800 dark:text-blue-200">Boolean field:</span>
                          <code className="bg-blue-100 dark:bg-blue-800 ml-1 px-1 rounded text-blue-800 dark:text-blue-200">{`{"type": "boolean", "required": false}`}</code>
                        </div>
                      </div>
                    </div>
                  )}

                  <Textarea
                    value={formData.field_schema}
                    onChange={(e) => handleSchemaChange(e.target.value)}
                    placeholder={`{
  "field_name": {
    "type": "string|number|boolean|select|textarea",
    "required": true|false,
    "description": "Field description",
    "options": ["option1", "option2"], // for select type
    "min": 1, // for number type
    "max": 100 // for number type
  }
}`}
                    required
                    rows={12}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${schemaError ? "border-red-500 dark:border-red-400" : ""}`}
                  />

                  {schemaError && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
                      <span className="font-medium">Schema Error:</span>{" "}
                      {schemaError}
                    </div>
                  )}

                  {!schemaError && formData.field_schema && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 border border-green-200 dark:border-green-800 rounded text-green-600 dark:text-green-400 text-sm">
                      ✓ Valid JSON schema
                    </div>
                  )}

                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                    Define the custom attributes for this product type.
                    Supported types: string, number, boolean, select, textarea
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" form="product-type-form">
            Create Product Type
          </Button>
          <Button type="button" variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="gap-4 grid">
        {productTypes.map((type) => (
          <div key={type.id} className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{type.name}</h3>
                <p className="mt-1 mb-2 text-gray-600 dark:text-gray-400">{type.description}</p>
                <div className="flex gap-4 text-gray-500 dark:text-gray-400 text-sm">
                  <span>
                    Created: {new Date(type.created_at).toLocaleDateString()}
                  </span>
                  <span>
                    Updated: {new Date(type.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => deleteProductType(type.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  className="ml-2"
                  onClick={() => openUpdateModal(type)}
                >
                  Update
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Field Schema:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="space-y-3">
                  {formatSchemaDisplay(type.field_schema).map(
                    (field, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-3 border-blue-500 dark:border-blue-400 border-l-4 rounded"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {field.label}
                            </span>
                            {field.required && (
                              <span className="font-medium text-red-500 dark:text-red-400 text-xs">
                                *required
                              </span>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              field.type
                            )}`}
                          >
                            {field.type}
                          </span>
                        </div>

                        {field.description && (
                          <p className="mb-2 text-gray-600 dark:text-gray-400 text-sm">
                            {field.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 text-gray-500 dark:text-gray-400 text-xs">
                          {field.options && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Options:</span>
                              <div className="flex gap-1">
                                {field.options.map(
                                  (option: string, optIndex: number) => (
                                    <span
                                      key={optIndex}
                                      className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300"
                                    >
                                      {option}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {(field.min !== undefined ||
                            field.max !== undefined) && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Range:</span>
                              <span>
                                {field.min || 0} - {field.max || "∞"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productTypes.length === 0 && (
        <div className="py-8 text-gray-500 dark:text-gray-400 text-center">
          No product types found. Create your first one!
        </div>
      )}

      <Modal isOpen={showUpdateForm} onClose={closeUpdateModal} size="xl">
        <Modal.Title>Update Product Type</Modal.Title>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit} id="update-product-type-form">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">Name</label>
                <Input
                  value={updateFormData.name}
                  onChange={e => setUpdateFormData({ ...updateFormData, name: e.target.value })}
                  placeholder="e.g., Gift Box, Gift Card"
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">Description</label>
                <Textarea
                  value={updateFormData.description}
                  onChange={e => setUpdateFormData({ ...updateFormData, description: e.target.value })}
                  placeholder="Describe this product type..."
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">Field Schema (JSON)</label>
                <Textarea
                  value={updateFormData.field_schema}
                  onChange={e => handleUpdateSchemaChange(e.target.value)}
                  required
                  rows={12}
                  className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${updateSchemaError ? 'border-red-500 dark:border-red-400' : ''}`}
                />
                {updateSchemaError && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
                    <span className="font-medium">Schema Error:</span> {updateSchemaError}
                  </div>
                )}
                {!updateSchemaError && updateFormData.field_schema && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 border border-green-200 dark:border-green-800 rounded text-green-600 dark:text-green-400 text-sm">
                    ✓ Valid JSON schema
                  </div>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" form="update-product-type-form">
            Update Product Type
          </Button>
          <Button type="button" variant="secondary" onClick={closeUpdateModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Product Types",
});

export default ProductTypesPage;
