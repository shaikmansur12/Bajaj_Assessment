const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware to parse JSON and handle CORS
app.use(bodyParser.json());
app.use(cors());

// Helper function to process Base64 file
function processBase64File(fileB64) {
    if (!fileB64) return { isValid: false };

    const buffer = Buffer.from(fileB64, 'base64');
    const fileSizeKb = buffer.length / 1024; // in KB

    const fileMimeType = buffer.toString('utf8', 0, 4).startsWith('%PDF') ? 'application/pdf' : 'image/png';
    const isValid = !!fileMimeType;

    return { isValid, fileMimeType, fileSizeKb: fileSizeKb.toFixed(2) };
}

// POST Endpoint: /bfhl
app.post('/bfhl', (req, res) => {
    const { data = [], file_b64 = null } = req.body;
    const userId = "Mansur_11307";
    const email = "mansur_shaik@srmap.edu.in";
    const rollNumber = "AP21110011307";

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
    const highestLowercaseAlphabet = alphabets.filter(item => /^[a-z]$/.test(item)).sort().reverse()[0] || null;

    const file = processBase64File(file_b64);

    const response = {
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
        file_valid: file.isValid,
        file_mime_type: file.fileMimeType,
        file_size_kb: file.fileSizeKb
    };

    res.json(response);
});

// GET Endpoint: /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Export the app as a serverless function
module.exports = app;
