import { Gadget, UserPreferences, RecommendationResult } from "@/types/gadget";

// Category-specific scoring functions (outside the class)
function scoreSmartphone(
  gadget: any,
  preferences: any,
  specs: any,
  priorityLower: string,
  allSpecsInBudget: any[] = []
): number {
  let score = 0;
  const purpose = preferences.purpose?.toLowerCase() || '';
  let maxAntutu = 0, maxGeekbench = 0;

  // Only run performance comparison if allSpecsInBudget is provided
  if (allSpecsInBudget && allSpecsInBudget.length > 0) {
    for (const s of allSpecsInBudget) {
      if (s.antutuScore && s.antutuScore > maxAntutu) maxAntutu = s.antutuScore;
      if (s.geekbenchScore && s.geekbenchScore > maxGeekbench) maxGeekbench = s.geekbenchScore;
    }
    if (specs.antutuScore && maxAntutu > 0) {
      score += (specs.antutuScore / maxAntutu) * 0.18;
    }
    if (specs.geekbenchScore && maxGeekbench > 0) {
      score += (specs.geekbenchScore / maxGeekbench) * 0.12;
    }
  }
  if (priorityLower.includes('screen') && specs.screenSize) score += 0.15;
  if (priorityLower.includes('os') && specs.operatingSystem) score += 0.15;
  if (priorityLower.includes('network') && specs.networkType) score += 0.15;
  // Gaming/performance boost
  if (purpose.includes('gaming')) {
    if (specs.displayType && specs.displayType.toLowerCase().includes('amoled')) score += 0.15;
    if (specs.refreshRate) {
      const refresh = parseInt(specs.refreshRate);
      if (refresh >= 120) score += 0.15;
      else if (refresh >= 90) score += 0.1;
    }
    if (specs.ram) {
      const ramValue = parseInt(specs.ram);
      if (ramValue >= 12) score += 0.15;
      else if (ramValue >= 8) score += 0.1;
    }
    if (specs.storage) {
      const storageValue = parseInt(specs.storage);
      if (storageValue >= 256) score += 0.12;
      else if (storageValue >= 128) score += 0.08;
    }
    if (specs.battery) {
      const batteryValue = parseInt(specs.battery.replace(/\D/g, ''));
      if (batteryValue >= 5000) score += 0.12;
      else if (batteryValue >= 4000) score += 0.08;
    }
  }
  if (purpose.includes('photography')) {
    if (specs.camera) {
      const mpMatch = specs.camera.match(/(\d+)\s*mp/i);
      if (mpMatch && parseInt(mpMatch[1]) >= 50) score += 0.2;
      else if (mpMatch && parseInt(mpMatch[1]) >= 32) score += 0.15;
      else score += 0.1;
    }
    if (specs.opticalZoom) score += 0.1;
    if (specs.sensorSize) score += 0.1;
    if (specs.cameraFeatures && specs.cameraFeatures.toLowerCase().includes('ois')) score += 0.1;
  }
  if (purpose.includes('general')) {
    if (specs.battery) score += 0.15;
    if (specs.display) score += 0.15;
    if (specs.camera) score += 0.12;
    if (specs.ram) {
      const ramValue = parseInt(specs.ram);
      if (ramValue >= 6) score += 0.12;
      else if (ramValue >= 4) score += 0.08;
    }
    if (specs.processor) score += 0.12;
    if (specs.storage) score += 0.12;
    if (specs.operatingSystem) score += 0.08;
  }
  if (purpose.includes('entertainment')) {
    if (specs.display && specs.display.toLowerCase().includes('amoled')) score += 0.18;
    if (specs.refreshRate && parseInt(specs.refreshRate) >= 120) score += 0.12;
    if (specs.speakers && specs.speakers.toLowerCase().includes('stereo')) score += 0.12;
    if (specs.battery) score += 0.12;
    if (specs.storage && parseInt(specs.storage) >= 128) score += 0.12;
  }
  if (purpose.includes('travel')) {
    if (specs.battery) score += 0.18;
    if (specs.gps) score += 0.15;
    if (specs.networkType && specs.networkType.toLowerCase().includes('5g')) score += 0.12;
    if (specs.waterResistance) score += 0.12;
    if (specs.storage && parseInt(specs.storage) >= 128) score += 0.08;
    if (specs.dualSim) score += 0.08;
  }

  return score;
}
function scoreLaptop(gadget: any, preferences: any, specs: any, priorityLower: string): number {
  let score = 0;
  if (priorityLower.includes('graphics') || priorityLower.includes('gaming')) {
    if (specs.graphicsCardName) score += 0.2;
    if (specs.graphicsCompany) score += 0.1;
    if (specs.graphicsVRAM) score += 0.15;
    if (specs.graphicsPower) score += 0.1;
    if (specs.discreteGraphicsCard) score += 0.25;
  }
  if (priorityLower.includes('processor') || priorityLower.includes('performance')) {
    if (specs.processorCompany) score += 0.1;
    if (specs.processorGeneration) score += 0.15;
    if (specs.processorName) score += 0.15;
    if (specs.baseClockSpeed) score += 0.1;
    if (specs.turboClockSpeed) score += 0.1;
  }
  if (priorityLower.includes('storage') && specs.ssd) score += 0.15;
  if (priorityLower.includes('port') && specs.ports) score += 0.1;
  return score;
}
function scoreHeadphones(gadget: any, preferences: any, specs: any, priorityLower: string): number {
  let score = 0;
  if (priorityLower.includes('noise') && specs.noiseCancellation) score += 0.25;
  if (priorityLower.includes('driver') && specs.driverSize) score += 0.15;
  if (priorityLower.includes('design') && specs.headphoneDesign) score += 0.1;
  if (priorityLower.includes('signal') && specs.signalToNoiseRatio) score += 0.1;
  if (priorityLower.includes('reduction') && specs.noiseReduction) score += 0.1;
  if (priorityLower.includes('features') && specs.otherSoundFeatures) score += 0.15;
  if (priorityLower.includes('codec') && specs.audioCodec) score += 0.1;
  if (priorityLower.includes('bass') && specs.deepBass) score += 0.15;
  if (priorityLower.includes('technology') && specs.technologyUsed) score += 0.1;
  if (priorityLower.includes('range') && specs.wirelessRange) score += 0.1;
  return score;
}
function scoreSmartwatch(gadget: any, preferences: any, specs: any, priorityLower: string): number {
  let score = 0;
  if (priorityLower.includes('heart') && specs.heartRateMonitor) score += 0.25;
  if (priorityLower.includes('gps') && specs.gps) score += 0.25;
  if (priorityLower.includes('water') && specs.waterResistance) score += 0.15;
  return score;
}
function scoreTablet(gadget: any, preferences: any, specs: any, priorityLower: string): number {
  let score = 0;
  if (priorityLower.includes('screen') && specs.screenSize) score += 0.15;
  if (priorityLower.includes('os') && specs.operatingSystem) score += 0.15;
  // Gaming/performance boost
  if (priorityLower.includes('gaming') || priorityLower.includes('performance')) {
    if (specs.ram) {
      const ramValue = parseInt(specs.ram);
      if (ramValue >= 8) score += 0.15;
      else if (ramValue >= 6) score += 0.1;
    }
    if (specs.refreshRate) {
      const refresh = parseInt(specs.refreshRate);
      if (refresh >= 120) score += 0.1;
      else if (refresh >= 90) score += 0.05;
    }
    if (specs.geekbenchScore || specs.antutuScore) score += 0.1;
  }
  return score;
}
function scoreCamera(gadget: any, preferences: any, specs: any, priorityLower: string): number {
  let score = 0;
  if (priorityLower.includes('sensor') && specs.sensorSize) score += 0.2;
  if (priorityLower.includes('lens') && specs.lensMount) score += 0.15;
  if (priorityLower.includes('video') && specs.videoResolution) score += 0.15;
  if ((priorityLower.includes('stabilization') || priorityLower.includes('stabiliser') || priorityLower.includes('image')) && specs.imageStabilization) score += 0.15;
  return score;
}

