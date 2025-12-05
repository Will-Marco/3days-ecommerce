"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { SELLER_API_ROUTES } from "@/src/features/seller/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/common/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SellerRegisterSchema,
  SellerUpdateSchema,
} from "@/src/features/seller/schema/seller.schema";
import {
  ISeller,
  ISellerRegisterTypes,
  ISellerUpdateForm,
} from "@/src/features/seller/types/seller.types";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function SellerDashboard() {
  const [sellers, setSellers] = useState<ISeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<ISeller | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<ISellerRegisterTypes>({
    resolver: zodResolver(SellerRegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
  } = useForm<ISellerUpdateForm>({
    resolver: zodResolver(SellerUpdateSchema),
  });

  // Fetch all sellers
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(SELLER_API_ROUTES.REGISTER);
      setSellers(response.data.sellers || []);
      setError("");
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch sellers");
      console.error("Fetch sellers error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Create seller
  const onCreateSubmit: SubmitHandler<ISellerRegisterTypes> = async (data) => {
    try {
      setError("");
      setSuccess("");
      const response = await axios.post(SELLER_API_ROUTES.REGISTER, data);
      setSuccess(response.data.message || "Seller created successfully");
      resetCreate();
      setShowCreateModal(false);
      await fetchSellers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to create seller");
      console.error("Create seller error:", error);
    }
  };

  // Update seller
  const onUpdateSubmit: SubmitHandler<ISellerUpdateForm> = async (data) => {
    if (!selectedSeller) return;

    try {
      setError("");
      setSuccess("");
      const updateData: ISellerUpdateForm = {};
      if (data.email) updateData.email = data.email;
      if (data.name) updateData.name = data.name;
      if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
      if (data.password) updateData.password = data.password;

      const response = await axios.patch(
        SELLER_API_ROUTES.UPDATE(selectedSeller.id),
        updateData
      );
      setSuccess(response.data.message || "Seller updated successfully");
      resetUpdate();
      setShowEditModal(false);
      setSelectedSeller(null);
      await fetchSellers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to update seller");
      console.error("Update seller error:", error);
    }
  };

  // Delete seller
  const handleDelete = async () => {
    if (!selectedSeller) return;

    try {
      setError("");
      setSuccess("");
      await axios.delete(SELLER_API_ROUTES.DELETE(selectedSeller.id));
      setSuccess("Seller deleted successfully");
      setShowDeleteModal(false);
      setSelectedSeller(null);
      await fetchSellers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to delete seller");
      console.error("Delete seller error:", error);
    }
  };

  const openEditModal = (seller: ISeller) => {
    setSelectedSeller(seller);
    resetUpdate({
      email: seller.email,
      name: seller.name,
      phoneNumber: seller.phoneNumber.toString(),
      password: "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (seller: ISeller) => {
    setSelectedSeller(seller);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
          <Button
            onClick={() => {
              setShowCreateModal(true);
              setError("");
              setSuccess("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Seller
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
            <CardTitle className="text-white">All Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : sellers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No sellers found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Phone Number
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Created At
                      </th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((seller) => (
                      <tr
                        key={seller.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-300">{seller.id}</td>
                        <td className="py-3 px-4 text-gray-300">
                          {seller.email}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {seller.name}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {seller.phoneNumber}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openEditModal(seller)}
                              variant="ghost"
                              size="icon-sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteModal(seller)}
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
          <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Create New Seller</CardTitle>
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
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="seller@example.com"
                />
                <CustomInput
                  errors={errorsCreate}
                  register={registerCreate}
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="John Doe"
                />
                <CustomInput
                  errors={errorsCreate}
                  register={registerCreate}
                  type="text"
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="998901234567"
                />
                <CustomInput
                  errors={errorsCreate}
                  register={registerCreate}
                  type="password"
                  name="password"
                  label="Password"
                />
                <CustomInput
                  errors={errorsCreate}
                  register={registerCreate}
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
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
      {showEditModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Edit Seller</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSeller(null);
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
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="seller@example.com"
                />
                <CustomInput
                  errors={errorsUpdate}
                  register={registerUpdate}
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="John Doe"
                />
                <CustomInput
                  errors={errorsUpdate}
                  register={registerUpdate}
                  type="text"
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="998901234567"
                />
                <CustomInput
                  errors={errorsUpdate}
                  register={registerUpdate}
                  type="password"
                  name="password"
                  label="New Password (optional)"
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
                      setSelectedSeller(null);
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
      {showDeleteModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Delete Seller</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSeller(null);
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete seller{" "}
                <strong>{selectedSeller.name}</strong> ({selectedSeller.email})?
                This action cannot be undone.
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
                    setSelectedSeller(null);
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
