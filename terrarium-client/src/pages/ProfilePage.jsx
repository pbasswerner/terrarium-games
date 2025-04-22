import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UserInfoCard from '../components/UserInfoCard';
import BookmarkedGamesList from '../components/BookmarkedGamesList';
import NotifyMeList from '../components/NotifyMeList';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleLogout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        window.location.href = '/login';
    };

    if (loading || !user) return null;

    return (
        <Container fluid className="py-5">
            <Row>
                <Col xs={12} md="auto" className="mb-4 mb-md-0 pe-md-4">
                    <UserInfoCard user={user} onLogout={handleLogout} />
                </Col>
                <Col>
                    <BookmarkedGamesList />
                    <NotifyMeList className="mt-5" />
                </Col>
            </Row>
        </Container>
    );
}
