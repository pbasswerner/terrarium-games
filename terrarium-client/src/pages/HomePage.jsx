import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import GameCard from '../components/GameCard';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../api';

export default function HomePage() {
    const [prismaGames, setPrismaGames] = useState([]);
    const [shopifyGames, setShopifyGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();


    useEffect(() => {
        const fetchGames = async () => {
            try {
                const [prismaRes, shopifyRes] = await Promise.all([
                    fetch(`${API_BASE}/products`),
                    fetch(`${API_BASE}/api/shopify/products`)
                ]);

                const prismaData = await prismaRes.json();
                const shopifyData = await shopifyRes.json();

                setPrismaGames(prismaData.products || []);
                setShopifyGames(shopifyData.products || []);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError('Failed to load games.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) return <Spinner animation="border" className="m-5" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="py-5">
            <h2 className="mb-4">Terrarium Games</h2>
            <Row xs={1} sm={2} md={3} lg={4}>
                {prismaGames.map(game => (
                    <Col key={`prisma-${game.id}`} className="mb-4">
                        <GameCard
                            product={game}
                            isAdmin={user?.isAdmin}
                        />
                    </Col>
                ))}
                {shopifyGames.map((game) => (
                    <Col key={`shopify-${game.id}`} className="mb-4">
                        <GameCard
                            product={{
                                ...game,
                                slug: null // disables /products/:slug navigation
                            }}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
