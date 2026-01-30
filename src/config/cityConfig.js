export const CityConfig = {
    mumbai: {
        name: "Mumbai",
        center: [19.0760, 72.8777],
        bbox: "72.775,18.890,73.013,19.270" // Corrected format for Mappls/TomTom (minLon, minLat, maxLon, maxLat) usually?
        // User provided "18.89,72.77;19.27,73.01" (lat,lon pairs). 
        // TomTom Incidents API bbox: minLon,minLat,maxLon,maxLat
        // So: 72.77,18.89,73.01,19.27
    },
    delhi: {
        name: "Delhi",
        center: [28.6139, 77.2090],
        bbox: "76.838,28.412,77.348,28.881" // Already had this
    },
    bengaluru: {
        name: "Bengaluru",
        center: [12.9716, 77.5946],
        bbox: "77.34,12.83,77.80,13.14"
    },
    hyderabad: {
    name: "Hyderabad",
    center: [17.3850, 78.4867],
    bbox: "17.18,78.25;17.62,78.71"
  },
  chennai: {
    name: "Chennai",
    center: [13.0827, 80.2707],
    bbox: "12.85,80.05;13.30,80.45"
  },
  kolkata: {
    name: "Kolkata",
    center: [22.5726, 88.3639],
    bbox: "22.35,88.15;22.80,88.60"
  },
  pune: {
    name: "Pune",
    center: [18.5204, 73.8567],
    bbox: "18.35,73.65;18.72,74.10"
  },
  ahmedabad: {
    name: "Ahmedabad",
    center: [23.0225, 72.5714],
    bbox: "22.85,72.35;23.25,72.80"
  },
  jaipur: {
    name: "Jaipur",
    center: [26.9124, 75.7873],
    bbox: "26.75,75.60;27.10,76.05"
  },
  lucknow: {
    name: "Lucknow",
    center: [26.8467, 80.9462],
    bbox: "26.65,80.75;27.05,81.20"
  }
};
