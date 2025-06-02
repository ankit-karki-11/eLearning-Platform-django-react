import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {useVerifyKhaltiPaymentMutation } from '@/features/api/paymentApi';
const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const pidx = searchParams.get("pidx"); 

    const [verifyPayment] = useVerifyKhaltiPaymentMutation();

    useEffect(() => {
        if (pidx) {
            verifyPayment({ pidx })
                .unwrap()
                .then(() => toast.success("Payment verified!"))
                .catch((err) => {
                    console.error("Verification error:", err);
                  toast.error(err.data?.detail || "Verification failed");
                });
        }
    }, [pidx]);

    return <div>Processing payment...</div>;
};

export default PaymentSuccess;