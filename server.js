/* NPMs */
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const requestIP = require('request-ip');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const randomstring = require("randomstring");
const { createCanvas } = require('canvas');

dotenv = require('dotenv').config()

/* Other Variables */
const port = process.env.PORT || 3000;

/* Paths */
app.use(express.static(path.join(__dirname, 'public')));

/* Set */
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Define the folder where the ejs files will be stored
app.set('views', path.join(__dirname, '/views'));

/* Use */
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));

/* Get */
app.get('/fav', function (req, res) {
    let { bgColor = '#ffffff', tColor = '#000000', text = '?', size = 32 } = req.query;
    const allowedSizes = [16, 32, 64, 128, 256, 512];

    // Ensure the size is valid, default to 32 if invalid
    let pickedSize = parseInt(size, 10);
    if (!allowedSizes.includes(pickedSize)) {
        pickedSize = 32;
    }

    if (!bgColor.startsWith('#')) {
        bgColor = `#${bgColor}`;
    }
    if (!tColor.startsWith('#')) {
        tColor = `#${tColor}`;
    }

    // Create a canvas for favicon
    const canvas = createCanvas(pickedSize, pickedSize);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, pickedSize, pickedSize);

    // Set text color and font
    ctx.fillStyle = tColor;

    // Function to adjust font size to fit the text within the canvas
    function getFittingFontSize(text, maxWidth, maxHeight) {
        let fontSize = maxHeight; // Start with the maximum height
        do {
            fontSize--; // Reduce font size until it fits
            ctx.font = `${fontSize}px Arial`;
        } while (ctx.measureText(text).width > maxWidth && fontSize > 0);

        return fontSize;
    }

    // Set the font size to fit the text within the canvas
    const fontSize = getFittingFontSize(text, pickedSize * 0.9, pickedSize * 0.5); // 90% of width, 50% of height
    ctx.font = `${fontSize}px Arial`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the text (centered)
    ctx.fillText(text, pickedSize / 2, pickedSize / 2);

    // Send the image as a PNG
    res.setHeader('Content-Type', 'image/png');
    canvas.toBuffer((err, buffer) => {
        if (err) {
            return res.status(500).send('Error generating favicon');
        }
        res.send(buffer);
    });
});

app.get('*', function (req, res) {
    res.send("Error, Page Not Found");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});