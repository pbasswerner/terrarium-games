const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // if using Node <18

const SHOPIFY_URL = 'https://terrarium-games.myshopify.com/api/2023-10/graphql.json';
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

router.get('/products', async (req, res) => {
    const query = `
        {
            products(first: 3) {
                edges {
                    node {
                        title
                    }
                }
            }
        }
    `;

    try {
        //console.log('Using Shopify token:', SHOPIFY_STOREFRONT_API_TOKEN);

        const shopifyRes = await fetch(SHOPIFY_URL, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
            },
            body: JSON.stringify({ query }),
        });

        const data = await shopifyRes.json();
        console.log('🔍 Shopify response data:', JSON.stringify(data, null, 2)); // ← Add this line


        // 🔍 Debug the entire response structure
        console.log('🔍 Shopify response data:', JSON.stringify(data, null, 2));

        if (!data.data || !data.data.products) {
            console.error(' Shopify API error: Unexpected response structure');
            return res.status(500).json({ error: 'Unexpected response structure from Shopify' });
        }

        res.json({ products: data.data.products.edges });
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch from Shopify' });
    }
});

module.exports = router;
