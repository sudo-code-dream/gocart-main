import { PlusIcon, SquarePenIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddressModal from "./AddressModal";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Show, useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { fetchCart } from "@/lib/features/cart/cartSlice";

const OrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const addressList = useSelector((state) => state.address.list);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);

  const handleCouponCode = async (event) => {
    event.preventDefault();

    try {
      if (!user) {
        return toast.error("Please login to continue");
      }

      const token = await getToken();
      const { data } = await axios.post(
        "/api/coupon",
        { code: couponCodeInput },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCoupon(data.coupon);
      toast.success("Coupon Applied");
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        return toast.error("Please login to continue");
      }
      if (!selectedAddress) {
        return toast.error("Please Select an address ");
      }

      const token = await getToken();
      const orderData = {
        addressId: selectedAddress.id,
        items,
        paymentMethod,
      };

      if (coupon) {
        orderData.coupon = coupon.code;
      }

      const { data } = await axios.post("/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.paymentType === "QRPH") {
        setQrImage(data.qrImage);

        // save first order id for payment checking
        localStorage.setItem("pendingOrderId", data.orderIds[0]);

        return;
      }

      if (paymentMethod === "STRIPE") {
        window.location.href = data.session.url;
      } else {
        toast.success(data.message);
        router.push("/orders");
        dispatch(fetchCart({ getToken }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    }
  };

  useEffect(() => {
    const orderId = localStorage.getItem("pendingOrderId");

    if (!orderId || !qrImage) return;

    setCheckingPayment(true);

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(
          `/api/paymongo/check?orderId=${orderId}`,
        );

        if (data.isPaid) {
          clearInterval(interval);

          localStorage.removeItem("pendingOrderId");

          toast.success("Payment Successful!");

          dispatch(fetchCart({ getToken }));

          router.push("/orders");
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [qrImage]);

  return (
    <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
      <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
      <p className='text-slate-400 text-xs my-4'>Payment Method</p>
      <div className='flex gap-2 items-center'>
        <input
          type='radio'
          id='COD'
          onChange={() => setPaymentMethod("COD")}
          checked={paymentMethod === "COD"}
          className='accent-gray-500'
        />
        <label htmlFor='COD' className='cursor-pointer'>
          COD
        </label>
      </div>
      <div className='flex gap-2 items-center mt-1'>
        <input
          type='radio'
          id='STRIPE'
          name='payment'
          onChange={() => setPaymentMethod("STRIPE")}
          checked={paymentMethod === "STRIPE"}
          className='accent-gray-500'
        />
        <label htmlFor='STRIPE' className='cursor-pointer'>
          Stripe Payment
        </label>
        <div className='flex gap-2 items-center mt-1'>
          <input
            type='radio'
            id='QRPH'
            name='payment'
            onChange={() => setPaymentMethod("QRPH")}
            checked={paymentMethod === "QRPH"}
          />
          <label htmlFor='QRPH'>QRPH (GCash / Maya)</label>
        </div>
      </div>
      <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
        <p>Address</p>
        {selectedAddress ? (
          <div className='flex gap-2 items-center'>
            <p>
              {selectedAddress.name}, {selectedAddress.city},{" "}
              {selectedAddress.state}, {selectedAddress.zip}
            </p>
            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className='cursor-pointer'
              size={18}
            />
          </div>
        ) : (
          <div>
            {addressList.length > 0 && (
              <select
                className='border border-slate-400 p-2 w-full my-3 outline-none rounded'
                onChange={(e) =>
                  setSelectedAddress(addressList[e.target.value])
                }>
                <option value=''>Select Address</option>
                {addressList.map((address, index) => (
                  <option key={index} value={index}>
                    {address.name}, {address.city}, {address.state},{" "}
                    {address.zip}
                  </option>
                ))}
              </select>
            )}
            <button
              className='flex items-center gap-1 text-slate-600 mt-1'
              onClick={() => setShowAddressModal(true)}>
              Add Address <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>
      <div className='pb-4 border-b border-slate-200'>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-1 text-slate-400'>
            <p>Subtotal:</p>
            <p>Shipping:</p>
            {coupon && <p>Coupon:</p>}
          </div>
          <div className='flex flex-col gap-1 font-medium text-right'>
            <p>
              {currency}
              {totalPrice.toLocaleString()}
            </p>
            <p>
              <Show when={{ plan: "plus" }} fallback={`${currency}5`}>
                Free
              </Show>
            </p>
            {coupon && (
              <p>{`-${currency}${((coupon.discount / 100) * totalPrice).toFixed(2)}`}</p>
            )}
          </div>
        </div>
        {!coupon ? (
          <form
            onSubmit={(e) =>
              toast.promise(handleCouponCode(e), {
                loading: "Checking Coupon...",
              })
            }
            className='flex justify-center gap-3 mt-3'>
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type='text'
              placeholder='Coupon Code'
              className='border border-slate-400 p-1.5 rounded w-full outline-none'
            />
            <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>
              Apply
            </button>
          </form>
        ) : (
          <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
            <p>
              Code:{" "}
              <span className='font-semibold ml-1'>
                {coupon.code.toUpperCase()}
              </span>
            </p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={() => setCoupon("")}
              className='hover:text-red-700 transition cursor-pointer'
            />
          </div>
        )}
      </div>
      <div className='flex justify-between py-4'>
        <p>Total:</p>
        <p className='font-medium text-right'>
          <Show
            when={{ plan: "plus" }}
            fallback={`${currency}
            ${
              coupon
                ? (
                    totalPrice +
                    5 -
                    (coupon.discount / 100) * totalPrice
                  ).toFixed(2)
                : (totalPrice + 5).toLocaleString()
            }`}>
            {currency}
            {coupon
              ? (totalPrice - (coupon.discount / 100) * totalPrice).toFixed(2)
              : totalPrice.toLocaleString()}
          </Show>
        </p>
      </div>
      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), { loading: "placing Order..." })
        }
        className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>
        Place Order
      </button>

      {qrImage && (
        <div className='mt-4 text-center'>
          <h3 className='font-semibold mb-2'>Scan to Pay</h3>

          <img src={qrImage} alt='QRPH Payment' className='mx-auto max-w-xs' />

          <p className='mt-2 text-sm text-slate-500'>
            Complete payment using GCash or Maya
          </p>
        </div>
      )}

      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  );
};

export default OrderSummary;
