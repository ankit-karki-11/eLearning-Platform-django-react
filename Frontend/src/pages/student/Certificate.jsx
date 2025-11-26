import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetMyCertificatesQuery,
  useGenerateCertificateMutation,
} from "@/features/api/certificateApi";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import { Download } from "lucide-react";

const Certificate = () => {
  const { slug } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasTriedGenerating, setHasTriedGenerating] = useState(false);
  const { width, height } = useWindowSize();

  const {
    data: certificates,
    isLoading: loadingCertificates,
    isError: errorFetchingCertificates,
    refetch: refetchCertificates,
  } = useGetMyCertificatesQuery();

  const [
    generateCertificate,
    {
      isLoading: generating,
      isError: errorGenerating,
      error: generateError,
    },
  ] = useGenerateCertificateMutation();

  useEffect(() => {
    if (certificates && slug) {
      const certForCourse = certificates.find((cert) => cert.course_slug === slug);
      if (certForCourse) {
        setCertificate(certForCourse);
        setShowConfetti(true);
      } else if (!hasTriedGenerating) {
        // Only try to generate once
        setHasTriedGenerating(true);
        generateCertificate(slug)
          .unwrap()
          .then((res) => {
            setCertificate(res);
            setShowConfetti(true);
          })
          .catch((err) => {
            console.error("Certificate generation error:", err);
            if (err?.data?.error?.includes("already exists")) {
              // If certificate already exists, refetch to get it
              refetchCertificates().then(({ data }) => {
                const cert = data?.find((c) => c.course_slug === slug);
                if (cert) {
                  setCertificate(cert);
                } else {
                  setErrorMessage("Certificate exists but could not be loaded");
                }
              });
            } else {
              setErrorMessage(err?.data?.error || "Failed to generate certificate");
            }
          });
      }
    }
  }, [certificates, slug, generateCertificate, refetchCertificates, hasTriedGenerating]);

  // Show loading state
  if (loadingCertificates || generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-8 border-gray-300 border-t-green-500 rounded-full animate-spin" />
        <span className="text-lg font-medium text-gray-600">
          {loadingCertificates ? "Loading certificates..." : "Generating certificate..."}
        </span>
      </div>
    );
  }

  // Show error state
  if (errorFetchingCertificates || errorGenerating) {
    return (
      <div className="max-w-md mt-12 p-6 mx-auto my-10 text-center bg-red-50 rounded-lg">
        <h3 className="mb-2 text-xl font-semibold text-red-600">
          {errorFetchingCertificates ? "Error fetching certificates" : "Certificate Error"}
        </h3>
        <p className="mb-4 text-gray-700">
          {errorMessage || generateError?.data?.error || "Please try again later."}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setErrorMessage(null);
            errorFetchingCertificates ? refetchCertificates() : generateCertificate(slug);
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Show no certificate found state
  if (!certificate && hasTriedGenerating) {
    return (
      <div className="max-w-md p-6 mx-auto my-10 text-center bg-yellow-50 rounded-lg">
        <h3 className="mb-4 text-xl font-semibold text-yellow-700">
          No certificate found for this course
        </h3>
        <p className="mb-4 text-gray-700">
          You may not have completed the course requirements yet.
        </p>
        <Button onClick={() => {
          setHasTriedGenerating(false);
          generateCertificate(slug);
        }}>
          Try to Generate Certificate
        </Button>
      </div>
    );
  }

  // Show certificate
  return (
    <div className="relative mt-4 max-w-6xl px-4 mx-auto py-12 bg-white">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          recycle={false}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <div className="flex flex-col items-center space-y-8">
        {certificate?.certificate_file ? (
          <>
          
            <div className="p-4 bg-white rounded-lg">
              <Button
              onClick={async () => {
                const res = await fetch(certificate.download_url);
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `certificate_${certificate.certificate_id}.png`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              }}
            >
              <Download></Download>
              Download
            </Button>
              <img
                src={certificate.certificate_file}
                alt={`Certificate for completing ${certificate.course_slug}`}
                className="w-full max-w-2xl mx-auto mt-2"
              />
            </div>
            
          </>
        ) : (
          <div className="p-6 text-center bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">
              Certificate Generated but File Not Ready
            </h3>
            <p className="text-gray-700">
              {/* Your certificate ID is {certificate.certificate_id}, but the file is still processing. */}
              Please try again in a few moments.
            </p>
            <Button
              className="mt-4"
              onClick={() => refetchCertificates()}
            >
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificate;