export interface Gadget {
  id?: string;
  name: string;
  category: GadgetCategory;
  brand: string;
  price: number;
  description: string;
  images: string[];
  specifications: SmartphoneSpecifications | LaptopSpecifications | HeadphonesSpecifications | SmartwatchSpecifications | TabletSpecifications | CameraSpecifications | ChargerCablesSpecifications | OtherSpecifications;
  buyingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GadgetCategory = 
  | "Smartphone" 
  | "Laptop" 
  | "Headphones" 
  | "Smartwatch" 
  | "Tablet" 
  | "Camera" 
  | "Charger & Cables" 
  | "Other";

// Smartphone Specifications
export interface SmartphoneSpecifications {
  // Display
  displaySize: string;
  resolution: string;
  resolutionType: string;
  displayType: string;
  refreshRate?: string;
  
  // Performance
  processor: string;
  processorCompany?: string;
  processorName?: string;
  ram: string;
  ramType?: string;
  storage: string;
  
  // Camera
  primaryCamera: string;
  primaryCameraFeatures?: string;
  secondaryCamera?: string;
  secondaryCameraFeatures?: string;
  dualCameraLens?: string;
  hdRecording?: boolean;
  fullHdRecording?: boolean;
  videoRecording?: boolean;
  videoRecordingResolution?: string;
  digitalZoom?: string;
  frameRate?: string;
  imageEditor?: boolean;
  
  // Battery & Power
  battery: string;
  fastCharging?: string;
  wirelessCharging?: boolean;
  
  // Connectivity
  networkType: string;
  bluetoothSupport: boolean;
  bluetoothVersion?: string;
  wifi: boolean;
  wifiVersion?: string;
  nfc?: boolean;
  usbType?: string;
  
  // Software
  operatingSystem: string;
  
  // Performance Scores
  geekbenchScore?: number;
  antutuScore?: number;
  
  // Additional
  waterResistance?: string;
  fingerprint?: boolean;
  faceUnlock?: boolean;
  simType?: string;
}

// Laptop Specifications
export interface LaptopSpecifications {
  // Display
  displaySize: string;
  resolution: string;
  displayType: string;
  refreshRate?: string;
  touchscreen?: boolean;
  
  // Performance
  processorCompany: string;
  processorGeneration: string;
  processorName: string;
  baseClockSpeed: string;
  turboClockSpeed?: string;
  ram: string;
  ramType: string;
  ssd: boolean;
  ssdCapacity?: string;
  
  // Graphics
  graphicsCard: string;
  graphicsCompany: string;
  graphicsCardName: string;
  graphicsVRAM: string;
  graphicsPower?: string;
  discreteGraphicsCard?: boolean;
  
  // Connectivity
  ports: string;
  wifi: boolean;
  wifiVersion?: string;
  bluetoothSupport: boolean;
  bluetoothVersion?: string;
  ethernet?: boolean;
  
  // Software
  operatingSystem: string;
  
  // Physical
  weight: string;
  dimensions?: string;
  
  // Performance Scores
  cinebenchScore?: number;
  geekbenchScore?: number;
  
  // Additional
  webcam?: string;
  keyboard?: string;
  fingerprint?: boolean;
  backlitKeyboard?: boolean;
}

// Headphones Specifications
export interface HeadphonesSpecifications {
  // Audio
  driverSize: string;
  
  // Features
  noiseCancellation: boolean;
  activeNoiseCancellation?: boolean;
  transparencyMode?: boolean;
  
  // Design & Features
  headphoneDesign?: string;
  signalToNoiseRatio?: string;
  noiseReduction?: string;
  otherSoundFeatures?: string;
  audioCodec?: string;
  deepBass?: boolean;
  technologyUsed?: string;
  wirelessRange?: string;
  
  // Connectivity
  connectivity: string;
  bluetoothVersion?: string;
  wiredConnection?: string;
  
  // Battery
  battery?: string;
  batteryLife?: string;
  quickCharge?: boolean;
  
