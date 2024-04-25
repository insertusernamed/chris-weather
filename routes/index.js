var express = require('express');
const axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const response = await axios.get('https://chrisbarbati.ddns.net:2048/API/weather');
    res.render('index', { response: response.data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.render('error'); // Render an error page or handle the error in a different way
  }
});

module.exports = router;
