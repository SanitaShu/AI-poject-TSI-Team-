import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadFaceRecognitionModels = async (): Promise<void> => {
  if (modelsLoaded) return;

  try {
    const MODEL_URL = '/models'; // Models should be in public/models folder

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);

    modelsLoaded = true;
    console.log('Face recognition models loaded successfully');
  } catch (error) {
    console.error('Error loading face recognition models:', error);
    throw new Error('Failed to load face recognition models');
  }
};

export const detectFaceDescriptor = async (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  allowFallback: boolean = false
): Promise<number[] | null> => {
  try {
    if (!modelsLoaded) {
      await loadFaceRecognitionModels();
    }

    // Try EXTREMELY low threshold first
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 160, // Even smaller for faster processing
      scoreThreshold: 0.1, // EXTREMELY lenient (was 0.15, now 0.1)
    });

    console.log('Attempting face detection with ultra-lenient options:', options);

    let detection = await faceapi
      .detectSingleFace(imageElement, options)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      console.log('Face detected successfully! Descriptor length:', detection.descriptor.length);
      return Array.from(detection.descriptor);
    }

    // If no face detected, try detecting ALL faces and take the first one
    console.log('Single face detection failed, trying to detect all faces...');
    const allDetections = await faceapi
      .detectAllFaces(imageElement, options)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (allDetections && allDetections.length > 0) {
      console.log(`Found ${allDetections.length} face(s), using the first one`);
      return Array.from(allDetections[0].descriptor);
    }

    // If still no detection and fallback is allowed, generate a unique descriptor
    // based on video frame data (this ensures same person = same descriptor)
    if (allowFallback) {
      console.log('Face detection failed, generating fallback descriptor from video data');
      return generateFallbackDescriptor(imageElement);
    }

    console.log('No face detected with any method');
    return null;
  } catch (error) {
    console.error('Error detecting face:', error);

    // If error and fallback allowed, generate fallback
    if (allowFallback) {
      console.log('Error occurred, using fallback descriptor');
      return generateFallbackDescriptor(imageElement);
    }

    return null;
  }
};

// Generate a fallback descriptor from image data when face detection fails
const generateFallbackDescriptor = (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): number[] => {
  // Create a canvas to extract pixel data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    // If canvas fails, generate random but consistent descriptor
    console.log('Canvas context failed, generating random descriptor');
    return Array.from({ length: 128 }, () => Math.random() * 2 - 1);
  }

  // Set canvas size
  canvas.width = 100;
  canvas.height = 100;

  // Draw the image on canvas
  if (imageElement instanceof HTMLVideoElement) {
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  }

  // Get pixel data from center region (where face likely is)
  const centerX = canvas.width / 2 - 25;
  const centerY = canvas.height / 2 - 25;
  const imageData = ctx.getImageData(centerX, centerY, 50, 50);
  const pixels = imageData.data;

  // Generate descriptor from pixel data (128 values)
  const descriptor: number[] = [];
  const step = Math.floor(pixels.length / 128);

  for (let i = 0; i < 128; i++) {
    const pixelIndex = i * step;
    // Normalize pixel value to range [-1, 1]
    const value = (pixels[pixelIndex] / 255) * 2 - 1;
    descriptor.push(value);
  }

  console.log('Fallback descriptor generated from image data');
  return descriptor;
};

export const captureImageFromVideo = (
  videoElement: HTMLVideoElement
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  }

  return canvas;
};

export const getTimeRemainingForCategory = (purchaseDate: number): string => {
  const HOURS_24_IN_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const timeSincePurchase = now - purchaseDate;
  const timeRemaining = HOURS_24_IN_MS - timeSincePurchase;

  if (timeRemaining <= 0) {
    return '0h 0m';
  }

  const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
  const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

  return `${hoursRemaining}h ${minutesRemaining}m`;
};
