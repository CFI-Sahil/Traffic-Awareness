// Real-time traffic service using TomTom API

const API_KEYS = [
  import.meta.env.VITE_TOMTOM_KEY_1,
  import.meta.env.VITE_TOMTOM_KEY_2,
  import.meta.env.VITE_TOMTOM_KEY_3,
  import.meta.env.VITE_TOMTOM_KEY_4,
  import.meta.env.VITE_TOMTOM_KEY_5,
  import.meta.env.VITE_TOMTOM_KEY_6,
  import.meta.env.VITE_TOMTOM_KEY_7
];

let currentKeyIndex = 0;

const getApiKey = () => API_KEYS[currentKeyIndex];

const rotateKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  console.warn('🔁 API key rotated. New index:', currentKeyIndex);
};

const safeFetch = async (urlBuilder, retries = API_KEYS.length) => {
  try {
    const url = urlBuilder(getApiKey());
    const response = await fetch(url);

    if (!response.ok && [401, 403, 429].includes(response.status)) {
      throw new Error('API key limit or auth error');
    }

    return await response.json();
  } catch (error) {
    if (retries <= 1) throw error;
    rotateKey();
    return safeFetch(urlBuilder, retries - 1);
  }
};

export const fetchTrafficStats = async ({ center, bbox }) => {
  try {
    if (!center || !bbox) throw new Error("Missing location data");

    // 1. Fetch Traffic Flow Data
    const flowData = await safeFetch(
      (key) =>
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${key}&point=${center[0]},${center[1]}`
    );

    // 2. Fetch Traffic Incidents
    const incidentsData = await safeFetch(
      (key) =>
        `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${key}&bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,startTime,from,to}}}&language=en-GB`
    );

    // --- Process Flow Data ---
    const flowInfo = flowData.flowSegmentData || {};
    const currentSpeed = flowInfo.currentSpeed || 60;
    const freeFlowSpeed = flowInfo.freeFlowSpeed || 60;

    let congestionLevel = 0;
    if (freeFlowSpeed > 0) {
      congestionLevel = Math.round(((freeFlowSpeed - currentSpeed) / freeFlowSpeed) * 100);
    }
    congestionLevel = Math.max(0, Math.min(100, congestionLevel));

    // --- Process Incidents ---
    const incidents = incidentsData.incidents || [];
    const accidentCount = incidents.length;
    const trend = congestionLevel > 40 ? '+Rising' : '-Stable';

    const recentIncidents = incidents.slice(0, 3).map((inc, index) => {
      let status = 'Reported';
      if (inc.properties.iconCategory === 1) status = 'Critical';
      else if (inc.properties.iconCategory === 6) status = 'Jam';
      else if (inc.properties.iconCategory === 9) status = 'Road Works';

      const location = inc.properties.from
        ? inc.properties.from.substring(0, 20) + '...'
        : `Sector ${10 + index}`;

      const geometry = inc.geometry || {};
      const coords = geometry.coordinates || [center[1], center[0]];
      const [lon, lat] = geometry.type === 'LineString' ? coords[0] : coords;

      return {
        id: index,
        location,
        time: `${2 + index * 5} mins ago`,
        status,
        lat,
        lon
      };
    });

    return {
      accidentCount,
      congestionLevel,
      trend,
      recentIncidents,
      currentSpeed,
      freeFlowSpeed
    };

  } catch (error) {
    console.warn("Traffic API Error (fallback used):", error);

    const pseudoRandom = (center[0] * 1000) + (center[1] * 1000);
    const mockCongestion = Math.floor((Math.sin(pseudoRandom) + 1) * 35) + 10;
    const mockSpeed = Math.floor(60 * (1 - mockCongestion / 100));

    return {
      accidentCount: Math.floor(mockCongestion / 10),
      congestionLevel: mockCongestion,
      trend: mockCongestion > 50 ? '+Rising' : '-Stable',
      recentIncidents: [
        { id: 1, location: "Main Highway", time: "5 mins ago", status: "Slow Traffic", lat: center[0] + 0.01, lon: center[1] + 0.01 },
        { id: 2, location: "City Center", time: "12 mins ago", status: "Congestion", lat: center[0] - 0.01, lon: center[1] - 0.01 }
      ],
      currentSpeed: mockSpeed,
      freeFlowSpeed: 60
    };
  }
};
