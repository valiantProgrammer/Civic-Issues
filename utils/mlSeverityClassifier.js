/**
 * ML-based Severity Classifier for Civic Issues
 * Uses object detection patterns to classify image severity
 * Maps detected objects/conditions to severity levels
 */

// Severity mapping based on detected objects and conditions
const SEVERITY_PATTERNS = {
  HIGH: {
    keywords: [
      'pothole', 'road damage', 'collapsed', 'collapse', 'broken road',
      'severe damage', 'flooding', 'flood', 'major damage', 'severe',
      'broken pipe', 'water leak', 'gas leak', 'fire', 'accident',
      'debris', 'rubble', 'major crack', 'sinkhole', 'structural damage',
      'completely damaged', 'destroyed', 'hazardous', 'danger', 'blocked',
      'major obstruction', 'severe corruption', 'washout'
    ],
    confidence: 0.85
  },
  MEDIUM: {
    keywords: [
      'crack', 'damage', 'broken', 'waste', 'rubbish', 'garbage',
      'street light broken', 'light out', 'water stain', 'minor damage',
      'deteriorating', 'worn', 'maintenance needed', 'minor crack',
      'small leak', 'partial blockage', 'loose', 'deterioration',
      'uneven road', 'bumpy', 'patch', 'minor issue', 'litter'
    ],
    confidence: 0.60
  },
  LOW: {
    keywords: [
      'dirty', 'dusty', 'unkempt', 'messy', 'needs cleaning', 'aesthetic',
      'grass overgrown', 'weeds', 'paint fading', 'minor wear', 'minor stain',
      'discoloration', 'small litter', 'cleanliness', 'appearance', 'cosmetic'
    ],
    confidence: 0.40
  }
};

/**
 * Convert severity key to title case for database storage
 * @param {string} severity - 'HIGH', 'MEDIUM', or 'LOW'
 * @returns {string} - 'High', 'Medium', or 'Low'
 */
function convertToTitleCase(severity) {
  const mapping = {
    'HIGH': 'High',
    'MEDIUM': 'Medium',
    'LOW': 'Low'
  };
  return mapping[severity.toUpperCase()] || 'Medium';
}

/**
 * Analyze image metadata and description to predict severity
 * @param {string} description - User description of the issue
 * @param {string} category - Category of the civic issue
 * @param {string} title - Title of the report
 * @returns {object} - {severity: 'High'|'Medium'|'Low', confidence: 0-1, details: string}
 */
export function classifySeverityFromDescription(description, category, title) {
  const text = `${title} ${description} ${category}`.toLowerCase();
  
  let maxSeverity = 'LOW';
  let maxConfidence = 0;
  let matchedKeywords = [];

  // Check against severity patterns
  for (const [severity, pattern] of Object.entries(SEVERITY_PATTERNS)) {
    for (const keyword of pattern.keywords) {
      if (text.includes(keyword)) {
        matchedKeywords.push(keyword);
        if (pattern.confidence > maxConfidence) {
          maxConfidence = pattern.confidence;
          maxSeverity = severity;
        }
      }
    }
  }

  // Boost severity based on category patterns
  if (category.toLowerCase().includes('road') || category.toLowerCase().includes('transport')) {
    maxConfidence = Math.min(1, maxConfidence + 0.1);
  }
  if (category.toLowerCase().includes('safety') || category.toLowerCase().includes('hazard')) {
    maxSeverity = 'HIGH';
    maxConfidence = Math.min(1, maxConfidence + 0.2);
  }

  return {
    severity: convertToTitleCase(maxSeverity),
    confidence: Number(maxConfidence.toFixed(2)),
    matchedKeywords: matchedKeywords.slice(0, 5), // Top 5 matches
    details: `Detected keywords: ${matchedKeywords.slice(0, 3).join(', ') || 'standard issue'}`
  };
}

/**
 * Map category to expected severity range
 * @param {string} category - Issue category
 * @returns {object} - {minSeverity, recommendedSeverity, maxSeverity} in title case
 */
export function getExpectedSeverityRange(category) {
  const categoryLower = category.toLowerCase();

  const ranges = {
    'road': { min: 'Medium', recommended: 'High', max: 'High' },
    'water': { min: 'Low', recommended: 'Medium', max: 'High' },
    'sanitation': { min: 'Low', recommended: 'Medium', max: 'High' },
    'streetlight': { min: 'Low', recommended: 'Medium', max: 'Medium' },
    'waste': { min: 'Low', recommended: 'Medium', max: 'High' },
    'utility': { min: 'Medium', recommended: 'Medium', max: 'High' },
    'safety': { min: 'Medium', recommended: 'High', max: 'High' }
  };

  // Find matching range
  for (const [key, value] of Object.entries(ranges)) {
    if (categoryLower.includes(key)) {
      return value;
    }
  }

  return { min: 'Low', recommended: 'Medium', max: 'High' };
}

