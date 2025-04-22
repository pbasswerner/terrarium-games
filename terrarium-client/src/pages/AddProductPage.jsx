// src/pages/AddProductPage.jsx
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';

export default function AddProductPage() {
    const navigate = useNavigate();

    const handleSuccess = (newProduct) => {
        // Redirect to admin dashboard or show confirmation
        navigate('/admin');
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Add New Product</h2>
            <ProductForm onSuccess={handleSuccess} />
        </Container>
    );
}
