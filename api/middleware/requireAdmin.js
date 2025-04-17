function requireAdmin(req, res, next) {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    next();
}

module.exports = requireAdmin;
