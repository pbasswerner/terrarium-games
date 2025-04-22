const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

const PORT = parseInt(process.env.PORT) || 8080;

CLIENT_URL = process.env.CLIENT_URL;

const cors = require('cors');

const allowedOrigins = [
    'http://localhost:3000',
    'https://terrarium-games.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        // If no origin (like Postman), allow it
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);

// Test route
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Products Route
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Bookmark Route
const bookmarkRoutes = require('./routes/bookmarks');
app.use('/api/bookmarks', bookmarkRoutes);

// Notify Route
const notifyRoutes = require('./routes/notify');
app.use('/api/notify', notifyRoutes);

//Shopify Route
const shopifyRoutes = require('./routes/shopify');
app.use('/api/shopify', shopifyRoutes);

//Admin Route
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
});
