
export const fetchWeather = async (lat, lon) => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.current_weather) {
            const code = data.current_weather.weathercode;
            // WMO Weather interpretation codes (http://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
            // 0: Clear sky
            // 1, 2, 3: Mainly clear, partly cloudy, and overcast
            // 45, 48: Fog and depositing rime fog
            // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
            // 61, 63, 65: Rain: Slight, moderate and heavy intensity
            // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
            // 95: Thunderstorm: Slight or moderate

            if (code <= 3) return 'Clear';
            if (code === 45 || code === 48) return 'Fog';
            if (code >= 51) return 'Rain';

            return 'Clear'; // Default
        }
        return 'Clear';
    } catch (error) {
        console.error("Error fetching weather:", error);
        return 'Clear';
    }
};
