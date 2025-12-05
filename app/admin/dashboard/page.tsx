"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_API_ROUTES } from "@/src/features/admin/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/common/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminRegisterSchema,
  AdminUpdateSchema,
} from "@/src/features/admin/schema/admin.schema";
import { IAdmin, IAdminRegisterTypes, IAdminUpdateForm } from "@/src/features/admin/types/admin.types";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminDashboard() {
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<IAdmin | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<IAdminRegisterTypes>({
    resolver: zodResolver(AdminRegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      phone_number: "",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
  } = useForm<IAdminUpdateForm>({
    resolver: zodResolver(AdminUpdateSchema),
  });

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ADMIN_API_ROUTES.REGISTER);
      setAdmins(response.data.admins || []);
      setError("");
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch admins");
      console.error("Fetch admins error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Create admin
  const onCreateSubmit: SubmitHandler<IAdminRegisterTypes> = async (data) => {
    try {
      setError("");
      setSuccess("");
      const response = await axios.post(ADMIN_API_ROUTES.REGISTER, data);
      setSuccess(response.data.message || "Admin created successfully");
      resetCreate();
      setShowCreateModal(false);
      await fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to create admin");
      console.error("Create admin error:", error);
    }
  };

  // Update admin
  const onUpdateSubmit: SubmitHandler<IAdminUpdateForm> = async (data) => {
    if (!selectedAdmin) return;

    try {
      setError("");
      setSuccess("");
      const updateData: IAdminUpdateForm = {};
      if (data.username) updateData.username = data.username;
      if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
      if (data.password) updateData.password = data.password;

      const response = await axios.patch(
        ADMIN_API_ROUTES.UPDATE(selectedAdmin.id),
        updateData
      );
      setSuccess(response.data.message || "Admin updated successfully");
      resetUpdate();
      setShowEditModal(false);
      setSelectedAdmin(null);
      await fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to update admin");
      console.error("Update admin error:", error);
    }
  };

  // Delete admin
  const handleDelete = async () => {
    if (!selectedAdmin) return;

    try {
      setError("");
      setSuccess("");
      await axios.delete(ADMIN_API_ROUTES.DELETE(selectedAdmin.id));
      setSuccess("Admin deleted successfully");
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      await fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to delete admin");
      console.error("Delete admin error:", error);
    }
  };

  const openEditModal = (admin: IAdmin) => {
    setSelectedAdmin(admin);
    resetUpdate({
      username: admin.username,
      phoneNumber: admin.phoneNumber,
      password: "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (admin: IAdmin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Button
            onClick={() => {
              setShowCreateModal(true);
              setError("");
              setSuccess("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Admin
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
            <CardTitle className="text-white">All Admins</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : admins.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No admins found
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
                        Username
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
                    {admins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-300">{admin.id}</td>
                        <td className="py-3 px-4 text-gray-300">
                          {admin.username}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {admin.phoneNumber}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openEditModal(admin)}
                              variant="ghost"
                              size="icon-sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteModal(admin)}
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
              <CardTitle className="text-white">Create New Admin</CardTitle>
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
                  label="Username"
                  name="username"
                />
                <CustomInput
                  errors={errorsCreate}
                  register={registerCreate}
                  type="text"
                  name="phone_number"
                  label="Phone Number"
                  placeholder="+998XXXXXXXXX"
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
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Edit Admin</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAdmin(null);
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
                  label="Username"
                  name="username"
                />
                <CustomInput
                  errors={errorsUpdate}
                  register={registerUpdate}
                  type="text"
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="+998XXXXXXXXX"
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
                      setSelectedAdmin(null);
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
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Delete Admin</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAdmin(null);
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete admin{" "}
                <strong>{selectedAdmin.username}</strong>? This action cannot be
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
                    setSelectedAdmin(null);
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
