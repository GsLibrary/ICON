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
app.get('/fav', function(req, res) {
    let { bgColor = '#ffffff', tColor = '#000000', text = '?' } = req.query;

    // Ensure the color values are properly formatted (prepend '#' if missing)
    if (!bgColor.startsWith('#')) {
        bgColor = `#${bgColor}`;
    }
    if (!tColor.startsWith('#')) {
        tColor = `#${tColor}`;
    }

    // Create a canvas for favicon (32x32 size)
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 32, 32);

    // Set text color and font
    ctx.fillStyle = tColor;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the text (centered)
    ctx.fillText(text, 16, 16);

    // Send the image as a PNG
    res.setHeader('Content-Type', 'image/png');
    canvas.toBuffer((err, buffer) => {
        if (err) {
            return res.status(500).send('Error generating favicon');
        }
        res.send(buffer);
    });
});

app.get('*', function(req, res) {
    res.send("Error, Page Not Found");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });