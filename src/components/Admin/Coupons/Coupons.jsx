import React, { useEffect, useState } from "react";
import {
  Trash2,
  Tag,
  IndianRupee,
  Calendar,
  Users,
  Layers,
  FolderX,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { deleteCouponApi, FetchCouponsApi } from "@/APIs/Shopping/coupon";
import ConfirmationModal from "@/components/shared/confirmationModal";
import { toast } from "sonner";

export default function Component() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [relaod, setreload] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const handleAddCoupon = () => {
    navigate("/admin/addcoupon");
  };

  const handleRemoveCoupon = (id) => {
    setModalContent({
      title: "Remove Coupon",
      message: "Are you sure you want to Remove this Coupon?",
      onConfirm: async () => {
        try {
          console.log(id);

          const response = await deleteCouponApi(id);
          console.log("called");

          setreload(true);
          return toast.success(response.data.message);
        } catch (err) {
          if (err.response) {
            console.log(err);

            toast.error(err.response.data.message);
          }
        }
      },
    });
    setIsOpen(true);
  };

  async function fetchAllCoupons() {
    try {
      const response = await FetchCouponsApi();
      setCoupons(response.data.Coupons);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchAllCoupons();
    setreload(false);
  }, [relaod]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Coupons
          </h1>
          <button
            onClick={handleAddCoupon}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md flex items-center"
          >
            <Tag className="mr-2" size={18} />
            Add Coupon
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {coupons.length != 0 && coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="rounded-lg shadow-md p-6 relative hover:shadow-lg transition duration-300 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {coupon.code}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {coupon.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {coupon.is_active ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleRemoveCoupon(coupon._id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                    aria-label="Remove coupon"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Tag className="mr-2 text-blue-500" size={16} />
                  <span className="font-medium">Discount:</span>
                  <span className="ml-1">{coupon.discount_value}%</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="mr-2 text-green-500" size={16} />
                  <span className="font-medium">Min Purchase:</span>
                  <span className="ml-1">₹{coupon.min_purchase_amount}</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="mr-2 text-yellow-500" size={16} />
                  <span className="font-medium">Max Discount:</span>
                  <span className="ml-1">
                    ₹{coupon.max_discount_amount || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-purple-500" size={16} />
                  <span className="font-medium">Expires:</span>
                  <span className="ml-1">
                    {new Date(coupon.expiration_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 text-indigo-500" size={16} />
                  <span className="font-medium">Usage Limit:</span>
                  <span className="ml-1">
                    {coupon.usage_limit || "Unlimited"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {coupons.length == 0 &&<div className="flex items-center justify-center h-[50vh]">
      <div className="text-center">
        <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900">No Coupons added yet</h1>
      </div>
    </div>}
      </div>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
    </div>
  );
}