import { Button } from '@/components/ui/button';
import {
  useGetMyCertificatesQuery,
  useLazyDownloadCertificateQuery,
} from '@/features/api/certificateApi';
import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Certificate = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch certificate data with refetching
  const { data: certificates, isLoading, isError, error } = useGetMyCertificatesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [downloadCertificate, { isLoading: isDownloading }] = useLazyDownloadCertificateQuery();

  // Debugging logs
  console.log('Certificates:', certificates);
  console.log('Slug:', slug);
  const certificate = certificates?.find((c) => c.course.slug.toLowerCase() === slug.toLowerCase());
  console.log('Certificate:', certificate);

  const handleDownload = async () => {
    if (!certificate?.id) {
      toast.error('No certificate available to download.');
      return;
    }
    try {
      const { data: blob } = await downloadCertificate(certificate.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${certificate.course.title.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download certificate. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-24">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-24">
        <h1 className="text-2xl font-bold mb-4">Error Loading Certificate</h1>
        <p className="mb-6">{error?.data?.detail || 'Failed to load certificate data.'}</p>
        <Button onClick={() => navigate(`/course/${slug}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
      </div>
    );
  }

  if (!certificates || !certificate) {
    return (
      <div className="text-center p-24">
        <h1 className="text-2xl font-bold mb-4">Certificate Not Available</h1>
        <p className="mb-6">Please complete the course to generate your certificate.</p>
        <Button onClick={() => navigate(`/course/${slug}/progress`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center p-24">
      <h1 className="text-2xl font-bold mb-8">Certificate of Completion</h1>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-xl font-semibold mb-2">{certificate.course.title}</h2>
        <p className="mb-4">Awarded to: {certificate.student.full_name}</p>
        <p className="text-gray-600">
          Completed on: {new Date(certificate.issued_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload} disabled={isDownloading}>
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? 'Preparing...' : 'Download Certificate'}
        </Button>
        <Button variant="outline" onClick={() => navigate(`/course/${slug}`)}>
          Back to Course
        </Button>
      </div>
    </div>
  );
};

export default Certificate;