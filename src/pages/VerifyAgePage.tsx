import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { CameraIcon, CheckCircleIcon, XCircleIcon, UserIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '../stores/appStore';
import { useTranslation } from '../hooks/useTranslation';
import { useFaceRecognitionStore } from '../stores/faceRecognitionStore';
import { detectFaceDescriptor, loadFaceRecognitionModels } from '../utils/faceRecognition';
import { FaceRecognitionConsent } from '../components/FaceRecognitionConsent';

type VerificationStatus = 'idle' | 'loading' | 'scanning' | 'success' | 'error';

export function VerifyAgePage() {
  const navigate = useNavigate();
  const { setAgeVerified } = useAppStore();
  const { t } = useTranslation();
  const { findMatchingUser, addUserRecord, setCurrentUser } = useFaceRecognitionStore();
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [message, setMessage] = useState('');
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Load face recognition models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus('loading');
        setMessage(t.ageVerification.loadingModels);
        await loadFaceRecognitionModels();
        setStatus('idle');
        setMessage('');
      } catch (error) {
        console.error('Error loading models:', error);
        setStatus('error');
        setMessage('Failed to load face recognition models');
      }
    };

    loadModels();
  }, [t]);

  const performFaceScan = async () => {
    try {
      setStatus('scanning');
      setMessage(t.ageVerification.capturingFace);

      // Get the video element from the webcam
      const video = webcamRef.current?.video;
      if (!video) {
        console.error('No video element found');
        setStatus('error');
        setMessage('Camera not ready. Please allow camera access.');
        return;
      }

      // Wait for video to be ready
      if (video.readyState < 2) {
        console.log('Waiting for video to be ready...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('Video ready state:', video.readyState);
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

      // Detect face descriptor with multiple attempts
      // First 3 attempts: Try proper face detection
      let faceDescriptor = await detectFaceDescriptor(video, false);

      if (!faceDescriptor) {
        setMessage('Retrying detection... (Attempt 2/5)');
        await new Promise(resolve => setTimeout(resolve, 600));
        faceDescriptor = await detectFaceDescriptor(video, false);
      }

      if (!faceDescriptor) {
        setMessage('Retrying detection... (Attempt 3/5)');
        await new Promise(resolve => setTimeout(resolve, 600));
        faceDescriptor = await detectFaceDescriptor(video, false);
      }

      // Last 2 attempts: Enable fallback mode (will use image data if face detection fails)
      if (!faceDescriptor) {
        setMessage('Using advanced detection... (Attempt 4/5)');
        await new Promise(resolve => setTimeout(resolve, 600));
        faceDescriptor = await detectFaceDescriptor(video, true);
      }

      if (!faceDescriptor) {
        setMessage('Final attempt with fallback... (Attempt 5/5)');
        await new Promise(resolve => setTimeout(resolve, 600));
        faceDescriptor = await detectFaceDescriptor(video, true);
      }

      if (!faceDescriptor) {
        console.error('Face detection failed after all attempts including fallback');
        setStatus('error');
        setMessage('Camera not working. Please use the developer bypass button below.');
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
        return;
      }

      console.log('Successfully obtained face descriptor');

      // Check if this user already exists
      const existingUser = findMatchingUser(faceDescriptor);

      if (existingUser) {
        // Returning user
        setIsReturningUser(true);
        setCurrentUser(existingUser.id, faceDescriptor);
        setMessage(t.purchaseRestrictions.welcomeBack);
      } else {
        // New user
        setIsReturningUser(false);
        const newUserId = addUserRecord(faceDescriptor);
        setCurrentUser(newUserId, faceDescriptor);
        setMessage(t.ageVerification.faceDetected);
      }

      setStatus('success');

      // Complete verification and redirect to AI chat
      setTimeout(() => {
        setAgeVerified(true);
        navigate('/ai-assistant');
      }, 2000);
    } catch (error) {
      console.error('Error scanning face:', error);
      setStatus('error');
      setMessage(t.ageVerification.noFaceDetected);
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleScanFace = () => {
    // Show consent modal if user hasn't consented yet
    if (!hasConsented) {
      setShowConsent(true);
      return;
    }
    // User has consented, proceed with scan
    performFaceScan();
  };

  const handleConsentAgree = () => {
    setHasConsented(true);
    setShowConsent(false);
    // Automatically trigger face scan after consent
    setTimeout(() => {
      performFaceScan(); // Call performFaceScan directly, bypassing consent check
    }, 300);
  };

  const handleConsentCancel = () => {
    setShowConsent(false);
    navigate('/');
  };

  // Development bypass for testing when camera doesn't work
  const handleDevBypass = () => {
    // Create a random test face descriptor for development
    const testFaceDescriptor = Array.from({ length: 128 }, () => Math.random());

    // Check if test user exists, otherwise create one
    const existingUser = findMatchingUser(testFaceDescriptor);

    if (existingUser) {
      setIsReturningUser(true);
      setCurrentUser(existingUser.id, testFaceDescriptor);
      setMessage('Test User Loaded (Dev Mode)');
    } else {
      setIsReturningUser(false);
      const newUserId = addUserRecord(testFaceDescriptor);
      setCurrentUser(newUserId, testFaceDescriptor);
      setMessage('New Test User Created (Dev Mode)');
    }

    setStatus('success');

    // Redirect after delay to AI chat
    setTimeout(() => {
      setAgeVerified(true);
      navigate('/ai-assistant');
    }, 2000);
  };

  return (
    <>
      <FaceRecognitionConsent
        isOpen={showConsent}
        onAgree={handleConsentAgree}
        onCancel={handleConsentCancel}
      />

      <div className="min-h-[calc(100vh-180px)] px-8 py-12 bg-background">
        <div className="container max-w-2xl mx-auto">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-semibold text-foreground mb-3">
              {t.ageVerification.faceRecognition}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.purchaseRestrictions.restrictionInfo}
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: 'user',
                    width: 1280,
                    height: 720,
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Messages */}
                {status === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-center text-white">
                      <Loader2Icon className="w-12 h-12 mx-auto mb-3 animate-spin" />
                      <p className="text-lg">{message}</p>
                    </div>
                  </div>
                )}

                {status === 'scanning' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-center text-white">
                      <Loader2Icon className="w-12 h-12 mx-auto mb-3 animate-spin" />
                      <p className="text-lg">{message}</p>
                    </div>
                  </div>
                )}

                {status === 'success' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <div className="text-center text-white">
                      <CheckCircleIcon className="w-16 h-16 mx-auto mb-3 text-green-500" />
                      <p className="text-xl font-semibold">{message}</p>
                      {isReturningUser && (
                        <p className="text-sm mt-2">{t.purchaseRestrictions.returningUser}</p>
                      )}
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                    <div className="text-center text-white">
                      <XCircleIcon className="w-16 h-16 mx-auto mb-3 text-red-500" />
                      <p className="text-xl font-semibold">{message}</p>
                    </div>
                  </div>
                )}

                {/* Face Detection Guide */}
                {status === 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-4 border-white/50 rounded-full flex items-center justify-center">
                      <UserIcon className="w-32 h-32 text-white/50" />
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  {t.ageVerification.tipsHeader}
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ {t.ageVerification.tipGoodLighting}</li>
                  <li>✓ Look directly at the camera</li>
                  <li>✓ Position your face in the circle</li>
                  <li>✓ Remove glasses if possible</li>
                  <li>✓ Move closer to the camera</li>
                  <li>✓ Clean your camera lens</li>
                </ul>
              </div>

              {/* Development Bypass (Only shown in development) */}
              {import.meta.env.DEV && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                    <strong>Developer Mode:</strong> Camera not working?
                  </p>
                  <Button
                    onClick={handleDevBypass}
                    variant="outline"
                    className="w-full border-yellow-500/30 hover:bg-yellow-500/10"
                    disabled={status === 'scanning' || status === 'success'}
                  >
                    Skip Face Recognition (Testing Only)
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 h-14 text-base"
                  disabled={status === 'scanning' || status === 'loading'}
                >
                  {t.ageVerification.cancel}
                </Button>
                <Button
                  onClick={handleScanFace}
                  className="flex-1 h-14 text-base bg-primary hover:bg-primary/90"
                  disabled={status === 'scanning' || status === 'loading' || status === 'success'}
                >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  {status === 'scanning' ? t.ageVerification.processing : t.ageVerification.scanFace}
                </Button>
              </div>
            </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
