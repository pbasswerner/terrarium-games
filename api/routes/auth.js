const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const prisma = require('../prisma'); // connects to your Prisma Client
const requireAuth = require('../middleware/requireAuth');

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/register
router.post('/register', async (req, res) => {
    console.log('Hit /register route');
    const { email, password, confirmPassword } = req.body;

    // 1. Email format check
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // 2. Password strength check
    if (!password || password.length < 8 || password === '123456') {
        return res.status(400).json({
            message: 'Password must be at least 8 characters and not a common password like "123456".',
        });
    }

    // 3. Password confirmation check
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        // 3. Duplicate email check
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                isAdmin: false,
            },
        });

        res.status(201).json({
            message: 'User created successfully',
            user: { id: newUser.id, email: newUser.email },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST /api/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // 2. Find user
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'No account found with that email.' });
        }

        // 3. Check password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        // 4. Generate token
        const token = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST /api/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // set to true if using HTTPS
    });

    res.json({ message: 'Logged out successfully' });
});

// GET /api/me
router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                createdAt: true,
                isAdmin: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
