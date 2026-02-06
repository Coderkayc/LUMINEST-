const TARIFF_RATES = {
  'A': 225.0, 
  'B': 68.0,
  'C': 52.0
};

export const processBilling = async (meterId, kwhUsed) => {
  const meter = await Meter.findById(meterId);
  
  if (!meter) return;

  const rate = TARIFF_RATES[meter.tariffBand];
  const cost = kwhUsed * rate;

  meter.walletBalance -= cost;

  if (meter.walletBalance <= 0) {
    meter.walletBalance = 0;
    meter.isActive = false;
  }

  await meter.save();
};