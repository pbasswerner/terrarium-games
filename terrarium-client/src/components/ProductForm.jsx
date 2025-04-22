// src/components/ProductForm.jsx
import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function ProductForm({ initialData = null, onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        imageUrl: '',
        shopifyProductId: '',
        status: 'coming soon',
        price: '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                price: initialData.price?.toString() || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const endpoint = initialData ? `/api/products/${initialData.id}` : '/api/products';
        const method = initialData ? 'PUT' : 'POST';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save product');
            }

            const result = await res.json();
            onSuccess?.(result.product);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3 shadow-sm border rounded">
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Slug</Form.Label>
                <Form.Control name="slug" value={formData.slug} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" value={formData.description} onChange={handleChange} as="textarea" rows={3} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Shopify Product ID (Optional)</Form.Label>
                <Form.Control name="shopifyProductId" value={formData.shopifyProductId} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="available">Available</option>
                    <option value="coming soon">Coming Soon</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control name="price" type="number" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
            </Form.Group>

            <Button variant="success" type="submit" disabled={submitting}>
                {submitting ? <Spinner animation="border" size="sm" /> : (initialData ? 'Update' : 'Add')} Product
            </Button>
        </Form>
    );
}
