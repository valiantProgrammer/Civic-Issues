import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import crypto from 'crypto';

// --- Step 1: Initialize the Gemini AI Model ---
// It's crucial to initialize this outside the handler so it's reused across requests.
// Ensure you have GEMINI_API_KEY in your .env.local file.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use gemini-2.0-flash as the model (latest and fastest)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- Simple In-Memory Cache to Reduce API Calls ---
// Caches verification results by imageUrl+category combination
const verificationCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCacheKey(imageUrl, category) {
  return crypto.createHash('sha256').update(`${imageUrl}${category}`).digest('hex');
}

function getFromCache(imageUrl, category) {
  const key = getCacheKey(imageUrl, category);
  const cached = verificationCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Cache hit for', category);
    return cached.data;
  }
  
  // Remove expired cache entry
  if (cached) {
    verificationCache.delete(key);
  }
  return null;
}

function saveToCache(imageUrl, category, data) {
  const key = getCacheKey(imageUrl, category);
  verificationCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * --- Step 2: Helper Function to Process the Image ---
 * This function fetches an image from a public URL, converts it to a Buffer,
 * and then to a base64 string, which is the format Gemini requires for image input.
 * @param {string} url The public URL of the image to fetch.
 * @param {string} mimeType The MIME type of the image (e.g., "image/jpeg").
 * @returns {Promise<{inlineData: {data: string, mimeType: string}}>} A promise that resolves to a Gemini-compatible image object.
 */
async function urlToGenerativePart(url, mimeType) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }
    // Convert the image response body into a Buffer
    const buffer = await response.buffer();
    // Convert the Buffer to a base64 string and return in the required format
    return {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType,
      },
    };
  } catch (error) {
    console.error("Error fetching or processing image URL:", error);
    throw error; // Propagate the error to be caught by the main handler
  }
}

// --- Step 4: The Main API Handler for the POST method ---
export async function POST(request) {
  try {
    // In the App Router, we get the body by awaiting request.json()
    const { imageUrl, category } = await request.json();

    // Validate that the required data was sent from the frontend
    if (!imageUrl || !category) {
      return NextResponse.json(
        { message: 'Missing required fields: imageUrl and category' },
        { status: 400 }
      );
    }

    // --- Check Cache First ---
    const cachedResult = getFromCache(imageUrl, category);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    // --- Step 5: Construct the Prompt for Gemini ---
    const prompt = `
      You are an AI moderator for a civic issue reporting application.
      Your task is to determine if an uploaded image is relevant to a user-selected category.
      The category is: "${category}".

      Analyze the provided image and respond ONLY with a valid JSON object. Do not include any other text, greetings, or explanations outside of the JSON structure.
      The JSON object must have exactly two keys:
      1. "is_match": a boolean value (true if the image's content clearly relates to the category, otherwise false).
      2. "reason": a brief, user-friendly string (5-15 words) explaining your decision. For example, "Image shows a pile of garbage, matching the waste category." or "Image does not appear to show any road or transport issues."
    `;

    // --- Step 6: Prepare the Image and Call the API ---
    const imagePart = await urlToGenerativePart(imageUrl, "image/jpeg");

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const rawText = response.text();

    // --- Step 7: Clean and Parse the AI's Response ---
    const cleanedText = rawText.trim().replace(/^```json\s*|```$/g, '');
    console.log(cleanedText)
    let verificationResult;
    try {
      verificationResult = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse Gemini's JSON response. Raw text:", rawText);
      throw new Error("AI verification failed to return valid data.");
    }

    const finalResult = {
      isMatch: verificationResult.is_match,
      reason: verificationResult.reason
    };

    // --- Save to Cache ---
    saveToCache(imageUrl, category, finalResult);

    // --- Step 8: Send the Final Response to the Frontend ---
    return NextResponse.json(finalResult);

  } catch (error) {
    // Catch any errors from the entire process
    console.error('Error in /api/verify-image-category:', error);
    
    // Log more detailed error info to help with debugging
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.statusCode) {
      console.error('API status code:', error.statusCode);
    }

    // --- Handle Rate Limit (429) Gracefully ---
    // If API quota is exceeded, allow the image anyway but flag it for manual review
    if (error.message && error.message.includes('429')) {
      console.warn('Gemini API rate limit exceeded. Allowing image with caution flag.');
      return NextResponse.json({
        isMatch: true,
        reason: 'API verification unavailable - image accepted for review',
        cautionFlag: true,
        note: 'Manual verification recommended due to API quota limits'
      }, { status: 200 });
    }
    
    return NextResponse.json(
      { 
        message: 'An internal error occurred during image verification.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}