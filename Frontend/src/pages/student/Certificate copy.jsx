import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetMyCertificatesQuery,
  useGenerateCertificateMutation,
} from "@/features/api/certificateApi";
import { Button } from "@/components/ui/button";

const Certificate = () => {
  const { slug } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
      data: generatedData,
    },
  ] = useGenerateCertificateMutation();

  useEffect(() => {
    if (certificates) {
      const certForCourse = certificates.find((cert) => cert.course_slug === slug);
      if (certForCourse) {
        setCertificate(certForCourse);
        setErrorMessage(null);
      } else {
        generateCertificate(slug)
          .unwrap()
          .then((res) => {
            setCertificate(res);
            setErrorMessage(null);
          })
          .catch((err) => {
            if (err?.data?.error === "Certificate already exists") {
              // try to find the correct one from refreshed list
              refetchCertificates().then(({ data }) => {
                const cert = data?.find((c) => c.course_slug === slug);
                if (cert) setCertificate(cert);
                else setErrorMessage("Certificate exists but not found.");
              });
            } else {
              setErrorMessage(err?.data?.error || "Failed to generate certificate");
            }
          });
      }
    }
  }, [certificates, slug, generateCertificate, refetchCertificates]);

  if (loadingCertificates)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 h-16 w-16"></div>
        <span className="ml-4 text-gray-600 text-lg">Loading your certificates...</span>
      </div>
    );

  if (errorFetchingCertificates)
    return (
      <div className="max-w-md mx-auto p-6 text-center bg-red-100 border border-red-400 rounded-md text-red-700">
        Error fetching certificates. Please try again later.
      </div>
    );

  if (generating)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-16 w-16"></div>
        <span className="ml-4 text-blue-600 text-lg">Generating your certificate...</span>
      </div>
    );

  if (errorGenerating && !certificate)
    return (
      <div className="max-w-md mx-auto p-6 text-center bg-red-100 border border-red-400 rounded-md text-red-700">
        {errorMessage || "Error generating certificate."}
      </div>
    );

  if (!certificate)
    return (
      <div className="max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 text-center">
        <p className="mb-4 text-lg font-semibold">No certificate found for this course.</p>
        <button
          onClick={() => generateCertificate(slug)}
          disabled={generating}
          className={`px-6 py-2 rounded font-semibold transition ${generating
              ? "bg-yellow-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
        >
          Generate Certificate
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white mt-24">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">🎉 Congratulations!</h2>
      <p className="text-center text-gray-700 mb-1">
        <strong>Certificate ID:</strong> {certificate.certificate_id}
      </p>
      <div className="border rounded-md overflow-hidden shadow-md">
        <img
          src={certificate.certificate_file}
          alt="Certificate"
          className="w-full object-contain"
          loading="lazy"
        />
      </div>
      <p className="mt-6 text-center text-gray-500 text-sm">
       <Button className="mt-6 text-center text-gray-500 text-sm">
        Download
       </Button>
      </p>
    </div>
  );
};

export default Certificate;

