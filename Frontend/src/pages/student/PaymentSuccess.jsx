import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const pidx = searchParams.get("pidx");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!pidx) {
      setStatus("failed");
      return;
    }

    // Call your backend to complete/verify the payment
    axios.patch('/api/checkout/complete_payment/', {
      pidx
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(() => {
      setStatus("success");
    }).catch(() => {
      setStatus("failed");
    });
  }, [pidx]);

  return (
    <div className="text-center mt-32">
      {status === "verifying" && (
        <h1 className="text-xl text-gray-500">Verifying your payment...</h1>
      )}
      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold text-green-600">Payment Successful</h1>
          <p className="mt-2 text-gray-600">Thank you for your purchase!</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
          <p className="mt-2 text-gray-600">Something went wrong while verifying your payment.</p>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
