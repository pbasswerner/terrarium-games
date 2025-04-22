// src/pages/LoginPage.jsx
import LoginForm from '../components/LoginForm';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function LoginPage() {
    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow">
                        <Card.Body>
                            <h3 className="text-center mb-4">Log In</h3>
                            <LoginForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