  // Physical
  foldable?: boolean;
  
  // Additional
  microphone?: boolean;
  controls?: string;
  compatibility?: string;
  waterResistance?: string;
}

// Smartwatch Specifications
export interface SmartwatchSpecifications {
  // Display
  displaySize: string;
  displayType: string;
  resolution?: string;
  alwaysOnDisplay?: boolean;
  
  // Performance
  processor?: string;
  ram?: string;
  storage?: string;
  
  // Sensors
  heartRateMonitor: boolean;
  gps: boolean;
  accelerometer?: boolean;
  gyroscope?: boolean;
  compass?: boolean;
  barometer?: boolean;
  
  // Health Features
  sleepTracking?: boolean;
  stepCounter?: boolean;
  calorieTracker?: boolean;
  workoutModes?: string;
  
  // Connectivity
  connectivity: string;
  bluetoothVersion?: string;
  wifi?: boolean;
  cellular?: boolean;
  
  // Battery
  battery: string;
  batteryLife?: string;
  
  // Physical
  waterResistance: string;
  weight?: string;
  dimensions?: string;
  material?: string;
  
  // Additional
  notifications?: boolean;
  musicControl?: boolean;
  voiceAssistant?: boolean;
  appStore?: boolean;
}

// Tablet Specifications
export interface TabletSpecifications {
  // Display
  displaySize: string;
  resolution: string;
  displayType: string;
  refreshRate?: string;
  touchscreen: boolean;
  
  // Performance
  processor: string;
  ram: string;
  storage: string;
  
  // Camera
  primaryCamera?: string;
  secondaryCamera?: string;
  videoRecording?: boolean;
  
  // Battery
  battery: string;
  
  // Connectivity
  connectivity: string;
  wifi: boolean;
  bluetoothSupport: boolean;
  cellular?: boolean;
  
  // Software
  operatingSystem: string;
  
  // Physical
  weight?: string;
  dimensions?: string;
  
  // Additional
  stylus?: boolean;
  keyboard?: boolean;
  fingerprint?: boolean;
  faceUnlock?: boolean;
}

// Camera Specifications
export interface CameraSpecifications {
  // Sensor
  sensorSize: string;
  megapixels?: string;
  sensorType?: string;
  
  // Lens
  lensMount: string;
  focalLength?: string;
  aperture?: string;
  
  // Video
  videoResolution: string;
  frameRate?: string;
  videoFormat?: string;
  
  // Features
  autofocus?: boolean;
  imageStabilization?: boolean;
  flash?: boolean;
  
  // Connectivity
  connectivity: string;
  wifi?: boolean;
  bluetoothSupport?: boolean;
  
  // Physical
  weight?: string;
  dimensions?: string;
  
  // Additional
  lcdScreen?: string;
  viewfinder?: boolean;
  battery?: string;
  storage?: string;
}

// Charger & Cables Specifications
export interface ChargerCablesSpecifications {
  // Power
  powerOutput?: string;
  voltage?: string;
  current?: string;
  
  // Connectors
  connectorType: string;
  cableLength?: string;
  
  // Features
  fastCharging?: boolean;
  wirelessCharging?: boolean;
  dataTransfer?: boolean;
  
  // Compatibility
  compatibility: string;
  
  // Physical
  material?: string;
  color?: string;
  
  // Additional
  certification?: string;
  warranty?: string;
}

// Other Specifications
export interface OtherSpecifications {
  // Generic fields for other categories
  specifications: string;
  features?: string;
  compatibility?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  color?: string;
  warranty?: string;
  
  // Additional custom fields
  [key: string]: string | number | boolean | undefined;
}

export interface UserPreferences {
  category: GadgetCategory;
  budget: {
    min: number;
    max: number;
  };
  purpose: string;
  priorities: string[];
  brandPreferences?: string[];
  specificFeatures?: string[];
}

export interface RecommendationResult {
  gadget: Gadget;
  score: number;
  reasons: string[];
  matchPercentage: number;
}