// Charger & Cables scoring
function scoreChargerCables(gadget: any, preferences: any, specs: any, priorityLower: string): number {
  let score = 0;
  if ((priorityLower.includes('power') || priorityLower.includes('watt')) && specs.powerOutput) score += 0.2;
  if ((priorityLower.includes('fast') || priorityLower.includes('quick')) && specs.fastCharging) score += 0.2;
  if ((priorityLower.includes('connector') || priorityLower.includes('type-c') || priorityLower.includes('usb')) && specs.connectorType) score += 0.2;
  if ((priorityLower.includes('length') || priorityLower.includes('cable')) && specs.cableLength) score += 0.15;
  if ((priorityLower.includes('durability') || priorityLower.includes('material')) && specs.material) score += 0.15;
  return score;
}

// Other category generic scoring: try to match priorities against any spec value
function scoreOther(gadget: any, preferences: any, specs: any, priorityLower: string): number {
  let score = 0;
  for (const priority of preferences.priorities) {
    const p = priority.toLowerCase();
    for (const [key, value] of Object.entries(specs)) {
      if (!value) continue;
      if (key.toLowerCase().includes(p) || value.toString().toLowerCase().includes(p)) {
        score += 0.1;
        break;
      }
    }
  }
  return Math.min(0.6, score);
}

