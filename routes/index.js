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
        };

        res.render("index", {
            response: data,
            debug: JSON.stringify(data, null, 2),
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
