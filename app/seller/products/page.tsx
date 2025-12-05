"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCT_API_ROUTES } from "@/src/features/product/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/common/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductCreateSchema,
  ProductUpdateSchema,
} from "@/src/features/product/schema/product.schema";
import {
  IProduct,
  IProductCreateTypes,
  IProductUpdateTypes,
} from "@/src/features/product/types/product.types";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useSellerAuth } from "@/src/contexts/SellerAuthContext";

export default function SellerProducts() {
  const { seller } = useSellerAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
    setValue: setValueCreate,
  } = useForm<IProductCreateTypes>({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      imageUrl: "",
      category: "",
      sellerId: seller?.id || "",
    },
  });

  // Update sellerId when seller changes
  useEffect(() => {
    if (seller?.id) {
      setValueCreate("sellerId", seller.id);
    }
  }, [seller?.id, setValueCreate]);

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
  } = useForm<IProductUpdateTypes>({
    resolver: zodResolver(ProductUpdateSchema),
  });

  // Fetch seller's products
  const fetchProducts = async () => {
    if (!seller?.id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        PRODUCT_API_ROUTES.BY_SELLER(seller.id)
      );
      setProducts(response.data.products || []);
      setError("");
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to fetch products"
      );
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seller?.id) {
      fetchProducts();
    }
  }, [seller?.id]);

  // Create product
  const onCreateSubmit: SubmitHandler<IProductCreateTypes> = async (data) => {
    if (!seller?.id) {
      setError("Seller not authenticated");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const productData = {
        ...data,
        price: typeof data.price === "string" ? parseFloat(data.price) : data.price,
        quantity: typeof data.quantity === "string" ? parseInt(data.quantity, 10) : data.quantity,
        sellerId: seller.id,
      };
      const response = await axios.post(
        PRODUCT_API_ROUTES.BASE,
        productData
      );
      setSuccess(response.data.message || "Product created successfully");
      resetCreate();
      setShowCreateModal(false);
      await fetchProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to create product"
      );
      console.error("Create product error:", error);
    }
  };

  // Update product
  const onUpdateSubmit: SubmitHandler<IProductUpdateTypes> = async (data) => {
    if (!selectedProduct) return;

    try {
      setError("");
      setSuccess("");
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.imageUrl) updateData.imageUrl = data.imageUrl;
      if (data.category) updateData.category = data.category;
      if (data.price !== undefined) {
        updateData.price =
          typeof data.price === "string"
            ? parseFloat(data.price)
            : data.price;
      }
      if (data.quantity !== undefined) {
        updateData.quantity =
          typeof data.quantity === "string"
            ? parseInt(data.quantity, 10)
            : data.quantity;
      }

      const response = await axios.patch(
        PRODUCT_API_ROUTES.BY_ID(selectedProduct.id),
        updateData
      );
      setSuccess(response.data.message || "Product updated successfully");
      resetUpdate();
      setShowEditModal(false);
      setSelectedProduct(null);
      await fetchProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to update product"
      );
      console.error("Update product error:", error);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setError("");
      setSuccess("");
      await axios.delete(PRODUCT_API_ROUTES.BY_ID(selectedProduct.id));
      setSuccess("Product deleted successfully");
      setShowDeleteModal(false);
      setSelectedProduct(null);
      await fetchProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to delete product"
      );
      console.error("Delete product error:", error);
    }
  };

  const openEditModal = (product: IProduct) => {
    setSelectedProduct(product);
    resetUpdate({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product: IProduct) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Products</h1>
          <Button
            onClick={() => {
              setShowCreateModal(true);
              setError("");
              setSuccess("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
            {success}
          </div>
        )}

        <Card className="bg-[#1E1E1E] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No products found. Create your first product!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Image
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/64";
                            }}
                          />
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {product.category}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {product.quantity}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openEditModal(product)}
                              variant="ghost"
                              size="icon-sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteModal(product)}
                              variant="ghost"
                              size="icon-sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-[#1E1E1E] border-gray-700 max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-[#1E1E1E] z-10">
              <CardTitle className="text-white">Create New Product</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreate();
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmitCreate(onCreateSubmit)}
                className="flex flex-col space-y-4"
              >
                <CustomInput
                  errors={errorsCreate}
                  register={registerCreate}
                  type="text"
                  label="Product Name"
                  name="name"
                  placeholder="Enter product name"
                />
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Description
                  </label>
                  {errorsCreate.description && (
                    <span className="text-sm text-red-600 mb-1 block">
                      {errorsCreate.description.message}
                    </span>
                  )}
                  <textarea
                    {...registerCreate("description")}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-300">
                    Price
                  </span>
                  <CustomInput
                    errors={errorsCreate}
                    register={registerCreate}
                    type="number"
                    label="Price"
                    name="price"
                    placeholder="0.00"
                  />
                  <span className="text-gray-300">Quantity</span>
                  <CustomInput
                    errors={errorsCreate}
                    register={registerCreate}
                    type="number"
                    label="Quantity"
                    name="quantity"
                    placeholder="0"
                  />
                </div>
                <CustomInput
                  errors={errorsCreate}
                  register={registerCreate}
                  type="text"
                  label="Image URL"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                />
                <CustomInput
                  errors={errorsCreate}
                  register={registerCreate}
                  type="text"
                  label="Category"
                  name="category"
                  placeholder="Electronics, Clothing, etc."
                />
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetCreate();
                      setError("");
                    }}
                    className="flex-1 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-[#1E1E1E] border-gray-700 max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-[#1E1E1E] z-10">
              <CardTitle className="text-white">Edit Product</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                  resetUpdate();
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmitUpdate(onUpdateSubmit)}
                className="flex flex-col space-y-4"
              >
                <CustomInput
                  errors={errorsUpdate}
                  register={registerUpdate}
                  type="text"
                  label="Product Name"
                  name="name"
                  placeholder="Enter product name"
                />
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Description
                  </label>
                  {errorsUpdate.description && (
                    <span className="text-sm text-red-600 mb-1 block">
                      {errorsUpdate.description.message}
                    </span>
                  )}
                  <textarea
                    {...registerUpdate("description")}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    errors={errorsUpdate}
                    register={registerUpdate}
                    type="text"
                    label="Price"
                    name="price"
                    placeholder="0.00"
                  />
                  <CustomInput
                    errors={errorsUpdate}
                    register={registerUpdate}
                    type="text"
                    label="Quantity"
                    name="quantity"
                    placeholder="0"
                  />
                </div>
                <CustomInput
                  errors={errorsUpdate}
                  register={registerUpdate}
                  type="text"
                  label="Image URL"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                />
                <CustomInput
                  errors={errorsUpdate}
                  register={registerUpdate}
                  type="text"
                  label="Category"
                  name="category"
                  placeholder="Electronics, Clothing, etc."
                />
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Update
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedProduct(null);
                      resetUpdate();
                      setError("");
                    }}
                    className="flex-1 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Delete Product</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete product{" "}
                <strong>{selectedProduct.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex-1"
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                    setError("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