export class RecommendationEngine {
  private gadgets: Gadget[];

  constructor(gadgets: Gadget[]) {
    this.gadgets = gadgets;
  }

  // Main recommendation method
public getRecommendations(preferences: UserPreferences, limit: number = 5): RecommendationResult[] {
  const scoredGadgets: RecommendationResult[] = [];

  // Get all specs in budget for performance comparison (for smartphones)
  const allSpecsInBudget = this.gadgets
    .filter(g => g.category === preferences.category && g.price >= preferences.budget.min && g.price <= preferences.budget.max)
    .map(g => g.specifications);

  // Main scoring loop
  for (const gadget of this.gadgets) {
    if (gadget.category !== preferences.category) continue;
    if (gadget.price < preferences.budget.min || gadget.price > preferences.budget.max) continue;
    // Strict brand filter for Smartphones when brand preferences are provided
    if (
      preferences.category === 'Smartphone' &&
      preferences.brandPreferences &&
      preferences.brandPreferences.length > 0 &&
      !this.isPreferredBrand(gadget.brand, preferences.brandPreferences)
    ) {
      continue;
    }

    const specs = gadget.specifications as any;
    const priorityLower = preferences.priorities.map(p => p.toLowerCase()).join(' ');
    let score = 0;

    // Category-specific scoring
    switch (gadget.category) {
      case 'Smartphone':
        score += scoreSmartphone(gadget, preferences, specs, priorityLower, allSpecsInBudget);
        // Explicit 5G priority support
        if ((priorityLower.includes('5g') || priorityLower.includes('connectivity')) && specs.networkType && specs.networkType.toLowerCase().includes('5g')) {
          score += 0.15;
        }
        break;
      case 'Laptop':
        score += scoreLaptop(gadget, preferences, specs, priorityLower);
        break;
      case 'Headphones':
        score += scoreHeadphones(gadget, preferences, specs, priorityLower);
        if (priorityLower.includes('battery') && (specs.battery || specs.batteryLife)) score += 0.15;
        break;
      case 'Smartwatch':
        score += scoreSmartwatch(gadget, preferences, specs, priorityLower);
        if (priorityLower.includes('battery') && (specs.battery || specs.batteryLife)) score += 0.15;
        if (priorityLower.includes('display') && (specs.displayType || specs.displaySize)) score += 0.1;
        if (priorityLower.includes('notification') && specs.notifications) score += 0.1;
        break;
      case 'Tablet':
        score += scoreTablet(gadget, preferences, specs, priorityLower);
        if (priorityLower.includes('battery') && specs.battery) score += 0.12;
        if (priorityLower.includes('display') && (specs.displayType || specs.resolution)) score += 0.1;
        break;
      case 'Camera':
        score += scoreCamera(gadget, preferences, specs, priorityLower);
        break;
      case 'Charger & Cables':
        score += scoreChargerCables(gadget, preferences, specs, priorityLower);
        break;
      case 'Other':
        score += scoreOther(gadget, preferences, specs, priorityLower);
        break;
    }

    // Specific features score (based on user-provided features list)
    if (preferences.specificFeatures && preferences.specificFeatures.length > 0) {
      let matchedFeatures = 0;
      for (const feature of preferences.specificFeatures) {
        const featureLower = feature.toLowerCase();
        if (this.matchesSpecificFeature(specs, featureLower)) {
          matchedFeatures += 1;
        }
      }
      if (matchedFeatures > 0) {
        const ratio = matchedFeatures / preferences.specificFeatures.length;
        score += Math.min(0.25, ratio * 0.25);
      }
    }

    // Price, Brand, Purpose scoring
    score += this.calculatePriceScore(gadget.price, preferences.budget) * 0.25;
    score += this.calculateBrandScore(gadget.brand, preferences.brandPreferences) * 0.15;
    score += this.calculatePurposeScore(gadget, preferences.purpose) * 0.25;

    const reasons = this.getReasons(gadget, preferences);
    scoredGadgets.push({ gadget, score, reasons, matchPercentage: 0 });
  }

  // Fallback: If no gadgets in budget, expand to all in category
  if (scoredGadgets.length === 0) {
    const allSpecsInCategory = this.gadgets
      .filter(g => g.category === preferences.category)
      .map(g => g.specifications);

    for (const gadget of this.gadgets) {
      if (gadget.category !== preferences.category) continue;
      if (
        preferences.category === 'Smartphone' &&
        preferences.brandPreferences &&
        preferences.brandPreferences.length > 0 &&
        !this.isPreferredBrand(gadget.brand, preferences.brandPreferences)
      ) {
        continue;
      }

      const specs = gadget.specifications as any;
      const priorityLower = preferences.priorities.map(p => p.toLowerCase()).join(' ');
      let score = 0;

      switch (gadget.category) {
        case 'Smartphone':
          score += scoreSmartphone(gadget, preferences, specs, priorityLower, allSpecsInCategory);
          if ((priorityLower.includes('5g') || priorityLower.includes('connectivity')) && specs.networkType && specs.networkType.toLowerCase().includes('5g')) {
            score += 0.15;
          }
          break;
        case 'Laptop':
          score += scoreLaptop(gadget, preferences, specs, priorityLower);
          break;
        case 'Headphones':
          score += scoreHeadphones(gadget, preferences, specs, priorityLower);
          if (priorityLower.includes('battery') && (specs.battery || specs.batteryLife)) score += 0.15;
          break;
        case 'Smartwatch':
          score += scoreSmartwatch(gadget, preferences, specs, priorityLower);
          if (priorityLower.includes('battery') && (specs.battery || specs.batteryLife)) score += 0.15;
          if (priorityLower.includes('display') && (specs.displayType || specs.displaySize)) score += 0.1;
          if (priorityLower.includes('notification') && specs.notifications) score += 0.1;
          break;
        case 'Tablet':
          score += scoreTablet(gadget, preferences, specs, priorityLower);
          if (priorityLower.includes('battery') && specs.battery) score += 0.12;
          if (priorityLower.includes('display') && (specs.displayType || specs.resolution)) score += 0.1;
          break;
        case 'Camera':
          score += scoreCamera(gadget, preferences, specs, priorityLower);
          break;
        case 'Charger & Cables':
          score += scoreChargerCables(gadget, preferences, specs, priorityLower);
          break;
        case 'Other':
          score += scoreOther(gadget, preferences, specs, priorityLower);
          break;
      }

      if (preferences.specificFeatures && preferences.specificFeatures.length > 0) {
        let matchedFeatures = 0;
        for (const feature of preferences.specificFeatures) {
          const featureLower = feature.toLowerCase();
          if (this.matchesSpecificFeature(specs, featureLower)) {
            matchedFeatures += 1;
          }
        }
        if (matchedFeatures > 0) {
          const ratio = matchedFeatures / preferences.specificFeatures.length;
          score += Math.min(0.25, ratio * 0.25);
        }
      }

      score += this.calculatePriceScore(gadget.price, preferences.budget) * 0.25;
      score += this.calculateBrandScore(gadget.brand, preferences.brandPreferences) * 0.15;
      score += this.calculatePurposeScore(gadget, preferences.purpose) * 0.25;

      const reasons = this.getReasons(gadget, preferences);
      scoredGadgets.push({ gadget, score, reasons, matchPercentage: 0 });
    }
  }

  // Normalize and sort
  scoredGadgets.sort((a, b) => b.score - a.score);
  const maxScore = scoredGadgets[0]?.score || 1;
  for (const item of scoredGadgets) {
    item.matchPercentage = Math.round((item.score / maxScore) * 100);
  }

  return scoredGadgets.slice(0, limit);
}

