"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";
import { getGadgetById } from "@/lib/firebase-utils";
import { Gadget, GadgetCategory } from "@/types/gadget";

export default function GadgetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gadget, setGadget] = useState<Gadget | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchGadget();
    }
  }, [params.id]);

  const fetchGadget = async () => {
    try {
      setLoading(true);
      // Since we don't have category in URL, we'll need to search across all categories
      // This is a temporary solution - ideally the URL should include category
      const categories = ["Smartphone", "Laptop", "Headphones", "Smartwatch", "Tablet", "Camera", "Charger & Cables", "Other"];
      let foundGadget = null;
      
      for (const category of categories) {
        try {
          const data = await getGadgetById(params.id as string, category as GadgetCategory);
          if (data) {
            foundGadget = data;
            break;
          }
        } catch (error) {
          // Continue to next category
          continue;
        }
      }
      
      setGadget(foundGadget);
    } catch (error) {
      console.error("Error fetching gadget:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (gadget?.buyingLink) {
      window.open(gadget.buyingLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gadget) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const specs = gadget.specifications as any; // Type assertion for flexibility - TODO: Improve type safety

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => {
            if (searchParams.get('from') === 'recommendations') {
              router.push('/?from=recommendations');
            } else {
              router.back();
            }
          }}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recommendations
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <Card>
            <CardContent className="p-6">
              {gadget.images && gadget.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={gadget.images[currentImageIndex]}
                      alt={gadget.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  {gadget.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {gadget.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            currentImageIndex === index 
                              ? 'border-blue-500' 
                              : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${gadget.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{gadget.name}</CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-1">
                      {gadget.brand}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {gadget.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                                     <div className="text-3xl font-bold text-blue-600">
                     ₹{gadget.price.toLocaleString('en-IN')}
                   </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {gadget.description}
                  </p>

                  {/* Buy Button */}
                  {gadget.buyingLink && (
                    <Button 
                      onClick={handleBuyNow}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* --- DISPLAY GROUP --- */}
{(specs.displaySize || specs.resolution || specs.resolutionType || specs.displayType || specs.refreshRate) && (
  <div className="col-span-full mt-2 mb-1">
    <h4 className="font-semibold text-blue-700 mb-1">Display</h4>
    {specs.displaySize && <div><span className="font-semibold text-gray-700">Size:</span> <span className="text-gray-600">{specs.displaySize}</span></div>}
    {specs.resolution && <div><span className="font-semibold text-gray-700">Resolution:</span> <span className="text-gray-600">{specs.resolution}</span></div>}
    {specs.resolutionType && <div><span className="font-semibold text-gray-700">Resolution Type:</span> <span className="text-gray-600">{specs.resolutionType}</span></div>}
    {specs.displayType && <div><span className="font-semibold text-gray-700">Type:</span> <span className="text-gray-600">{specs.displayType}</span></div>}
    {specs.refreshRate && <div><span className="font-semibold text-gray-700">Refresh Rate:</span> <span className="text-gray-600">{specs.refreshRate}</span></div>}
  </div>
)}

{/* --- CAMERA GROUP --- */}
{(specs.primaryCamera || specs.primaryCameraFeatures || specs.secondaryCamera || specs.secondaryCameraFeatures || specs.dualCameraLens || specs.hdRecording !== undefined || specs.fullHdRecording !== undefined || specs.videoRecording !== undefined || specs.videoRecordingResolution || specs.digitalZoom || specs.frameRate || specs.imageEditor !== undefined) && (
  <div className="col-span-full mt-2 mb-1">
    <h4 className="font-semibold text-blue-700 mb-1">Camera</h4>
    {specs.primaryCamera && <div><span className="font-semibold text-gray-700">Primary:</span> <span className="text-gray-600">{specs.primaryCamera}</span></div>}
    {specs.primaryCameraFeatures && <div><span className="font-semibold text-gray-700">Primary Features:</span> <span className="text-gray-600">{specs.primaryCameraFeatures}</span></div>}
    {specs.secondaryCamera && <div><span className="font-semibold text-gray-700">Secondary:</span> <span className="text-gray-600">{specs.secondaryCamera}</span></div>}
    {specs.secondaryCameraFeatures && <div><span className="font-semibold text-gray-700">Secondary Features:</span> <span className="text-gray-600">{specs.secondaryCameraFeatures}</span></div>}
    {specs.dualCameraLens && <div><span className="font-semibold text-gray-700">Dual Lens:</span> <span className="text-gray-600">{specs.dualCameraLens}</span></div>}
    {specs.hdRecording !== undefined && <div><span className="font-semibold text-gray-700">HD Recording:</span> <span className="text-gray-600">{specs.hdRecording ? 'Yes' : 'No'}</span></div>}
    {specs.fullHdRecording !== undefined && <div><span className="font-semibold text-gray-700">Full HD Recording:</span> <span className="text-gray-600">{specs.fullHdRecording ? 'Yes' : 'No'}</span></div>}
    {specs.videoRecording !== undefined && <div><span className="font-semibold text-gray-700">Video Recording:</span> <span className="text-gray-600">{specs.videoRecording ? 'Yes' : 'No'}</span></div>}
    {specs.videoRecordingResolution && <div><span className="font-semibold text-gray-700">Video Resolution:</span> <span className="text-gray-600">{specs.videoRecordingResolution}</span></div>}
    {specs.digitalZoom && <div><span className="font-semibold text-gray-700">Digital Zoom:</span> <span className="text-gray-600">{specs.digitalZoom}</span></div>}
    {specs.frameRate && <div><span className="font-semibold text-gray-700">Frame Rate:</span> <span className="text-gray-600">{specs.frameRate}</span></div>}
    {specs.imageEditor !== undefined && <div><span className="font-semibold text-gray-700">Image Editor:</span> <span className="text-gray-600">{specs.imageEditor ? 'Yes' : 'No'}</span></div>}
  </div>
)}

{/* --- BATTERY & POWER GROUP --- */}
{(specs.battery || specs.fastCharging || specs.wirelessCharging !== undefined) && (
  <div className="col-span-full mt-2 mb-1">
    <h4 className="font-semibold text-blue-700 mb-1">Battery & Power</h4>
    {specs.battery && <div><span className="font-semibold text-gray-700">Battery:</span> <span className="text-gray-600">{specs.battery}</span></div>}
    {specs.fastCharging && <div><span className="font-semibold text-gray-700">Fast Charging:</span> <span className="text-gray-600">{specs.fastCharging}</span></div>}
    {specs.wirelessCharging !== undefined && <div><span className="font-semibold text-gray-700">Wireless Charging:</span> <span className="text-gray-600">{specs.wirelessCharging ? 'Yes' : 'No'}</span></div>}
  </div>
)}

{/* --- PERFORMANCE GROUP --- */}
{(specs.processor || specs.processorCompany || specs.processorName || specs.ram || specs.ramType || specs.storage || specs.ssd !== undefined || specs.ssdCapacity || specs.graphicsCard || specs.graphicsCompany || specs.graphicsCardName || specs.graphicsVRAM || specs.graphicsPower || specs.discreteGraphicsCard !== undefined) && (
  <div className="col-span-full mt-2 mb-1">
    <h4 className="font-semibold text-blue-700 mb-1">Performance</h4>
    {specs.processor && <div><span className="font-semibold text-gray-700">Processor:</span> <span className="text-gray-600">{specs.processor}</span></div>}
    {specs.processorCompany && <div><span className="font-semibold text-gray-700">Processor Company:</span> <span className="text-gray-600">{specs.processorCompany}</span></div>}
    {specs.processorName && <div><span className="font-semibold text-gray-700">Processor Name:</span> <span className="text-gray-600">{specs.processorName}</span></div>}
    {specs.ram && <div><span className="font-semibold text-gray-700">RAM:</span> <span className="text-gray-600">{specs.ram}</span></div>}
    {specs.ramType && <div><span className="font-semibold text-gray-700">RAM Type:</span> <span className="text-gray-600">{specs.ramType}</span></div>}
    {specs.storage && <div><span className="font-semibold text-gray-700">Storage:</span> <span className="text-gray-600">{specs.storage}</span></div>}
    {specs.ssd !== undefined && <div><span className="font-semibold text-gray-700">SSD:</span> <span className="text-gray-600">{specs.ssd ? 'Yes' : 'No'}</span></div>}
    {specs.ssdCapacity && <div><span className="font-semibold text-gray-700">SSD Capacity:</span> <span className="text-gray-600">{specs.ssdCapacity}</span></div>}
    {specs.graphicsCard && <div><span className="font-semibold text-gray-700">Graphics Card:</span> <span className="text-gray-600">{specs.graphicsCard}</span></div>}
    {specs.graphicsCompany && <div><span className="font-semibold text-gray-700">Graphics Company:</span> <span className="text-gray-600">{specs.graphicsCompany}</span></div>}
    {specs.graphicsCardName && <div><span className="font-semibold text-gray-700">Graphics Card Name:</span> <span className="text-gray-600">{specs.graphicsCardName}</span></div>}
    {specs.graphicsVRAM && <div><span className="font-semibold text-gray-700">Graphics VRAM:</span> <span className="text-gray-600">{specs.graphicsVRAM}</span></div>}
    {specs.graphicsPower && <div><span className="font-semibold text-gray-700">Graphics Power:</span> <span className="text-gray-600">{specs.graphicsPower}</span></div>}
    {specs.discreteGraphicsCard !== undefined && <div><span className="font-semibold text-gray-700">Discrete Graphics Card:</span> <span className="text-gray-600">{specs.discreteGraphicsCard ? 'Yes' : 'No'}</span></div>}
  </div>
)}

{/* --- CONNECTIVITY GROUP --- */}
{(specs.networkType || specs.bluetoothSupport !== undefined || specs.bluetoothVersion || specs.wifi !== undefined || specs.wifiVersion || specs.nfc !== undefined || specs.usbType) && (
  <div className="col-span-full mt-2 mb-1">
    <h4 className="font-semibold text-blue-700 mb-1">Connectivity</h4>
    {specs.networkType && <div><span className="font-semibold text-gray-700">Network Type:</span> <span className="text-gray-600">{specs.networkType}</span></div>}
    {specs.bluetoothSupport !== undefined && <div><span className="font-semibold text-gray-700">Bluetooth Support:</span> <span className="text-gray-600">{specs.bluetoothSupport ? 'Yes' : 'No'}</span></div>}
    {specs.bluetoothVersion && <div><span className="font-semibold text-gray-700">Bluetooth Version:</span> <span className="text-gray-600">{specs.bluetoothVersion}</span></div>}
    {specs.wifi !== undefined && <div><span className="font-semibold text-gray-700">WiFi:</span> <span className="text-gray-600">{specs.wifi ? 'Yes' : 'No'}</span></div>}
    {specs.wifiVersion && <div><span className="font-semibold text-gray-700">WiFi Version:</span> <span className="text-gray-600">{specs.wifiVersion}</span></div>}
    {specs.nfc !== undefined && <div><span className="font-semibold text-gray-700">NFC:</span> <span className="text-gray-600">{specs.nfc ? 'Yes' : 'No'}</span></div>}
    {specs.usbType && <div><span className="font-semibold text-gray-700">USB Type:</span> <span className="text-gray-600">{specs.usbType}</span></div>}
  </div>
)}

{/* --- SOFTWARE GROUP --- */}
{specs.operatingSystem && (
  <div className="col-span-full mt-2 mb-1">
    <h4 className="font-semibold text-blue-700 mb-1">Software</h4>
    <div><span className="font-semibold text-gray-700">Operating System:</span> <span className="text-gray-600">{specs.operatingSystem}</span></div>
  </div>
)}

{/* --- ADDITIONAL / DYNAMIC FIELDS --- */}
{Object.entries(specs)
  .filter(([key, value]) => {
    // List of keys already rendered above
    const renderedKeys = [
      // Display
      'displaySize', 'resolution', 'resolutionType', 'displayType', 'refreshRate',
      // Camera
      'primaryCamera', 'primaryCameraFeatures', 'secondaryCamera', 'secondaryCameraFeatures', 'dualCameraLens', 'hdRecording', 'fullHdRecording', 'videoRecording', 'videoRecordingResolution', 'digitalZoom', 'frameRate', 'imageEditor',
      // Battery
      'battery', 'fastCharging', 'wirelessCharging',
      // Performance
      'processor', 'processorCompany', 'processorName', 'ram', 'ramType', 'storage', 'ssd', 'ssdCapacity', 'graphicsCard', 'graphicsCompany', 'graphicsCardName', 'graphicsVRAM', 'graphicsPower', 'discreteGraphicsCard',
      // Connectivity
      'networkType', 'bluetoothSupport', 'bluetoothVersion', 'wifi', 'wifiVersion', 'nfc', 'usbType',
      // Software
      'operatingSystem',
      // Performance Scores
      'geekbenchScore', 'antutuScore',
    ];
    return (
      value !== undefined && value !== '' &&
      !renderedKeys.includes(key)
    );
  })
  .map(([key, value]) => (
    <div key={key}>
      <span className="font-semibold text-gray-700">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
      <p className="text-gray-600">{String(value)}</p>
    </div>
  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
