"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAllGadgets } from "@/lib/firebase-utils";
import { RecommendationEngine } from "@/lib/recommendation-engine";
import { Gadget, GadgetCategory, UserPreferences, RecommendationResult } from "@/types/gadget";

export default function GadgetGuru() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [recoLoading, setRecoLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    category: "Smartphone",
    budget: { min: 0, max: 50000 },
    purpose: "",
    priorities: [],
    brandPreferences: [],
    specificFeatures: [],
  });

  const categories: GadgetCategory[] = [
    "Smartphone", "Laptop", "Headphones", "Smartwatch", 
    "Tablet", "Camera", "Charger & Cables", "Other"
  ];

  const priorityOptions = [
    "Battery Life", "Camera Quality", "Storage Capacity", "RAM", 
    "Processor Speed", "Display Quality", "Build Quality", "Performance"
  ];

  const purposeOptions = [
    "Gaming", "Photography", "Work/Professional", "Entertainment", 
    "Fitness/Health", "Music/Audio", "General Use", "Travel"
  ];

  const features = [
    {
      icon: "🎯",
      title: "AI-Powered Recommendations",
      description: "Get personalized gadget suggestions based on your specific needs and preferences"
    },
    {
      icon: "⚡",
      title: "Instant Results",
      description: "Receive recommendations in seconds with our advanced matching algorithm"
    },
    {
      icon: "📊",
      title: "Detailed Comparisons",
      description: "Compare specifications, prices, and features to make informed decisions"
    },
    {
      icon: "🛡️",
      title: "Trusted Reviews",
      description: "Access comprehensive reviews and ratings from real users"
    }
  ];

  useEffect(() => {
    fetchGadgets();
  }, []);

  // If ?from=recommendations, scroll to recommendations and show them
  useEffect(() => {
    if (searchParams.get('from') === 'recommendations') {
      setShowRecommendations(true);
      setTimeout(() => {
        recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [searchParams]);

  const fetchGadgets = async () => {
    try {
      setLoading(true);
      const data = await getAllGadgets();
      setGadgets(data);
    } catch (error) {
      console.error("Error fetching gadgets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize recommendations
  const memoizedRecommendations = useMemo(() => {
    if (!showRecommendations || gadgets.length === 0) return [];
    const engine = new RecommendationEngine(gadgets);
    return engine.getRecommendations(preferences, 5);
    // eslint-disable-next-line
  }, [showRecommendations, gadgets, JSON.stringify(preferences)]);

  // When user clicks Get Recommendations
  const handleGetRecommendations = () => {
    if (gadgets.length === 0) return;
    setRecoLoading(true);
    setShowRecommendations(true);
    setTimeout(() => {
      setRecommendations(memoizedRecommendations);
      setRecoLoading(false);
      recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300); // Simulate loading
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      priorities: checked 
        ? [...prev.priorities, priority]
        : prev.priorities.filter(p => p !== priority)
    }));
  };

  const handleBudgetChange = (values: number[]) => {
    setPreferences(prev => ({
      ...prev,
      budget: { min: values[0], max: values[1] }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">G</span>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GadgetGuru
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gadget Match
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Discover the ideal gadget for your needs with our AI-powered recommendation engine. 
              Get personalized suggestions based on your preferences, budget, and lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                size="lg"
                onClick={() => recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Get Started
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-4">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg mx-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{gadgets.length}+</div>
                <div className="text-sm sm:text-base text-gray-600">Gadgets Available</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">8</div>
                <div className="text-sm sm:text-base text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">95%</div>
                <div className="text-sm sm:text-base text-gray-600">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" ref={recommendationsRef}>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get Personalized Recommendations</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Tell us about your preferences and we&apos;ll find the perfect gadgets for you
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Preferences Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl order-2 xl:order-1">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl sm:text-2xl">Your Preferences</CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base">
                Fill in your preferences to get personalized gadget recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              {/* Category Selection */}
              <div>
                <Label htmlFor="category" className="text-base sm:text-lg font-medium text-gray-900">
                  What type of gadget are you looking for?
                </Label>
                <Select
                  value={preferences.category}
                  onValueChange={(value) => setPreferences(prev => ({ 
                    ...prev, 
                    category: value as GadgetCategory 
                  }))}
                >
                  <SelectTrigger className="mt-2 h-10 sm:h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Range */}
              <div>
                <Label className="text-base sm:text-lg font-medium text-gray-900">What&apos;s your budget range?</Label>
                <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                  <Slider
                    value={[preferences.budget.min, preferences.budget.max]}
                    onValueChange={handleBudgetChange}
                    max={200000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm sm:text-lg font-semibold text-gray-700">
                    <span>₹{preferences.budget.min.toLocaleString('en-IN')}</span>
                    <span>₹{preferences.budget.max.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <Label className="text-base sm:text-lg font-medium text-gray-900">What will you use it for?</Label>
                <RadioGroup
                  value={preferences.purpose}
                  onValueChange={(value) => setPreferences(prev => ({ 
                    ...prev, 
                    purpose: value 
                  }))}
                  className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
                >
                  {purposeOptions.map((purpose) => (
                    <div key={purpose} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={purpose} id={purpose} />
                      <Label htmlFor={purpose} className="text-xs sm:text-sm font-medium cursor-pointer">{purpose}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Priorities */}
              <div>
                <Label className="text-base sm:text-lg font-medium text-gray-900">What are your priorities?</Label>
                <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {priorityOptions.map((priority) => (
                    <div key={priority} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={priority}
                        checked={preferences.priorities.includes(priority)}
                        onChange={(e) => handlePriorityChange(priority, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor={priority} className="text-xs sm:text-sm font-medium cursor-pointer">{priority}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Preferences */}
              <div>
                <Label htmlFor="brands" className="text-base sm:text-lg font-medium text-gray-900">Preferred brands (optional)</Label>
                <Input
                  id="brands"
                  placeholder="e.g., Apple, Samsung, Sony"
                  value={preferences.brandPreferences?.join(", ") || ""}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    brandPreferences: e.target.value.split(",").map(b => b.trim()).filter(b => b)
                  }))}
                  className="mt-2 h-10 sm:h-12"
                />
              </div>

              {/* Specific Features */}
              <div>
                <Label htmlFor="features" className="text-base sm:text-lg font-medium text-gray-900">Specific features you want (optional)</Label>
                <Textarea
                  id="features"
                  placeholder="e.g., wireless charging, 5G, noise cancellation"
                  value={preferences.specificFeatures?.join(", ") || ""}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    specificFeatures: e.target.value.split(",").map(f => f.trim()).filter(f => f)
                  }))}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={handleGetRecommendations}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-base sm:text-lg font-semibold"
                disabled={loading || !preferences.purpose}
              >
                {recoLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
            {showRecommendations && (
              <>
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your Personalized Recommendations</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Based on your preferences, here are the best matches</p>
                </div>

                {memoizedRecommendations.map((result, index) => (
                  <Card 
                    key={result.gadget.id} 
                    className="relative cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
                    onClick={() => router.push(`/gadget/${result.gadget.id}?from=recommendations`)}
                  >
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                        {result.matchPercentage}% Match
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {result.gadget.images && result.gadget.images.length > 0 && (
                          <div className="relative flex-shrink-0">
                            <img
                              src={result.gadget.images[0]}
                              alt={result.gadget.name}
                              className="w-full sm:w-32 h-32 sm:h-32 object-cover rounded-lg sm:rounded-xl shadow-lg"
                            />
                            <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              #{index + 1}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">{result.gadget.name}</h3>
                          <p className="text-gray-600 mb-2 sm:mb-3 font-medium text-sm sm:text-base">{result.gadget.brand}</p>
                          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                            ₹{result.gadget.price.toLocaleString('en-IN')}
                          </p>
                          
                          <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                            {result.reasons.slice(0, 3).map((reason, idx) => (
                              <p key={idx} className="text-xs sm:text-sm text-gray-600 flex items-start">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                <span className="line-clamp-2">{reason}</span>
                              </p>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs sm:text-sm">
                              {result.gadget.category}
                            </Badge>
                            <p className="text-xs sm:text-sm text-blue-600 font-semibold flex items-center">
                              View Details
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {memoizedRecommendations.length === 0 && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0">
                    <CardContent className="p-8 sm:p-12 text-center">
                      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">No matches found</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Try adjusting your preferences or budget to find more options.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!showRecommendations && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8 sm:p-12 lg:p-16 text-center">
                  <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🤖</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to find your perfect gadget?</h3>
                  <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
                    Fill out the form to get personalized recommendations based on your needs and preferences.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🎯</div>
                      <p className="text-xs sm:text-sm text-gray-600">AI-Powered</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-2">⚡</div>
                      <p className="text-xs sm:text-sm text-gray-600">Instant Results</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💡</div>
                      <p className="text-xs sm:text-sm text-gray-600">Smart Matching</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
