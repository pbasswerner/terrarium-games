const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const SHOPIFY_URL = 'https://terrarium-games.myshopify.com/api/2023-10/graphql.json';
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

router.get('/products', async (req, res) => {
    const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            handle
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

    try {
        const shopifyRes = await fetch(SHOPIFY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
            },
            body: JSON.stringify({ query }),
        });

        const data = await shopifyRes.json();

        if (!data.data || !data.data.products) {
            return res.status(500).json({ error: 'Unexpected response structure from Shopify' });
        }

        res.json({
            products: data.data.products.edges.map(({ node }) => ({
                id: node.id,
                title: node.title,
                description: node.description,
                imageUrl: node.images.edges[0]?.node?.url || '',
                price: node.variants.edges[0]?.node?.price?.amount || '',
                shopifyHandle: node.handle,
                status: 'available',
            }))
        });
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch from Shopify' });
    }
});

module.exports = router;
