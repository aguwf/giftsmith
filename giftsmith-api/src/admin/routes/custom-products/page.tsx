import { defineRouteConfig } from "@medusajs/admin-sdk";
import { useState, useEffect } from "react";
import { Button } from "@medusajs/ui";
import CustomProductForm from "../../components/CustomProductForm";
import Modal from "../../components/common/Modal";

interface ProductType {
  id: string;
  name: string;
  description: string;
  field_schema: Record<string, any>;
}

interface CustomProduct {
  id: string;
  product_id: string;
  product_type_id: string;
  custom_attributes: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product?: {
    title: string;
    handle: string;
  };
  product_type?: ProductType;
}

const CustomProductsPage = () => {
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    product_id: "",
    product_type_id: "",
    custom_attributes: {} as Record<string, any>,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, typesResponse] = await Promise.all([
        fetch("/admin/custom-products"),
        fetch("/admin/product-types"),
      ]);

      const productsData = await productsResponse.json();
      const typesData = await typesResponse.json();

      setCustomProducts(
        productsData.products || productsData.custom_products || []
      );
      setProductTypes(typesData.product_types || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductTypeChange = (productTypeId: string) => {
    const selectedType = productTypes.find((type) => type.id === productTypeId);
    if (selectedType) {
      const initialAttributes: Record<string, any> = {};
      Object.keys(selectedType.field_schema).forEach((key) => {
        initialAttributes[key] = "";
      });

      setFormData({
        ...formData,
        product_type_id: productTypeId,
        custom_attributes: initialAttributes,
      });
    }
  };

  const handleAttributeChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      custom_attributes: {
        ...formData.custom_attributes,
        [key]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const response = await fetch(`/admin/custom-products/${formData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setFormData({
            id: "",
            product_id: "",
            product_type_id: "",
            custom_attributes: {},
          });
        }
        setShowModal(false);
        fetchData();
      } else {
        const response = await fetch("/admin/custom-products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setFormData({
            id: "",
            product_id: "",
            product_type_id: "",
            custom_attributes: {},
          });
          setShowModal(false);
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error creating custom product:", error);
    }
  };

  const deleteCustomProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this custom product?")) {
      try {
        await fetch(`/admin/custom-products/${id}`, {
          method: "DELETE",
        });
        fetchData();
      } catch (error) {
        console.error("Error deleting custom product:", error);
      }
    }
  };

  const editCustomProduct = async (id: string) => {
    try {
      const product = customProducts.find((product) => product.id === id);
      if (product) {
        setFormData(product);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error editing custom product:", error);
    }
  };

  const openCreateModal = () => {
    setFormData({
      id: "",
      product_id: "",
      product_type_id: "",
      custom_attributes: {},
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      id: "",
      product_id: "",
      product_type_id: "",
      custom_attributes: {},
    });
  };

  const formatAttributeValue = (key: string, value: any) => {
    if (typeof value === "boolean") {
      return value ? "✅ Yes" : "❌ No";
    }
    if (typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
    }
    return value;
  };

  if (loading) {
    return <div className="p-6 text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-2xl">Custom Products</h1>
        <Button onClick={openCreateModal}>Create</Button>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={closeModal} size="lg">
        <Modal.Title>
          {formData.id ? "Edit Custom Product" : "Create New Custom Product"}
        </Modal.Title>
        <Modal.Body>
          <CustomProductForm
            formData={formData}
            productTypes={productTypes}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            onProductTypeChange={handleProductTypeChange}
            onAttributeChange={handleAttributeChange}
            onFormDataChange={setFormData}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {formData.id ? "Save" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="gap-4 grid">
        {customProducts.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    Product : {product.product_id}
                  </h3>
                  {product.deleted_at && (
                    <span className="bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full text-red-800 dark:text-red-200 text-xs">
                      Deleted
                    </span>
                  )}
                </div>
                <p className="mb-2 text-gray-600 dark:text-gray-400">
                  Type ID: {product.product_type_id}
                </p>
                <div className="flex gap-4 text-gray-500 dark:text-gray-400 text-sm">
                  <span>
                    Created: {new Date(product.created_at).toLocaleDateString()}
                  </span>
                  <span>
                    Updated: {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button
                className="mr-2"
                variant="secondary"
                size="small"
                onClick={() => editCustomProduct(product.id)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => deleteCustomProduct(product.id)}
                disabled={!!product.deleted_at}
              >
                Delete
              </Button>
            </div>

            <div className="mt-4">
              <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100 text-sm">Custom Attributes:</h4>
              <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
                {Object.entries(product.custom_attributes).map(
                  ([key, value]) => (
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
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {customProducts.length === 0 && (
        <div className="py-8 text-gray-500 dark:text-gray-400 text-center">
          No custom products found. Create your first one!
        </div>
      )}
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Custom Products",
});

export default CustomProductsPage;
