import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetMyCertificatesQuery,
  useGenerateCertificateMutation,
} from "@/features/api/certificateApi";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

const Certificate = () => {
  const { slug } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
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
    if (certificates) {
      const certForCourse = certificates.find((cert) => cert.course_slug === slug);
      if (certForCourse) {
        setCertificate(certForCourse);
        setShowConfetti(true);
      } else {
        generateCertificate(slug)
          .unwrap()
          .then((res) => {
            setCertificate(res);
            setShowConfetti(true);
          })
          .catch((err) => {
            if (err?.data?.error === "Certificate already exists") {
              refetchCertificates().then(({ data }) => {
                const cert = data?.find((c) => c.course_slug === slug);
                cert ? setCertificate(cert) : setErrorMessage("Certificate not found");
              });
            } else {
              setErrorMessage(err?.data?.error || "Failed to generate certificate");
            }
          });
      }
    }
  }, [certificates, slug, generateCertificate, refetchCertificates]);

  if (loadingCertificates || generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-8 border-gray-300 border-t-green-500 rounded-full animate-spin" />
        <span className="text-lg font-medium text-gray-600">
          {loadingCertificates ? "Loading..." : "Generating..."}
        </span>
      </div>
    );
  }

  if (errorFetchingCertificates || errorGenerating) {
    return (
      <div className="max-w-md mt-12 p-6 mx-auto my-10 text-center bg-red-50 rounded-lg">
        <h3 className="mb-2 text-xl font-semibold text-red-600">
          {errorFetchingCertificates ? "Error fetching certificates" : "Certificate Error"}
        </h3>
        <p className="mb-4">{errorMessage || "Please try again later."}</p>
        <Button 
          variant="outline" 
          onClick={errorFetchingCertificates ? refetchCertificates : () => generateCertificate(slug)}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="max-w-md p-6 mx-auto my-10 text-center bg-yellow-50 rounded-lg">
        <h3 className="mb-4 text-xl font-semibold text-yellow-700">
          No certificate found for this course
        </h3>
        <Button onClick={() => generateCertificate(slug)}>
          Generate Certificate
        </Button>
      </div>
    );
  }

  return (
    <div className="relative mt-4 max-w-6xl px-4 mx-auto py-12">
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
        <div className="p-4">
          <img
            src={certificate.certificate_file}
            alt="Certificate"
            className="w-full max-w-4xl"
            loading="lazy"
          />
        </div>

        <Button
          asChild
          className="px-8 py-4 text-sm"
          variant={"outline"}
        >
          <a
            href={certificate.certificate_file}
            download={`certificate_${certificate.certificate_id}.png`}
          >
            Download Certificate
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Certificate;