  private calculateScore(gadget: Gadget, preferences: UserPreferences): number {
    let score = 0;
    const specs = gadget.specifications as any;
    const priorityLower = preferences.priorities.map(p => p.toLowerCase()).join(' ');
    // General scoring logic
    if (priorityLower.includes('processor') && specs.processor) {
      score += 0.15;
    }
    if (priorityLower.includes('display') && specs.display) {
      score += 0.15;
    }
    // Category-specific scoring
    switch (gadget.category) {
      case 'Smartphone':
        score += scoreSmartphone(gadget, preferences, specs, priorityLower);
        break;
      case 'Laptop':
        score += scoreLaptop(gadget, preferences, specs, priorityLower);
        break;
      case 'Headphones':
        score += scoreHeadphones(gadget, preferences, specs, priorityLower);
        break;
      case 'Smartwatch':
        score += scoreSmartwatch(gadget, preferences, specs, priorityLower);
        break;
      case 'Tablet':
        score += scoreTablet(gadget, preferences, specs, priorityLower);
        break;
      case 'Camera':
        score += scoreCamera(gadget, preferences, specs, priorityLower);
        break;
    }

    // Price score (closer to budget max = higher score)
    const priceScore = this.calculatePriceScore(gadget.price, preferences.budget);
    score += priceScore * 0.25; // 25% weight

    // Brand preference score
    const brandScore = this.calculateBrandScore(gadget.brand, preferences.brandPreferences);
    score += brandScore * 0.15; // 15% weight

    // Purpose match score
    const purposeScore = this.calculatePurposeScore(gadget, preferences.purpose);
    score += purposeScore * 0.25; // 25% weight

    return score;
  }

