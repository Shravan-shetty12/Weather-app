exports.handler = async (event) => {
    try {
        const city = event.queryStringParameters?.city;

        if (!city) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "City is required"
                })
            };
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "OpenWeather API key is not configured"
                })
            };
        }

        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${apiKey}` +
            `&units=metric`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    message: data.message || "Weather API request failed"
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {

        console.error("Weather function error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error"
            })
        };
    }
};
