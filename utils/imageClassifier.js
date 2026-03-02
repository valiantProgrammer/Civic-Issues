import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;

/**
 * Load the MobileNet model (one-time load, reused across requests)
 */
async function loadModel() {
  if (model) return model;
  
  try {
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0
    });
    console.log('MobileNet model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load MobileNet model:', error);
    throw error;
  }
}

/**
 * Category mapping from ImageNet labels to Civic Issue categories
 * Helps match detected objects to the reporting categories
 */
const categoryMapping = {
  'Waste Management & Sanitation': [
    'garbage dump', 'trash', 'waste', 'dumpster', 'landfill', 'rubbish',
    'refuse', 'litter', 'waste bin', 'waste basket', 'heap', 'pile',
    'dust', 'dirt', 'debris', 'scrap', 'junk'
  ],
  'Water Supply & Drainage': [
    'water', 'pipe', 'drain', 'drainage', 'water supply', 'hydrant',
    'faucet', 'tap', 'sewer', 'gutter', 'trench', 'puddle', 'waterlog',
    'flooded', 'swamp', 'overflow'
  ],
  'Road & Transport Issues': [
    'road', 'highway', 'pothole', 'pavement', 'asphalt', 'concrete',
    'traffic', 'vehicle', 'truck', 'car', 'motorcycle', 'bicycle',
    'bridge', 'overpass', 'underpass', 'streetcar', 'bus', 'rail',
    'cracked', 'damaged', 'broken', 'hole', 'patch'
  ],
  'Streetlight & Public Utility Maintenance': [
    'street light', 'lamppost', 'lamp', 'light', 'street lamp',
    'utility pole', 'power line', 'transmission', 'electrical',
    'cable', 'wire', 'post', 'pole'
  ],
  'Sanitation & Hygiene': [
    'toilet', 'restroom', 'bathroom', 'latrine', 'sewage', 'hygiene',
    'sanitation', 'waste', 'garbage'
  ],
  'Parks & Green Spaces': [
    'park', 'garden', 'tree', 'vegetation', 'grass', 'lawn',
    'green', 'plant', 'bush', 'shrub', 'forest'
  ],
  'Public Buildings & Infrastructure': [
    'building', 'school', 'hospital', 'office', 'structure',
    'construction', 'wall', 'roof', 'floor', 'concrete'
  ]
};

/**
 * Classify an image using MobileNet and map to civic categories
 * @param {HTMLImageElement | string} imageInput - Image element or URL
 * @param {string} selectedCategory - The category chosen by the user
 * @returns {Promise<{isMatch: boolean, reason: string, confidence: number, predictions: Array}>}
 */
export async function classifyImage(imageInput, selectedCategory) {
  try {
    // Load model if not already loaded
    const loadedModel = await loadModel();

    // Convert image URL to HTML image element if needed
    let imageElement = imageInput;
    if (typeof imageInput === 'string') {
      imageElement = new Image();
      imageElement.crossOrigin = 'anonymous';
      imageElement.src = imageInput;
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        imageElement.onload = resolve;
        imageElement.onerror = reject;
      });
    }

    // Classify the image
    const predictions = await loadedModel.classify(imageElement);

    // Extract labels and convert to lowercase for comparison
    const detectedLabels = predictions.map(p => p.className.toLowerCase());
    const detectedKeywords = new Set();

    predictions.forEach(pred => {
      const label = pred.className.toLowerCase();
      // Split multi-word labels and add individual words
      label.split(' ').forEach(word => {
        if (word.length > 2) {
          detectedKeywords.add(word);
        }
      });
      // Add full label
      detectedKeywords.add(label);
    });

    // Check if any detected keywords match the selected category
    const categoryKeywords = categoryMapping[selectedCategory] || [];
    const matches = categoryKeywords.filter(kw => 
      detectedKeywords.has(kw.toLowerCase()) || 
      detectedLabels.some(label => label.includes(kw.toLowerCase()))
    );

    const isMatch = matches.length > 0;
    const confidence = isMatch ? predictions[0].probability : 0;

    let reason = '';
    if (isMatch) {
      reason = `Detected: ${matches.slice(0, 2).join(', ')} - Matches ${selectedCategory}`;
    } else {
      reason = `Image shows: ${detectedLabels.slice(0, 2).join(', ')} - Doesn't clearly match ${selectedCategory}`;
    }

    return {
      isMatch,
      reason,
      confidence,
      predictions: predictions.slice(0, 3), // Top 3 predictions
      detectedObjects: Array.from(detectedKeywords).slice(0, 5)
    };
  } catch (error) {
    console.error('Error in image classification:', error);
    throw error;
  }
}

/**
 * Get the MobileNet model (useful for cleanup)
 */
export function getModel() {
  return model;
}

/**
 * Dispose of the model to free up memory (optional)
 */
export function disposeModel() {
  if (model) {
    model.dispose();
    model = null;
  }
}
