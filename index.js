const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and handle CORS
app.use(bodyParser.json());
app.use(cors());

// Helper function to process Base64 file
function processBase64File(fileB64) {
    if (!fileB64) return { isValid: false };

    // Decode base64 string and calculate file size
    const buffer = Buffer.from(fileB64, 'base64');
    const fileSizeKb = buffer.length / 1024; // in KB

    // Guessing the file type (This is a basic example, adjust as needed)
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

    // Filter numbers and alphabets from data array
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));

    // Find the highest lowercase alphabet
    const highestLowercaseAlphabet = alphabets.filter(item => /^[a-z]$/.test(item)).sort().reverse()[0] || null;

    // Process Base64 file if provided
    const file = processBase64File(file_b64);

    // Construct response
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
