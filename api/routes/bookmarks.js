const express = require('express');
const prisma = require('../prisma');
const requireAuth = require('../middleware/requireAuth');


const router = express.Router();

// GET /api/bookmarks – Get user's bookmarks
router.get('/', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: { product: true },
        });

        res.json({ bookmarks });
    } catch (err) {
        console.error('Fetch bookmarks error:', err);
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

// POST /api/bookmarks – Add a bookmark
router.post('/', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const bookmark = await prisma.bookmark.create({
            data: { userId, productId },
        });

        res.status(201).json({ bookmark });
    } catch (err) {
        console.error('Create bookmark error:', err);
        res.status(500).json({ error: 'Failed to create bookmark' });
    }
});

// DELETE /api/bookmarks/:id – Remove a bookmark
router.delete('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const bookmark = await prisma.bookmark.findUnique({
            where: { id: Number(id) },
        });

        if (!bookmark || bookmark.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await prisma.bookmark.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Bookmark deleted' });
    } catch (err) {
        console.error('Delete bookmark error:', err);
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
});

module.exports = router;
