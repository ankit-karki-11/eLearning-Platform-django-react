import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useVerifyKhaltiPaymentMutation } from "@/features/api/paymentApi";
import { Button } from "@/components/ui/button";
import { Ticket, TicketIcon, Verified } from "lucide-react";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const allPidx = searchParams.getAll("pidx");
    const validPidx = allPidx.find((id) => id.length > 10);

    const [verifyPayment] = useVerifyKhaltiPaymentMutation();

    useEffect(() => {
        if (validPidx) {
            setIsLoading(true);
            verifyPayment({ pidx: validPidx })
                .unwrap()
                .then(() => {
                    setIsVerified(true);
                    toast.success("Payment verified successfully!");

                    // Cleaning URL after success
                    const cleanParams = new URLSearchParams();
                    cleanParams.set("pidx", validPidx);
                    navigate({
                        pathname: "/payment-success",
                        search: `?${cleanParams.toString()}`
                    }, { replace: true });
                })
                .catch((err) => {
                    console.error("Verification error:", err);
                    toast.error(err.data?.detail || "Payment verification failed");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [validPidx]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-lg">Verifying your payment...</p>
            </div>
        );
    }

    if (!isVerified) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Payment Verification Failed</h1>
                    <p className="mb-6">We couldn't verify your payment. Please check your purchase history or contact support.</p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate("/courses")}>
                            Browse Courses
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/support")}>
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center max-w-md p-6">
                <div className="mb-4 mx-auto flex items-center justify-center ">
                    <Verified className="w-16 h-16 text-green-500 mb-4" />
                </div>

                <h1 className="text-2xl font-bold text-green-600 mb-4 uppercase">Payment Successful!</h1>
                <p className="mb-6">Your payment for the course has been completed successfully. You can now access the course materials and start learning.</p>

                <div className="flex flex-col gap-3">
                    <Button onClick={() => navigate("/my-learning")}>
                        Go to My Learning
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default PaymentSuccess;