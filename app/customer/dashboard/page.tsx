"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CUSTOMER_API_ROUTES } from "@/src/features/customer/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/common/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomerRegisterSchema,
  CustomerUpdateSchema,
} from "@/src/features/customer/schema/customer.schema";
import {
  ICustomer,
  ICustomerRegisterTypes,
  ICustomerUpdateForm,
} from "@/src/features/customer/types/customer.types";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<ICustomerRegisterTypes>({
    resolver: zodResolver(CustomerRegisterSchema),
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
  } = useForm<ICustomerUpdateForm>({
    resolver: zodResolver(CustomerUpdateSchema),
  });

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CUSTOMER_API_ROUTES.REGISTER);
      setCustomers(response.data.customers || []);
      setError("");
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to fetch customers"
      );
      console.error("Fetch customers error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Create customer
  const onCreateSubmit: SubmitHandler<ICustomerRegisterTypes> = async (
    data
  ) => {
    try {
      setError("");
      setSuccess("");
      const response = await axios.post(CUSTOMER_API_ROUTES.REGISTER, data);
      setSuccess(response.data.message || "Customer created successfully");
      resetCreate();
      setShowCreateModal(false);
      await fetchCustomers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to create customer"
      );
      console.error("Create customer error:", error);
    }
  };

  // Update customer
  const onUpdateSubmit: SubmitHandler<ICustomerUpdateForm> = async (data) => {
    if (!selectedCustomer) return;

    try {
      setError("");
      setSuccess("");
      const updateData: ICustomerUpdateForm = {};
      if (data.email) updateData.email = data.email;
      if (data.name) updateData.name = data.name;
      if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
      if (data.password) updateData.password = data.password;

      const response = await axios.patch(
        CUSTOMER_API_ROUTES.UPDATE(selectedCustomer.id),
        updateData
      );
      setSuccess(response.data.message || "Customer updated successfully");
      resetUpdate();
      setShowEditModal(false);
      setSelectedCustomer(null);
      await fetchCustomers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to update customer"
      );
      console.error("Update customer error:", error);
    }
  };

  // Delete customer
  const handleDelete = async () => {
    if (!selectedCustomer) return;

    try {
      setError("");
      setSuccess("");
      await axios.delete(CUSTOMER_API_ROUTES.DELETE(selectedCustomer.id));
      setSuccess("Customer deleted successfully");
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      await fetchCustomers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to delete customer"
      );
      console.error("Delete customer error:", error);
    }
  };

  const openEditModal = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    resetUpdate({
      email: customer.email,
      name: customer.name,
      phoneNumber: customer.phoneNumber.toString(),
      password: "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Customer Dashboard</h1>
          <Button
            onClick={() => {
              setShowCreateModal(true);
              setError("");
              setSuccess("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
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
            <CardTitle className="text-white">All Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No customers found
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
                    {customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-300">
                          {customer.id}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {customer.email}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {customer.name}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {customer.phoneNumber}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openEditModal(customer)}
                              variant="ghost"
                              size="icon-sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteModal(customer)}
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
              <CardTitle className="text-white">Create New Customer</CardTitle>
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
                  placeholder="customer@example.com"
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
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Edit Customer</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCustomer(null);
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
                  placeholder="customer@example.com"
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
                      setSelectedCustomer(null);
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
      {showDeleteModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Delete Customer</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCustomer(null);
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete customer{" "}
                <strong>{selectedCustomer.name}</strong> (
                {selectedCustomer.email})? This action cannot be undone.
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
                    setSelectedCustomer(null);
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