  private calculatePriceScore(price: number, budget: { min: number; max: number }): number {
    const budgetMid = (budget.min + budget.max) / 2;
    const distance = Math.abs(price - budgetMid);
    const maxDistance = budget.max - budget.min;
    
    // Higher score for prices closer to budget midpoint
    return Math.max(0, 1 - (distance / maxDistance));
  }

  private calculateBrandScore(brand: string, brandPreferences?: string[]): number {
    if (!brandPreferences || brandPreferences.length === 0) {
      return 0.5; // Neutral score if no brand preferences
    }

    const normalizedBrand = brand.toLowerCase();
    const normalizedPreferences = brandPreferences.map(b => b.toLowerCase());
    
    if (normalizedPreferences.includes(normalizedBrand)) {
      return 1.0; // Perfect match
    }

    // Check for partial matches
    for (const pref of normalizedPreferences) {
      if (normalizedBrand.includes(pref) || pref.includes(normalizedBrand)) {
        return 0.7; // Partial match
      }
    }

    return 0.3; // No match
  }

  // Helper: case-insensitive partial brand match
  private isPreferredBrand(brand: string, brandPreferences: string[]): boolean {
    if (!brand || !brandPreferences || brandPreferences.length === 0) return false;
    const brandLower = brand.toLowerCase();
    const prefs = brandPreferences.map(b => b.toLowerCase());
    return prefs.includes(brandLower) || prefs.some(pref => brandLower.includes(pref) || pref.includes(brandLower));
  }

