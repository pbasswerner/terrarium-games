import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import GameCard from '../components/GameCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../api';


export default function AdminDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }

        const fetchGames = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/products`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error fetching games');
                setGames(data.products);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load games');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [user, navigate]);

    const handleDelete = (id) => {
        setGames((prevGames) => prevGames.filter((g) => g.id !== id));
    };

    const handleEdit = (game) => {
        navigate(`/edit-product/${game.id}`);
    };

    if (loading) return <Spinner animation="border" className="m-5" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
                <Button onClick={() => navigate('/add-product')} variant="success">
                    ➕ Add New Game
                </Button>
            </div>

            <Row xs={1} sm={2} md={3}>
                {games.map((game) => (
                    <Col key={game.id} className="mb-4">
                        <GameCard
                            product={game}
                            isAdmin
                            onEdit={handleEdit}
                            onDelete={async () => {
                                const confirm = window.confirm(`Are you sure you want to delete "${game.title}"?`);
                                if (!confirm) return;

                                try {
                                    const res = await fetch(`/api/products/${game.id}`, {
                                        method: 'DELETE',
                                        credentials: 'include',
                                    });

                                    if (!res.ok) {
                                        const data = await res.json();
                                        throw new Error(data.error || 'Delete failed');
                                    }

                                    handleDelete(game.id);
                                } catch (err) {
                                    console.error('Delete error:', err);
                                    alert('Failed to delete product.');
                                }
                            }}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
