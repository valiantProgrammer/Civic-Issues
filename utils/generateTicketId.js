import { getCounterModel } from '@/models/counter.js';

/**
 * Generates a unique sequential ticket ID for reports
 * Format: CIVIC-YYYYMMDD-NNNNN (e.g., CIVIC-20260302-00001)
 * 
 * Uses a daily counter to guarantee uniqueness.
 * Supports up to 99,999 reports per day.
 * When the day changes, the counter resets to 1.
 */
export const generateTicketId = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Date string serves as counter ID (resets daily)
  const dateStr = `${year}${month}${day}`;
  
  try {
    // Get counter model and increment count for today
    const Counter = await getCounterModel();
    const counter = await Counter.findByIdAndUpdate(
      dateStr,
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    
    // Pad sequence number to 5 digits (00001 - 99999)
    const sequence = String(counter.sequence_value).padStart(5, '0');
    
    // Format: CIVIC-YYYYMMDD-NNNNN
    return `CIVIC-${dateStr}-${sequence}`;
  } catch (error) {
    console.error('Error generating ticket ID:', error);
    // Fallback to random ID if counter fails
    return generateFallbackTicketId();
  }
};

/**
 * Fallback ticket ID generator (uses random approach)
 * Used if counter service is temporarily unavailable
 */
const generateFallbackTicketId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  
  for (let i = 0; i < 5; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return `CIVIC-${year}${month}${day}-${randomPart}`;
};

/**
 * Validates if a string is a valid ticket ID format
 * Accepts both sequential (CIVIC-YYYYMMDD-NNNNN) and random (CIVIC-YYYYMMDD-XXXXX) formats
 */
export const isValidTicketId = (ticketId) => {
  const pattern = /^CIVIC-\d{8}-[A-Z0-9]{5}$/;
  return pattern.test(ticketId);
};
