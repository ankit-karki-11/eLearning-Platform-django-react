import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCompleteKhaltiPaymentMutation, useVerifyKhaltiPaymentMutation } from '@/features/api/paymentApi';

const PaymentSuccess = () => {
  const [completePayment] = useCompleteKhaltiPaymentMutation()
  const [verifyPayment] = useVerifyKhaltiPaymentMutation()
  const [searchParams] = useSearchParams();
  const pidx = searchParams.get("pidx");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    // If there's no pidx in the URL, mark payment as failed immediately
    if (!pidx) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      try {
        // .unwrap() makes sure we get the real response (not just the RTK action)
        await verifyPayment({ pidx }).unwrap();
        setStatus("success");
      } catch (error) {
        setStatus("failed");
      }
    };
    // Call the async verify function
    verify();
  }, [pidx, verifyPayment]);


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
