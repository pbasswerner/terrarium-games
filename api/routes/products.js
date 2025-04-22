const express = require('express');
const prisma = require('../prisma');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/products — list all products
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ products });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/products — create new product (auth required)
router.post('/', requireAuth, async (req, res) => {
    const { title, slug, description, imageUrl, shopifyProductId, status, price } = req.body;

    if (!title || !slug || !description || !imageUrl || !status || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                title,
                slug,
                description,
                imageUrl,
                shopifyProductId,
                status,
                price: parseFloat(price)
            }
        });

        res.status(201).json({ message: 'Product created', product: newProduct });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/products/:id — update product (admin only)
router.put('/:id', requireAuth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
    }

    const { id } = req.params;
    const { title, description, imageUrl, slug, shopifyProductId, status, price } = req.body;

    try {
        const updated = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                imageUrl,
                slug,
                shopifyProductId,
                status,
                price: parseFloat(price)
            }
        });

        res.json({ message: 'Product updated', product: updated });
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// // DELETE /api/products/:id — admin only
// router.delete('/:id', requireAuth, async (req, res) => {
//     if (!req.user.isAdmin) {
//         return res.status(403).json({ error: 'Forbidden: Admins only' });
//     }

//     const { id } = req.params;

//     try {
//         await prisma.product.delete({
//             where: { id: parseInt(id) }
//         });

//         res.json({ message: 'Product deleted successfully' });
//     } catch (err) {
//         console.error('Delete product error:', err);
//         res.status(500).json({ error: 'Failed to delete product' });
//     }
// });

router.delete('/:id', requireAuth, async (req, res) => {
    console.log(' HIT DELETE ROUTE:', req.params.id);

    if (!req.user.isAdmin) {
        console.log(' Not admin:', req.user);
        return res.status(403).json({ error: 'Forbidden: Admins only' });
    }

    const { id } = req.params;

    try {
        const parsedId = parseInt(id);

        const product = await prisma.product.findUnique({ where: { id: parsedId } });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        //  Cascade delete relations if needed
        await prisma.bookmark.deleteMany({ where: { productId: parsedId } });
        await prisma.notifyRequest.deleteMany({ where: { productId: parsedId } });

        //  Now safe to delete product
        await prisma.product.delete({ where: { id: parsedId } });

        console.log('✅ Product deleted:', parsedId);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(' Delete product error:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});


// GET /api/products/slug/:slug — Get single product by slug
router.get('/slug/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: { slug },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (err) {
        console.error('Error fetching product by slug:', err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// GET /api/products/:id — fetch product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (err) {
        console.error('Error fetching product by ID:', err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});


module.exports = router;
