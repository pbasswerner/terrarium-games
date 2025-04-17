const express = require('express');
const prisma = require('../prisma');
const requireAdmin = require('../middleware/requireAdmin');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/admin/users — List all users
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                isAdmin: true,
                createdAt: true,
                bookmarks: {
                    select: { id: true, productId: true }
                },
                notifyReqs: {
                    select: { id: true, productId: true }
                }
            }
        });
        res.json({ users });
    } catch (err) {
        console.error('Fetch admin users error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

//Delete user
router.delete('/users/:id', requireAuth, requireAdmin, async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


module.exports = router;
