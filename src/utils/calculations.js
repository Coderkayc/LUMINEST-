export const calculateWatts = (voltage, current) => {
  return parseFloat((voltage * current).toFixed(2));
};

export const calculateCost = (kwh, band) => {
  const TARIFF_RATES = {
    'A': 225.00, 
    'B': 68.00, 
    'C': 52.00, 
    'D': 38.00,  
    'E': 32.00   
  };

  const rate = TARIFF_RATES[band] || TARIFF_RATES['A'];
  return parseFloat((kwh * rate).toFixed(2));
};

export const estimateRemainingTime = (balance, avgHourlyCost) => {
  if (avgHourlyCost <= 0) return Infinity;
  return parseFloat((balance / avgHourlyCost).toFixed(1));
};