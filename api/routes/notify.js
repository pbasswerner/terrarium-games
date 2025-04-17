const express = require('express');
const prisma = require('../prisma');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// ✅ POST /api/notify – User requests notification for a product
router.post('/', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const existing = await prisma.notifyRequest.findFirst({
            where: { userId, productId },
        });

        if (existing) {
            return res.status(400).json({ error: 'Already requested notification for this product.' });
        }

        const notify = await prisma.notifyRequest.create({
            data: { userId, productId },
        });

        res.status(201).json({ notify });
    } catch (err) {
        console.error('Notify error:', err);
        res.status(500).json({ error: 'Failed to create notify request' });
    }
});

// ✅ GET /api/notify — Admin gets all; users get their own
router.get('/', requireAuth, async (req, res) => {
    try {
        const requests = await prisma.notifyRequest.findMany({
            where: req.user.isAdmin ? {} : { userId: req.user.id },
            include: {
                product: true,
                user: req.user.isAdmin ? { select: { email: true } } : false
            }
        });

        res.json({ requests });
    } catch (err) {
        console.error('Fetch notify requests error:', err);
        res.status(500).json({ error: 'Failed to fetch notify requests' });
    }
});

// ✅ DELETE /api/notify/:id — Admin or owner can delete
router.delete('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const notify = await prisma.notifyRequest.findUnique({
            where: { id: parseInt(id) },
        });

        if (!notify) {
            return res.status(404).json({ error: 'Notify request not found' });
        }

        // Check if user is owner or admin
        if (notify.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Not authorized to delete this request' });
        }

        await prisma.notifyRequest.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Notify request deleted successfully' });
    } catch (err) {
        console.error('Delete notify request error:', err);
        res.status(500).json({ error: 'Failed to delete notify request' });
    }
});

module.exports = router;