  private matchesSpecificFeature(specs: any, featureLower: string): boolean {
    // Check direct matches
    if (specs[featureLower]) return true;
    
    // Check all specification values
    for (const [key, value] of Object.entries(specs)) {
      if (value && value.toString().toLowerCase().includes(featureLower)) {
        return true;
      }
    }

    // Enhanced matching for common terms
    const enhancedMatches: { [key: string]: string[] } = {
      'gaming': ['rtx', 'gtx', 'gaming', 'gpu', 'graphics'],
      'intel': ['intel', 'core', 'i3', 'i5', 'i7', 'i9'],
      'amd': ['amd', 'ryzen', 'r3', 'r5', 'r7', 'r9'],
      'nvidia': ['nvidia', 'rtx', 'gtx', 'mx'],
      'apple': ['apple', 'm1', 'm2', 'm3', 'a-series'],
      'ssd': ['ssd', 'nvme', 'solid state'],
      'hdd': ['hdd', 'hard disk', 'mechanical'],
      'oled': ['oled', 'amoled', 'super amoled'],
      'ips': ['ips', 'in-plane switching'],
      '5g': ['5g', '5th generation'],
      '4g': ['4g', 'lte'],
      'wifi': ['wifi', 'wireless', '802.11'],
      'bluetooth': ['bluetooth', 'bt'],
      'usb': ['usb', 'type-c', 'thunderbolt'],
      'hdmi': ['hdmi', 'displayport'],
      'wireless': ['wireless', 'bluetooth', 'wifi'],
      'noise': ['noise cancellation', 'anc', 'active noise'],
      'water': ['water resistance', 'waterproof', 'ip'],
      'gps': ['gps', 'global positioning'],
      'heart': ['heart rate', 'hr', 'pulse'],
      'camera': ['camera', 'mp', 'megapixel', 'sensor'],
      'battery': ['battery', 'mah', 'milliampere'],
      'fast': ['fast charging', 'quick charge', 'pd'],
    };

    for (const [term, matches] of Object.entries(enhancedMatches)) {
      if (featureLower.includes(term)) {
        for (const match of matches) {
          for (const [key, value] of Object.entries(specs)) {
            if (value && value.toString().toLowerCase().includes(match)) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  private calculatePurposeScore(gadget: Gadget, purpose: string): number {
    const purposeLower = purpose.toLowerCase();
    const specs = gadget.specifications as any; // Type assertion for flexibility - TODO: Improve type safety

    // Gaming
    if (purposeLower.includes('gaming') || purposeLower.includes('game')) {
      let score = 0;
      
      // Check for gaming-specific graphics
      if (specs.graphicsCardName) {
        const gpuName = specs.graphicsCardName.toLowerCase();
        if (gpuName.includes('rtx') || gpuName.includes('gtx') || gpuName.includes('rx')) {
          score += 0.4;
        }
      }
      
      // Check for gaming processors
      if (specs.processorName) {
        const cpuName = specs.processorName.toLowerCase();
        if (cpuName.includes('i7') || cpuName.includes('i9') || cpuName.includes('r7') || cpuName.includes('r9')) {
          score += 0.3;
        }
      }
      
      // Check RAM for gaming
      if (specs.ram) {
        const ramValue = parseInt(specs.ram);
        if (ramValue >= 16) score += 0.2;
        else if (ramValue >= 8) score += 0.1;
      }
      
      return Math.min(1, score + 0.1); // Base score for gaming purpose
    }

    // Photography
    if (purposeLower.includes('photo') || purposeLower.includes('camera')) {
      if (specs.camera || specs.sensorSize) {
        return 1.0;
      }
      if (gadget.category === 'Camera') {
        return 0.9;
      }
      return 0.6;
    }

    // Work/Professional
    if (purposeLower.includes('work') || purposeLower.includes('professional')) {
      let score = 0;
      
      // Check for professional processors
      if (specs.processorName) {
        const cpuName = specs.processorName.toLowerCase();
        if (cpuName.includes('i7') || cpuName.includes('i9') || cpuName.includes('r7') || cpuName.includes('r9')) {
          score += 0.4;
        }
      }
      
      // Check for sufficient RAM
      if (specs.ram) {
        const ramValue = parseInt(specs.ram);
        if (ramValue >= 16) score += 0.3;
        else if (ramValue >= 8) score += 0.2;
      }
      
      // Check for good storage
      if (specs.storage) {
        const storageText = specs.storage.toLowerCase();
        if (storageText.includes('ssd') || storageText.includes('nvme')) {
          score += 0.2;
        }
      }
      
      return Math.min(1, score + 0.1);
    }

    // Entertainment
    if (purposeLower.includes('entertainment') || purposeLower.includes('media')) {
      let score = 0;
      
      if (specs.display) score += 0.3;
      if (specs.storage) score += 0.2;
      if (specs.battery) score += 0.2;
      
      // Check for good display specs
      if (specs.display) {
        const displayText = specs.display.toLowerCase();
        if (displayText.includes('oled') || displayText.includes('amoled')) {
          score += 0.2;
        }
      }
      
      return Math.min(1, score + 0.1);
    }

    // Fitness/Health
    if (purposeLower.includes('fitness') || purposeLower.includes('health')) {
      if (specs.heartRateMonitor || specs.gps) {
        return 1.0;
      }
      if (gadget.category === 'Smartwatch') {
        return 0.8;
      }
      return 0.5;
    }

    // Music
    if (purposeLower.includes('music') || purposeLower.includes('audio')) {
      if (gadget.category === 'Headphones') {
        return 1.0;
      }
      if (specs.frequencyResponse || specs.driverSize) {
        return 0.9;
      }
      return 0.6;
    }

    return 0.5; // Default neutral score
  }

  private getReasons(gadget: Gadget, preferences: UserPreferences): string[] {
    const reasons: string[] = [];
    const specs = gadget.specifications as any; // Type assertion for flexibility - TODO: Improve type safety

    // Price reason
    if (gadget.price <= preferences.budget.max && gadget.price >= preferences.budget.min) {
      reasons.push(`Fits your budget of ₹${preferences.budget.min.toLocaleString('en-IN')}-₹${preferences.budget.max.toLocaleString('en-IN')}`);
    }

    // Brand reason (case-insensitive with partial match support)
    const brandPrefs = preferences.brandPreferences?.map(b => b.toLowerCase()) || [];
    if (brandPrefs.length > 0) {
      const brandLower = gadget.brand.toLowerCase();
      const isPreferredBrand = brandPrefs.includes(brandLower) || brandPrefs.some(pref => brandLower.includes(pref) || pref.includes(brandLower));
      if (isPreferredBrand) {
        reasons.push(`Matches your preferred brand: ${gadget.brand}`);
      }
    }

    // Enhanced feature reasons based on category
    switch (gadget.category) {
      case 'Laptop':
        reasonsLaptop(specs, preferences, reasons);
        break;
      case 'Smartphone':
        reasonsSmartphone(specs, preferences, reasons);
        break;
      case 'Headphones':
        reasonsHeadphones(specs, preferences, reasons);
        break;
      case 'Smartwatch':
        reasonsSmartwatch(specs, preferences, reasons);
        break;
      case 'Charger & Cables':
        reasonsChargerCables(specs, preferences, reasons);
        break;
      default:
        // Generic feature reasons
        for (const priority of preferences.priorities) {
          const priorityLower = priority.toLowerCase();
          
          if (priorityLower.includes('battery') && specs.battery) {
            reasons.push(`Good battery: ${specs.battery}`);
          }
          if (priorityLower.includes('camera') && specs.camera) {
            reasons.push(`Excellent camera: ${specs.camera}`);
          }
          if (priorityLower.includes('storage') && specs.storage) {
            reasons.push(`Ample storage: ${specs.storage}`);
          }
          if (priorityLower.includes('ram') && specs.ram) {
            reasons.push(`Sufficient RAM: ${specs.ram}`);
          }
        }
    }

    // Specific feature reasons (limit to 1-2)
    if (preferences.specificFeatures && preferences.specificFeatures.length > 0) {
      const matched: string[] = [];
      for (const feature of preferences.specificFeatures) {
        const featureLower = feature.toLowerCase();
        if (this.matchesSpecificFeature(specs, featureLower)) {
          matched.push(feature);
        }
        if (matched.length >= 2) break;
      }
      for (const f of matched) {
        reasons.push(`Has ${f}`);
      }
    }

    // Purpose-specific reasons
    const purposeLower = preferences.purpose.toLowerCase();
    if (purposeLower.includes('gaming')) {
      if (specs.graphicsCardName) {
        reasons.push(`Perfect for gaming with ${specs.graphicsCardName}`);
      } else if (specs.processorName) {
        reasons.push(`Great for gaming with ${specs.processorName}`);
      }
    }
    if (purposeLower.includes('photo') && specs.camera) {
      reasons.push("Great for photography");
    }
    if (purposeLower.includes('work') && specs.processorName) {
      reasons.push(`Excellent for work with ${specs.processorName}`);
    }

    // Performance scores
    if (specs.geekbenchScore) {
      reasons.push(`High performance: Geekbench ${specs.geekbenchScore}`);
    }

    return reasons.slice(0, 3); // Limit to top 3 reasons
  }
}

// Category-specific reasons functions (outside the class)
function reasonsLaptop(specs: any, preferences: any, reasons: string[]): void {
  if (specs.processorCompany && specs.processorName) {
    reasons.push(`Powerful ${specs.processorCompany} ${specs.processorName} processor`);
  }
  if (specs.graphicsCardName) {
    reasons.push(`Dedicated ${specs.graphicsCardName} graphics`);
  }
  if (specs.discreteGraphicsCard) {
    reasons.push(`Discrete graphics card for better performance`);
  }
  if (specs.ram) {
    reasons.push(`${specs.ram} RAM for smooth performance`);
  }
  if (specs.ssd) {
    reasons.push(`Fast SSD storage`);
  }
}
function reasonsSmartphone(specs: any, preferences: any, reasons: string[]): void {
  const purpose = preferences.purpose?.toLowerCase() || '';
  if (purpose.includes('photography')) {
    if (specs.camera) reasons.push(`Excellent camera: ${specs.camera}`);
    if (specs.opticalZoom) reasons.push(`Optical zoom for detailed shots`);
    if (specs.sensorSize) reasons.push(`Large sensor size for better image quality`);
    if (specs.cameraFeatures && specs.cameraFeatures.toLowerCase().includes('ois')) {
      reasons.push(`Optical Image Stabilization for sharp photos`);
    }
  } else if (purpose.includes('general')) {
    if (specs.battery) reasons.push(`Reliable battery life: ${specs.battery}`);
    if (specs.display) reasons.push(`Good display quality: ${specs.display}`);
    if (specs.camera) reasons.push(`Decent camera: ${specs.camera}`);
    if (specs.ram) reasons.push(`Smooth multitasking with ${specs.ram} RAM`);
  } else if (purpose.includes('entertainment')) {
    if (specs.display) reasons.push(`Vivid display: ${specs.display}`);
    if (specs.refreshRate) reasons.push(`Smooth ${specs.refreshRate}Hz refresh rate`);
    if (specs.speakers && specs.speakers.toLowerCase().includes('stereo')) reasons.push('Stereo speakers for immersive sound');
    if (specs.battery) reasons.push(`Long battery life: ${specs.battery}`);
    if (specs.storage) reasons.push(`Large storage: ${specs.storage}`);
  } else if (purpose.includes('travel')) {
    if (specs.battery) reasons.push(`Long battery life for travel: ${specs.battery}`);
    if (specs.gps) reasons.push('Built-in GPS for navigation');
    if (specs.networkType && specs.networkType.toLowerCase().includes('5g')) reasons.push('5G support for fast connectivity');
    if (specs.waterResistance) reasons.push(`Water resistance: ${specs.waterResistance}`);
    if (specs.dualSim) reasons.push('Dual SIM for international travel');
  } else {
    if (specs.camera) reasons.push(`Excellent camera: ${specs.camera}`);
    if (specs.battery) reasons.push(`Long battery life: ${specs.battery}`);
    if (specs.screenSize) reasons.push(`${specs.screenSize} display`);
  }
}
function reasonsHeadphones(specs: any, preferences: any, reasons: string[]): void {
  if (specs.noiseCancellation) {
    reasons.push('Active noise cancellation');
  }
  if (specs.driverSize) {
    reasons.push(`${specs.driverSize} drivers for quality sound`);
  }
  if (specs.headphoneDesign) {
    reasons.push(`${specs.headphoneDesign} design`);
  }
  if (specs.signalToNoiseRatio) {
    reasons.push(`Signal to Noise Ratio: ${specs.signalToNoiseRatio}`);
  }
  if (specs.audioCodec) {
    reasons.push(`Audio Codec: ${specs.audioCodec}`);
  }
  if (specs.deepBass) {
    reasons.push('Deep bass enhancement');
  }
  if (specs.wirelessRange) {
    reasons.push(`Wireless range: ${specs.wirelessRange}`);
  }
}
function reasonsSmartwatch(specs: any, preferences: any, reasons: string[]): void {
  if (specs.heartRateMonitor) {
    reasons.push('Heart rate monitoring');
  }
  if (specs.gps) {
    reasons.push('GPS tracking');
  }
  if (specs.waterResistance) {
    reasons.push(`Water resistance: ${specs.waterResistance}`);
  }
  if (specs.battery) {
    reasons.push(`Battery: ${specs.battery}`);
  }
}
function reasonsChargerCables(specs: any, preferences: any, reasons: string[]): void {
  if (specs.fastCharging) reasons.push('Supports fast charging');
  if (specs.powerOutput) reasons.push(`Power output: ${specs.powerOutput}`);
  if (specs.connectorType) reasons.push(`Connector: ${specs.connectorType}`);
}
