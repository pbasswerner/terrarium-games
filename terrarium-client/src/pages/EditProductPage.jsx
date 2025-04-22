// src/pages/EditProductPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import ProductForm from '../components/ProductForm';
import { API_BASE } from '../api';

export default function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/products/${id}`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to load product');
                const data = await res.json();
                setProduct(data.product);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSuccess = () => navigate('/admin');

    return (
        <Container className="py-4">
            <h2 className="mb-4">Edit Product</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {product && <ProductForm initialData={product} onSuccess={handleSuccess} />}
        </Container>
    );
}