/**
 * Convert severity string to numeric value for comparison
 * Handles both uppercase (HIGH, MEDIUM, LOW) and lowercase (high, medium, low) and title case (High, Medium, Low)
 * @param {string} severity - 'low', 'medium', 'high', 'LOW', 'MEDIUM', 'HIGH', 'Low', 'Medium', 'High'
 * @returns {number} - 1 (low), 2 (medium), 3 (high)
 */
export function severityToNumber(severity) {
  const mapping = {
    'low': 1,
    'medium': 2,
    'high': 3
  };
  return mapping[severity?.toLowerCase()] || 0;
}

/**
 * Compare ML-predicted severity with user-given severity
 * Returns validation result based on business logic
 * 
 * @param {string} mlSeverity - ML model predicted severity (High/Medium/Low)
 * @param {string} userSeverity - User provided severity (High/Medium/Low)
 * @param {number} mlConfidence - ML model confidence (0-1)
 * @returns {object} - {
 *   aiVerified: boolean,
 *   finalSeverity: string,
 *   reason: string,
 *   warning: string|null,
 *   details: object
 * }
 * 
 * LOGIC:
 * - If user severity < ML severity: aiVerified = FALSE (don't trust user's lower severity)
 * - If user severity >= ML severity: aiVerified = TRUE (trust the stricter one)
 * - Final severity = whichever is higher (use ML model's stricter assessment)
 */
export function compareSeverities(mlSeverity, userSeverity, mlConfidence = 0.7) {
  const mlValue = severityToNumber(mlSeverity);
  const userValue = severityToNumber(userSeverity);
  
  // Normalize to title case for consistency
  const normalizedMl = convertToTitleCase(mlSeverity);
  const normalizedUser = convertToTitleCase(userSeverity);

  let aiVerified = false;
  let finalSeverity = normalizedUser; // Default to user's choice
  let reason = '';
  let warning = null;

  // ML model gives higher severity
  if (mlValue > userValue) {
    aiVerified = false;
    finalSeverity = normalizedMl; // Override with ML prediction
    reason = `ML model detected ${normalizedMl} severity (confidence: ${mlConfidence}), but user reported ${normalizedUser}. This discrepancy requires manual verification.`;
    warning = `Severity mismatch detected: ML suggests ${normalizedMl} but user selected ${normalizedUser}. Please review before approval.`;
  }
  // ML and user agree or user is more severe
  else if (mlValue <= userValue) {
    aiVerified = true;
    finalSeverity = normalizedMl; // Use ML's stricter assessment
    if (mlValue === userValue) {
      reason = `ML model and user both agree on ${normalizedMl} severity. Image verified.`;
    } else {
      reason = `ML model detected ${normalizedMl} but user reported higher (${normalizedUser}). Using stricter ML assessment. Image verified.`;
    }
  }

  return {
    aiVerified,
    finalSeverity,
    reason,
    warning,
    mlSeverity: normalizedMl,
    userSeverity: normalizedUser,
    mlConfidence,
    details: {
      mlValue,
      userValue,
      comparison: mlValue > userValue ? 'ML HIGHER' : mlValue < userValue ? 'USER HIGHER' : 'EQUAL'
    }
  };
}

/**
 * Generate detailed verification report
 */
export function generateVerificationReport(imageUrl, description, category, title, userSeverity) {
  const mlResult = classifySeverityFromDescription(description, category, title);
  const normalizedUserSeverity = convertToTitleCase(userSeverity);
  const comparison = compareSeverities(mlResult.severity, normalizedUserSeverity, mlResult.confidence);

  return {
    timestamp: new Date().toISOString(),
    imageUrl,
    input: {
      title,
      description,
      category,
      userSeverity: normalizedUserSeverity
    },
    mlAnalysis: {
      predictedSeverity: mlResult.severity,
      confidence: mlResult.confidence,
      matchedKeywords: mlResult.matchedKeywords,
      details: mlResult.details
    },
    verification: comparison,
    recommendedAction: comparison.warning ? 'MANUAL_REVIEW' : 'AUTO_APPROVED'
  };
}
