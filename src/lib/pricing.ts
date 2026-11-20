import { FLEET } from "./fleet";

export interface PriceBreakdown {
  days: number;
  dailyRate: number;
  vehicleTotal: number;
  driverFee: number;
  airportFee: number;
  total: number;
  vehicleName: string;
}

export function calculateBookingPrice(params: {
  vehicleId: string;
  driverOption: "with_driver" | "self_drive";
  pickupDate: string;
  returnDate: string;
  airportPickup?: boolean;
}): PriceBreakdown {
  const vehicle = FLEET.find((v) => v.id === params.vehicleId) || FLEET[0];
  
  let days = 1;
  if (params.pickupDate && params.returnDate) {
    const start = new Date(params.pickupDate);
    const end = new Date(params.returnDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    days = diffDays > 0 ? diffDays : 1;
  }

  const dailyRate = vehicle.dailyRate;
  const vehicleTotal = dailyRate * days;
  
  // Chauffeur fee: LKR 3,500/day if with_driver is chosen and vehicle has driver option
  const driverFee =
    params.driverOption === "with_driver" && vehicle.driverExtraPerDay
      ? vehicle.driverExtraPerDay * days
      : 0;

  // Airport pickup optional surcharge: Free in Trinco/Nilaveli, small fee if selected airport
  const airportFee = params.airportPickup ? 4500 : 0;

  const total = vehicleTotal + driverFee + airportFee;

  return {
    days,
    dailyRate,
    vehicleTotal,
    driverFee,
    airportFee,
    total,
    vehicleName: vehicle.name,
  };
}
