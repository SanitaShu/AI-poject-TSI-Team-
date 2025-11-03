import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { CameraIcon, UploadIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '../stores/appStore';

type VerificationStatus = 'idle' | 'verifying' | 'verified' | 'failed';

export function VerifyAgePage() {
  const navigate = useNavigate();
  const { setAgeVerified } = useAppStore();
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleVerification = async () => {
    setStatus('verifying');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setStatus('verified');
      setAgeVerified(true);
    }, 2500);
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setShowWebcam(false);
        handleVerification();
      }
    }
  };

  const handleContinue = () => {
    setTimeout(() => {
      navigate('/ai-assistant');
    }, 1500);
  };

  const handleRetry = () => {
    setStatus('idle');
    setProgress(0);
    setShowWebcam(false);
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-8 py-12">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-heading font-semibold text-foreground">
              Age Verification Required
            </h1>
            <p className="text-lg text-muted-foreground">
              Please verify your age to continue with your purchase
            </p>
          </div>

          <Card className="p-8">
            {status === 'idle' && !showWebcam && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <p className="text-base text-foreground">
                    Choose a verification method to confirm you are 18 years or older
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Button
                    onClick={() => setShowWebcam(true)}
                    className="h-32 flex-col gap-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <CameraIcon className="w-12 h-12" strokeWidth={2} />
                    <span className="text-lg">Scan ID with CameraIcon</span>
                  </Button>

                  <Button
                    onClick={handleVerification}
                    className="h-32 flex-col gap-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    <UploadIcon className="w-12 h-12" strokeWidth={2} />
                    <span className="text-lg">UploadIcon ID Photo</span>
                  </Button>
                </div>
              </div>
            )}

            {showWebcam && status === 'idle' && (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden bg-neutral-900">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full"
                    videoConstraints={{
                      width: 1280,
                      height: 720,
                      facingMode: 'user',
                    }}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCapture}
                    className="flex-1 h-16 text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <CameraIcon className="w-6 h-6 mr-3" strokeWidth={2} />
                    Capture Photo
                  </Button>

                  <Button
                    onClick={() => setShowWebcam(false)}
                    className="h-16 px-8 text-lg bg-muted text-muted-foreground hover:bg-muted/80"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {status === 'verifying' && (
              <div className="space-y-6 py-8">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
                  />
                  <h3 className="text-2xl font-heading font-medium text-foreground">
                    Verifying Your ID...
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Please wait while we verify your information
                  </p>
                </div>

                <Progress value={progress} className="h-3" />
              </div>
            )}

            {status === 'verified' && (
              <div className="space-y-6 py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  >
                    <CheckCircleIcon className="w-24 h-24 mx-auto text-success drop-shadow-lg" strokeWidth={2} />
                  </motion.div>
                </motion.div>

                <div className="space-y-2">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-heading font-medium text-foreground"
                  >
                    ✓ You're Verified!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-base text-muted-foreground"
                  >
                    Age verification complete. You can now proceed with your purchase.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    onClick={handleContinue}
                    className="h-16 px-12 text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
                  >
                    Continue to Shopping
                  </Button>
                </motion.div>
              </div>
            )}

            {status === 'failed' && (
              <div className="space-y-6 py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <XCircleIcon className="w-24 h-24 mx-auto text-destructive" strokeWidth={2} />
                </motion.div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-heading font-medium text-foreground">
                    Verification Failed
                  </h3>
                  <p className="text-base text-muted-foreground">
                    We couldn't verify your age. Please try again with a clear, well-lit photo of your ID.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-left space-y-2">
                    <p className="font-medium text-foreground">Tips for better results:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Ensure good lighting</li>
                      <li>Keep ID flat and in focus</li>
                      <li>Make sure all text is readable</li>
                      <li>Avoid glare or shadows</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={handleRetry}
                  className="h-16 px-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Try Again
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
