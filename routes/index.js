var express = require("express");
const axios = require("axios");
var router = express.Router();

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
}

function getComfortDescription(temperature, humidity) {
    if (temperature < 15) return "Pretty chilly in here!";
    if (temperature > 28) return "It's quite warm in here!";
    if (temperature > 22 && humidity > 65)
        return "Feeling a bit humid and warm";
    if (temperature > 22) return "Nice and warm";
    if (humidity > 70) return "Feeling a bit damp";
    if (temperature >= 18 && temperature <= 22)
        return "Perfect garage conditions";
    return "Cool but comfortable";
}

function getTimeOfDay(dateString) {
    const hour = new Date(dateString).getHours();

    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 20) return "evening";
    return "night";
}

/* GET home page. */
router.get("/", async function (req, res, next) {
    try {
        console.log("Making API request...");
        const response = await axios.get(
            "https://chrisbarbati.ddns.net:2048/API/weather",
            {
                httpsAgent: new (require("https").Agent)({
                    rejectUnauthorized: false,
                }),
            }
        );

        // Formatting the numbers
        const data = {
            ...response.data,
            temperature: Number(response.data.temperature).toFixed(1),
            humidity: Math.round(response.data.humidity),
            pressure: Math.round(response.data.pressure),
            formattedDate: formatDate(response.data.dstamp),
            comfort: getComfortDescription(
                Number(response.data.temperature),
                Number(response.data.humidity)
            ),
            timeOfDay: getTimeOfDay(response.data.dstamp),
        };

        res.render("index", {
            response: data,
            debug: JSON.stringify(data, null, 2),
            timeOfDay: data.timeOfDay,
        });
    } catch (error) {
        console.error("Detailed error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });
        res.render("error", { error: error.message });
    }
});

module.exports = router;
