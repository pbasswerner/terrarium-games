import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import { useAuth } from '../context/AuthContext';

export default function GameCard({ product, onDelete, isAdmin = false, onEdit }) {
    const navigate = useNavigate();
    const user = useAuth();

    if (!product) return null;

    const {
        id,
        title,
        description,
        imageUrl,
        slug,
        price,
        status,
        shopifyHandle
    } = product;

    const isShopify = !!shopifyHandle;

    const getStatusVariant = (status) => {
        const lower = status?.toLowerCase() || '';
        if (lower === 'available' || lower === 'in stock') return 'success';
        if (lower === 'coming soon') return 'warning';
        return 'secondary';
    };

    const handleCardClick = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        if (slug) navigate(`/products/${slug}`);
        else if (shopifyHandle) navigate(`/shopify/${shopifyHandle}`);
    };

    const handleNotify = async (e) => {
        e.stopPropagation();

        try {
            const res = await fetch('/api/notify', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id }),
            });

            if (res.status === 401) {
                navigate('/login');
                return;
            }

            if (!res.ok) {
                const errData = await res.json();
                alert(errData.error || 'Notify request failed');
            } else {
                alert('You will be notified!');
            }
        } catch (err) {
            console.error('Notify error:', err);
            alert('Something went wrong. Please try again.');
        }
    };



    return (
        <Card
            className="mb-3 shadow-sm position-relative"
            style={{ cursor: slug ? 'pointer' : 'default' }}
            onClick={handleCardClick}
        >
            {/* Top-right corner: Bookmark and optional ✕ */}
            <div className="position-absolute top-0 end-0 m-2 d-flex gap-1 align-items-start" style={{ zIndex: 2 }}>
                {user && !isAdmin && <BookmarkButton productId={id} />}
                {onDelete && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        ✕
                    </Button>
                )}
            </div>

            {/* Product image */}
            {imageUrl && (
                <Card.Img
                    variant="top"
                    src={imageUrl}
                    alt={title}
                    loading="lazy"
                    style={{ objectFit: 'cover', maxHeight: '200px' }}
                />
            )}

            <Card.Body className="position-relative">
                <Card.Title>{title}</Card.Title>
                {price && (
                    <p className="text-muted mb-2">
                        ${parseFloat(price).toFixed(2)}
                    </p>
                )}
                <Card.Text>{description}</Card.Text>

                <div className="d-flex gap-2 mt-2 flex-wrap">
                    {/* Notify or Buy button */}
                    {isShopify ? (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://terrarium-games.myshopify.com/products/${shopifyHandle}`, '_blank');
                            }}
                        >
                            Buy Now
                        </Button>
                    ) : (
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={handleNotify}
                            style={{ borderColor: '#0d6efd', color: '#0d6efd' }}
                        >
                            Notify Me!
                        </Button>
                    )}

                    {/* Admin-only controls */}
                    {isAdmin && (
                        <>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => navigate(`/edit-product/${product.id}`)}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const confirm = window.confirm(`Delete product "${title}"?`);
                                    if (!confirm) return;
                                    try {
                                        await fetch(`/api/products/${product.id}`, {
                                            method: 'DELETE',
                                            credentials: 'include',
                                        });
                                        window.location.reload();
                                    } catch (err) {
                                        console.error('Error deleting product:', err);
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </div>

                {/* Shopify badge only */}
                {isShopify && status && (
                    <Badge
                        bg={getStatusVariant(status)}
                        className="position-absolute bottom-0 end-0 m-2 text-uppercase"
                    >
                        {status}
                    </Badge>
                )}
            </Card.Body>
        </Card>
    );
}
