let sequence = 0;
let lastMillisecond = -1;

/**
 * @returns {string}
 */
export function generateNumericId() {
  
  const prefix = '10000';
  
  const currentMillisecond = Date.now();

  
  if (currentMillisecond !== lastMillisecond) {
    lastMillisecond = currentMillisecond;
    sequence = 0;
  } else {    
    sequence = (sequence + 1) % 100;
  }

  const timePart = currentMillisecond.toString().slice(-5);

  const sequencePart = sequence.toString().padStart(2, '0');

  const id = `${prefix}${timePart}${sequencePart}`;

  return id;
}