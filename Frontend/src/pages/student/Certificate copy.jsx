import { Button } from '@/components/ui/button'
import { 
  useGetMyCertificatesQuery, 
  useLazyDownloadCertificateQuery,
  useGenerateCertificateMutation 
} from '@/features/api/certificateApi'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'

const Certificate = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  
  // Fetch certificates for current user
  const { 
    data: certificates, 
    isLoading, 
    refetch 
  } = useGetMyCertificatesQuery()
  
  // Certificate download and generation
  const [downloadCertificate, { isLoading: isDownloading }] = useLazyDownloadCertificateQuery()
  const [generateCertificate, { isLoading: isGenerating }] = useGenerateCertificateMutation()

  // Find certificate for this specific course
  const courseCertificate = certificates?.find(cert => cert.course.slug === slug)

  const handleGenerate = async () => {
    try {
      await generateCertificate(slug).unwrap()
      toast.success('Certificate generated successfully!')
      refetch()
    } catch (err) {
      setError(err.data?.error || 'Failed to generate certificate')
      toast.error('Certificate generation failed')
    }
  }

  const handleDownload = async () => {
    if (!courseCertificate?.id) return
    
    try {
      const { data: blob } = await downloadCertificate(courseCertificate.id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Certificate_${courseCertificate.course.title.replace(/\s+/g, '_')}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError('Failed to download certificate')
      toast.error('Download failed. Please try again.')
    }
  }

  const handleBackToCourse = () => {
    navigate(`/course/${slug}/progress`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!courseCertificate) {
    return (
      <div className='mt-4 p-24 text-center'>
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-blue-500" />
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          Certificate Not Generated Yet
        </h1>
        <p className="mt-4 text-lg mb-6">Click below to create your certificate</p>
        
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className='mt-6'
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Certificate'
          )}
        </Button>
        
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
        
        <Button 
          onClick={handleBackToCourse}
          variant="outline" 
          className='mt-6 ml-4'
        >
          Back to Course
        </Button>
      </div>
    )
  }

  return (
    <div className='mt-4 p-24 text-center'>
      <div className="flex justify-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-8">
        Certificate of Completion
      </h1>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-2">{courseCertificate.course.title}</h2>
        <p className="text-lg mb-6">Awarded to: {courseCertificate.student.full_name}</p>
        <p className="text-gray-600">
          Completed on: {new Date(courseCertificate.issued_at).toLocaleDateString()}
        </p>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          onClick={handleDownload}
          disabled={isDownloading}
          className='mt-6'
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Download...
            </>
          ) : (
            'Download Certificate'
          )}
        </Button>
        
        <Button 
          onClick={handleBackToCourse}
          variant="outline" 
          className='mt-6'
        >
          Back to Course
        </Button>
      </div>
      
      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
    </div>
  )
}

export default Certificate