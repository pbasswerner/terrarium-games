import { useParams } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

export default function ShopifyDetailPage() {
    const { handle } = useParams();

    return (
        <Container className="py-5 text-center">
            <h2>Shopify Game</h2>
            <p>This game is available for purchase on our storefront.</p>
            <Button
                variant="success"
                size="lg"
                href={`https://terrarium-games.myshopify.com/products/${handle}`}
                target="_blank"
            >
                Buy Now
            </Button>
        </Container>
    );
}
