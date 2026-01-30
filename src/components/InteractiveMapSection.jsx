import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers in Vite/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to fly to location when position changes
const FlyToLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15, { duration: 2 });
        }
    }, [position, map]);
    return null;
};

// Custom Select Component for a premium experience
const CustomSelect = ({ value, onChange, options, label, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1.5 relative">
            {label && (
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`w-full bg-white border border-gray-200 shadow-md rounded-2xl px-3 md:px-4 py-3 text-left text-gray-700 font-bold focus:shadow-lg focus:border-gray-300 outline-none transition-all flex items-center justify-between group ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-50 shadow-none' : 'cursor-pointer'}`}
                >
                    <span className={!value ? 'text-gray-400' : ''}>
                        {value || placeholder}
                    </span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-[#0d181c] via-[#1f353d] to-[#0d181c] text-white shadow-sm transition-transform group-hover:scale-110">
                        <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 5 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute left-0 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar p-1.5"
                            >
                                {options.map((opt) => (
                                    <div
                                        key={opt}
                                        onClick={() => {
                                            onChange({ target: { value: opt } });
                                            setIsOpen(false);
                                        }}
                                        className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-all rounded-xl mb-1 last:mb-0 ${value === opt ? 'bg-[#0d181c] text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        {opt}
                                    </div>
                                ))}
                                {options.length === 0 && (
                                    <div className="px-5 py-8 text-center text-gray-400 text-xs italic font-bold">
                                        No areas found Nearby
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const InteractiveMapSection = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Initial center (India generic or specific city)
    const defaultCenter = [19.0760, 72.8777]; // Mumbai

    // Route Checker State
    const [userCity, setUserCity] = useState("");
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [routeResult, setRouteResult] = useState(null);

    // Fetched Places State
    const [fetchedPlaces, setFetchedPlaces] = useState([]);
    const [isFetchingPlaces, setIsFetchingPlaces] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

    // Sort places alphabetically 
    const availablePlaces = fetchedPlaces.sort();

    // Dynamic Traffic Data
    const [trafficRoutes, setTrafficRoutes] = useState([]);

    // Fetch City & Places from Geoapify
    const fetchCityAndPlaces = async (lat, lon) => {
        setIsFetchingPlaces(true);
        try {
            // Step 1: Reverse Geocoding
            const reverseRes = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`);
            const reverseData = await reverseRes.json();

            if (reverseData.features && reverseData.features.length > 0) {
                // 🔴 THE FIX: 
                // We filter the results to find the one that is a 'city' or 'town'.
                // Your current code is picking an ATM because it's the closest thing to your GPS.
                const cityFeature = reverseData.features.find(f =>
                    f.properties.result_type === 'city' ||
                    f.properties.result_type === 'town' ||
                    f.properties.category === 'administrative'
                ) || reverseData.features[0];

                const city = cityFeature.properties.city || cityFeature.properties.name || "Unknown City";
                const cityPlaceId = cityFeature.properties.place_id;

                console.log(`[Geoapify] Corrected City ID: ${cityPlaceId} for ${city}`);
                setUserCity(city);

                if (cityPlaceId) {
                    // Step 2: Now call boundaries using the CITY ID, not the ATM ID
                    const boundariesRes = await fetch(
                        `https://api.geoapify.com/v1/boundaries/consists-of?id=${cityPlaceId}&sublevel=1&geometry=geometry_1000&apiKey=${GEOAPIFY_API_KEY}`
                    );

                    // This check helps debug line 77
                    if (!boundariesRes.ok) {
                        const errorText = await boundariesRes.text();
                        console.error("Boundaries API Error Details:", errorText);
                        setFetchedPlaces([]);
                        return;
                    }

                    const boundariesData = await boundariesRes.json();

                    if (boundariesData.features && boundariesData.features.length > 0) {
                        const areaNames = boundariesData.features.map(f => f.properties.name).filter(Boolean);
                        setFetchedPlaces([...new Set(areaNames)].sort());
                    } else {
                        // If sublevel 1 is empty, try sublevel 2 (deeper neighborhoods)
                        console.log("Sublevel 1 empty, trying Sublevel 2...");
                        const sub2Res = await fetch(
                            `https://api.geoapify.com/v1/boundaries/consists-of?id=${cityPlaceId}&sublevel=2&geometry=geometry_1000&apiKey=${GEOAPIFY_API_KEY}`
                        );
                        const sub2Data = await sub2Res.json();
                        if (sub2Data.features && sub2Data.features.length > 0) {
                            const areaNames = sub2Data.features.map(f => f.properties.name).filter(Boolean);
                            setFetchedPlaces([...new Set(areaNames)].sort());
                        } else {
                            // Finally fallback to nearby if everything fails
                            const placesRes = await fetch(`https://api.geoapify.com/v2/places?categories=commercial.shopping_mall,public_transport&filter=circle:${lon},${lat},5000&limit=20&apiKey=${GEOAPIFY_API_KEY}`);
                            const placesData = await placesRes.json();
                            if (placesData.features) {
                                const areaNames = placesData.features.map(f => f.properties.name).filter(Boolean);
                                setFetchedPlaces([...new Set(areaNames)].sort());
                            } else {
                                setFetchedPlaces([]);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setFetchedPlaces([]);
        } finally {
            setIsFetchingPlaces(false);
        }
    };

    useEffect(() => {
        const center = userLocation || defaultCenter;

        // If userLocation exists, fetch real data
        if (userLocation) {
            fetchCityAndPlaces(userLocation[0], userLocation[1]);
        }

        // Generate mock routes around the center
        const mockRoutes = [
            {
                positions: [[center[0], center[1]], [center[0] + 0.01, center[1] + 0.01]],
                color: 'green',
                status: 'Clear Road (Near You)'
            },
            {
                positions: [[center[0], center[1]], [center[0] - 0.01, center[1] - 0.01]],
                color: 'red',
                status: 'Heavy Traffic (Near You)'
            },
            {
                positions: [[center[0] + 0.01, center[1] + 0.01], [center[0] + 0.02, center[1] + 0.02]],
                color: 'green',
                status: 'Clear Road'
            },
            {
                positions: [[center[0] - 0.01, center[1] - 0.01], [center[0] - 0.02, center[1] - 0.02]],
                color: 'orange',
                status: 'Moderate Traffic'
            },
        ];
        setTrafficRoutes(mockRoutes);
    }, [userLocation]);

    const handleDetectLocation = () => {
        setLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                setLoadingLocation(false);
            },
            (error) => {
                console.error("Error detecting location:", error);
                let errorMessage = "Unable to retrieve your location.";
                if (error.code === 1) errorMessage = "Location permission denied. Please enable location access.";
                else if (error.code === 2) errorMessage = "Location unavailable.";
                else if (error.code === 3) errorMessage = "Location request timed out.";

                setLocationError(errorMessage);
                setLoadingLocation(false);
                alert(errorMessage);
            }
        );
    };

    const [isChecking, setIsChecking] = useState(false);

    const getCoordinates = async (placeName) => {
        try {
            const query = `${placeName}, ${userCity}`;
            const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                return data.features[0].properties; // contains lat, lon
            }
            return null;
        } catch (error) {
            console.error("Geocoding error:", error);
            return null;
        }
    };

    const checkRouteTraffic = async () => {
        if (isChecking) return;

        setIsChecking(true);
        setRouteResult(null);

        try {
            // 1. Get Coordinates for Start and End
            const startCoords = await getCoordinates(startPoint);
            const endCoords = await getCoordinates(endPoint);

            if (!startCoords || !endCoords) {
                alert("Could not find coordinates for the selected locations.");
                setIsChecking(false);
                return;
            }

            // 2. Fetch Route Data (Real Time)
            const waypoints = `${startCoords.lat},${startCoords.lon}|${endCoords.lat},${endCoords.lon}`;
            // Added 'traffic=approximated' (if supported by tier) and 'details' to allow API to optimize
            const routeRes = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&traffic=approximated&apiKey=${GEOAPIFY_API_KEY}`);
            const routeData = await routeRes.json();

            if (routeData.features && routeData.features.length > 0) {
                const routeFeature = routeData.features[0];
                const routeProps = routeFeature.properties;
                const timeInSeconds = routeProps.time; // time is in seconds
                const distanceInMeters = routeProps.distance;

                // Convert to minutes
                const minutes = Math.round(timeInSeconds / 60);
                const fullTime = minutes > 60
                    ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min`
                    : `${minutes} mins`;

                // 3. Determine Status (Deterministic based on speed)
                // Adjusted for Indian Traffic Context:
                // > 40km/h = Clear (Highways/Open roads)
                // > 20km/h & <= 40km/h = Moderate (City flow)
                // <= 20km/h = Heavy (Congestion)
                const speedKmph = (distanceInMeters / timeInSeconds) * 3.6;
                console.log(`[Traffic Check] Dist: ${distanceInMeters}m, Time: ${timeInSeconds}s, Speed: ${speedKmph.toFixed(2)} km/h`);

                let calculatedStatus = "Moderate";
                let routeColor = "orange"; // Default

                if (speedKmph > 40) {
                    calculatedStatus = "Clear";
                    routeColor = "green";
                } else if (speedKmph <= 20) {
                    calculatedStatus = "Heavy";
                    routeColor = "red";
                }

                setRouteResult({
                    status: calculatedStatus,
                    time: fullTime,
                    distance: (distanceInMeters / 1000).toFixed(1) + " km",
                    start: startPoint,
                    end: endPoint
                });

                // 4. Extract and Display Route Geometry
                if (routeFeature.geometry && routeFeature.geometry.coordinates) {
                    const coords = routeFeature.geometry.coordinates; // GeoJSON is [lon, lat]

                    // Handle MultiLineString or LineString
                    // Geoapify Routing usually returns MultiLineString for complex routes or LineString
                    // Flatten if necessary or handle segments
                    let leafletPositions = [];

                    if (routeFeature.geometry.type === 'MultiLineString') {
                        // Array of Arrays of coords
                        leafletPositions = coords.flat().map(coord => [coord[1], coord[0]]);
                    } else {
                        // LineString: Array of coords
                        leafletPositions = coords.map(coord => [coord[1], coord[0]]);
                    }

                    // Replace mock routes with this real route
                    setTrafficRoutes([{
                        positions: leafletPositions,
                        color: routeColor,
                        status: `${calculatedStatus} (${(distanceInMeters / 1000).toFixed(1)} km)`
                    }]);

                    // Add Start/End Markers if needed (Optional, existing UserLocation handles "You", but this is Start/End)
                }

            } else {
                alert("No route found between these locations.");
            }
        } catch (error) {
            console.error("Routing Error:", error);
            alert("Failed to calculate route.");
        } finally {
            setIsChecking(false);
        }
    };
    const handleMapRedirect = () => {
        if (!userLocation) {
            setToastMessage("detect location first");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
            return;
        }

        if (!startPoint || !endPoint) {
            setToastMessage("select start & End points");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
            return;
        }

        if (startPoint === endPoint) {
            setToastMessage("points cannot be same");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
            return;
        }

        // Encode the strings to make them URL-safe
        const origin = encodeURIComponent(`${startPoint || "Current Location"}, ${userCity}`);
        const dest = encodeURIComponent(`${endPoint || "Your Destination"}, ${userCity}`);

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;

        // Opens in a new tab
        window.open(googleMapsUrl, '_blank');
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // Delay between each box
                delayChildren: 0.2    // Initial delay before first box
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1] // easeOutCubic for premium feel
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="w-full mb-10 space-y-6"
        >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 h-auto lg:min-h-[450px] 2xl:min-h-[500px]">

                {/* Box 1: Live Location Tracer (Flex 1) */}
                <motion.div
                    variants={cardVariants}
                    className="flex-[1] bg-white rounded-xl shadow-xl overflow-hidden border border-blue-100 flex flex-col relative group"
                >
                    <div className="bg-gradient-to-r from-[#0d181c] via-[#1f353d] to-[#0d181c] p-3 text-white flex justify-between items-center z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📍</span>
                            <h3 className="font-bold text-lg tracking-wide">LIVE TRACER</h3>
                        </div>
                        <button
                            onClick={handleDetectLocation}
                            disabled={loadingLocation}
                            className="bg-transparent border border-white text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:bg-white/10 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                        >
                            {loadingLocation ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Detect...
                                </>
                            ) : (
                                "Detect"
                            )}
                        </button>
                    </div>

                    <div className="flex-1 relative z-0">
                        <MapContainer
                            center={defaultCenter}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                            className="z-0"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {userLocation && (
                                <>
                                    <Marker position={userLocation}>
                                        <Popup>
                                            <div className="text-center">
                                                <h4 className="font-bold text-blue-600">You are here!</h4>
                                                <p className="text-xs text-gray-500">Live Location Active</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                    <FlyToLocation position={userLocation} />
                                </>
                            )}
                        </MapContainer>

                        {/* Overlay Message if no location */}
                        {!userLocation && !loadingLocation && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 z-[400]">
                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg text-center max-w-[80%] border border-white/50">
                                    <p className="text-gray-600 font-medium text-sm">Click "Detect" to start</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Box 2: Route Traffic Checker (Flex 1) */}
                <motion.div
                    variants={cardVariants}
                    className="flex-[1] bg-white rounded-2xl shadow-xl overflow-visible border border-purple-100 flex flex-col"
                >
                    <div className="bg-gradient-to-r from-[#0d181c] via-[#1f353d] to-[#0d181c] p-4 text-white flex rounded-t-2xl justify-between items-center z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🛣️</span>
                            <h3 className="font-bold text-sm md:text-lg tracking-wide">
                                {isFetchingPlaces ? "LOCATING..." : `AREAS IN YOUR CITY`}
                            </h3>
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md">
                            {isFetchingPlaces ? <span className="animate-pulse">Finding...</span> : (userCity || "None")}
                        </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col gap-4 overflow-visible">

                        {/* City Selector */}
                        <CustomSelect
                            label="City (Auto-Detected)"
                            value={
                                isFetchingPlaces
                                    ? "Finding..."
                                    : userLocation
                                        ? (userCity || "None Found")
                                        : "Detect your location first"
                            }
                            onChange={(e) => setUserCity(e.target.value)}
                            options={[userCity].filter(Boolean)}
                            disabled={true}
                        />

                        {/* Start Point */}
                        <CustomSelect
                            label="Start Point"
                            placeholder="Select Start Point"
                            value={startPoint}
                            onChange={(e) => setStartPoint(e.target.value)}
                            options={availablePlaces}
                        />

                        {/* End Point */}
                        <CustomSelect
                            label="Destination"
                            placeholder="Select Destination Point"
                            value={endPoint}
                            onChange={(e) => setEndPoint(e.target.value)}
                            options={availablePlaces}
                        />

                        {/* Check Button */}
                        <button
                            onClick={checkRouteTraffic}
                            disabled={!startPoint || !endPoint || startPoint === endPoint || isChecking}
                            className="w-full bg-gradient-to-r from-[#0d181c] via-[#1f353d] to-[#0d181c] text-white font-black py-3 rounded-xl shadow-xl hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2 flex justify-center items-center gap-3 border border-white/10"
                        >
                            {isChecking ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    CHARTING...
                                </>
                            ) : (
                                <>
                                    <span>CHECK TRAFFIC STATUS</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Result Area */}
                        <AnimatePresence>
                            {routeResult && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`mt-2 rounded-xl overflow-hidden border shadow-2xl ${routeResult.status === 'Clear' ? 'bg-green-50/50 border-green-200' :
                                        routeResult.status === 'Moderate' ? 'bg-orange-50/50 border-orange-200' :
                                            'bg-red-50/50 border-red-200'
                                        }`}
                                >
                                    <div className={`p-4 flex items-center justify-between ${routeResult.status === 'Clear' ? 'bg-green-500' :
                                        routeResult.status === 'Moderate' ? 'bg-orange-500' :
                                            'bg-red-500'
                                        } text-white`}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">
                                                {routeResult.status === 'Clear' ? "✅" : routeResult.status === 'Moderate' ? "⚠️" : "🚨"}
                                            </span>
                                            <h4 className="font-black tracking-tighter uppercase text-sm">{routeResult.status} TRAFFIC AHEAD</h4>
                                        </div>
                                        <button onClick={() => setRouteResult(null)} className="hover:rotate-90 transition-transform cursor-pointer">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>

                                    <div className="p-5 grid grid-cols-2 gap-4">
                                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm flex flex-col items-center text-center">
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Time to Travel</span>
                                            <div className="flex items-center gap-2 text-gray-800">
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                <span className="text-base md:text-lg font-black">{routeResult.time}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm flex flex-col items-center text-center">
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Distance</span>
                                            <div className="flex items-center gap-2 text-gray-800">
                                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                <span className="text-lg font-black">{routeResult.distance}</span>
                                            </div>
                                        </div>

                                        <div className="col-span-2 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Route Analysis</span>
                                                <p className="text-xs font-bold text-gray-700 mt-0.5 italic">
                                                    {routeResult.status === 'Clear' ? "The road is smooth. Safe travels!" :
                                                        routeResult.status === 'Moderate' ? "Expect minor delays. Drive safely." :
                                                            "Heavy traffic ahead. Use another route if possible."}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group relative cursor-pointer hover:bg-slate-200 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </motion.div>

                {/* Box 3: Traffic Route Map */}
                <motion.div
                    variants={cardVariants}
                    onClick={handleMapRedirect}
                    className="flex-[1] bg-white rounded-xl shadow-xl overflow-hidden border border-green-100 flex flex-col cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] group relative"
                >
                    <div className="bg-gradient-to-r from-[#0d181c] via-[#1f353d] to-[#0d181c] p-3 text-white flex justify-between items-center z-10">
                        <div className="flex items-center gap-1">
                            <span className="text-2xl">🚦</span>
                            <div>
                                <h3 className="font-bold text-sm md:text-lg tracking-wide">TRAFFIC MAP</h3>
                                <p className="text-xs text-green-100 font-medium opacity-90">Real-time Updates</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-[10px] md:text-xs font-black bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm uppercase tracking-tighter">
                            <span className="flex items-center gap-1.5 tracking-wide">
                                {/* <svg className="w-3 h-3 animate-pulse text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <circle cx="10" cy="10" r="10" />
                                </svg> */}
                                Click to see route
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 relative z-0">
                        <MapContainer
                            center={userLocation || defaultCenter}
                            zoom={14}
                            dragging={false}
                            keyboard={false}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {userLocation && <FlyToLocation position={userLocation} />}

                            {/* Render Traffic Routes */}
                            {trafficRoutes.map((route, index) => (
                                <Polyline
                                    key={index}
                                    positions={route.positions}
                                    pathOptions={{
                                        color: route.color,
                                        weight: 6,
                                        opacity: 0.8,
                                        dashArray: route.color === 'red' ? '10, 10' : null
                                    }}
                                >
                                    <Popup>
                                        <div className="font-bold text-sm">
                                            Status: <span className={route.color === 'green' ? 'text-green-600' : 'text-red-600'}>{route.status}</span>
                                        </div>
                                    </Popup>
                                </Polyline>
                            ))}

                            {/* Current Location Marker on Traffic Map */}
                            {userLocation && (
                                <Marker position={userLocation}>
                                    <Popup>Your Location</Popup>
                                </Marker>
                            )}

                        </MapContainer>

                        {/* Legend / Info Overlay */}
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50 max-w-xs z-[400] text-xs space-y-1">
                            <p className="font-bold text-gray-700">Route Analysis</p>
                            <p className="flex justify-between text-gray-600"><span>Est. Travel Time:</span> <span className="font-medium text-gray-900">45 mins</span></p>
                            <p className="flex justify-between text-gray-600"><span>Traffic Status:</span> <span className="font-medium text-amber-600">Moderate</span></p>
                        </div>

                        {/* Interactive Overlay to tell user it's clickable */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center transition-all z-[450]">
                            <div className="bg-white/95 px-6 py-2.5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 border border-gray-100">
                                <span className="text-sm font-black text-[#0d181c] uppercase tracking-tighter">Click to Navigate</span>
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Custom Toast Notification - Dark Theme */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: -50, y: 0 }}
                        className="fixed top-24 left-6 z-[9999] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl flex items-center justify-between min-w-[300px] p-2 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                <span className="text-xl">📍</span>
                            </div>
                            <p className="text-[#0d181c] font-black text-sm select-none uppercase tracking-tighter">
                                {toastMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className="text-gray-400 hover:text-gray-900 transition-colors ml-4 bg-gray-50 p-1.5 cursor-pointer rounded-full"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default InteractiveMapSection;
