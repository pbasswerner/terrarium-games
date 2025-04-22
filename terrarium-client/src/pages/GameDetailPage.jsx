import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../api';

export default function GameDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const user = useAuth();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/products/slug/${slug}`);

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Game not found');
                setGame(data.product);
            } catch (err) {
                console.error('Error fetching game:', err);
                setError('Failed to load game.');
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [slug]);

    const handleNotify = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/notify`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: game.id }),
            });

            if (res.status === 401) {
                navigate('/login');
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Notify request failed');
            } else {
                alert('You will be notified!');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        }
    };

    if (loading) return <Spinner animation="border" className="m-5" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!game) return null;

    return (
        <Container className="py-5">
            <h2>{game.title}</h2>

            {game.imageUrl && (
                <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="img-fluid my-3"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
            )}

            <h5 className="text-muted">${parseFloat(game.price).toFixed(2)}</h5>

            {game.status && (
                <Badge bg="secondary" className="mb-3 text-uppercase">
                    {game.status}
                </Badge>
            )}

            <p>{game.description}</p>

            {/* Notify Me button only for Prisma game */}
            <Button
                variant="outline-primary"
                size="md"
                onClick={handleNotify}
                className="notify-btn"
            >
                Notify Me!
            </Button>
        </Container>
    );
}
