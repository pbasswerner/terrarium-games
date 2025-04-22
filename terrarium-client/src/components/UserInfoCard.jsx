import { Card, Button } from 'react-bootstrap';

export default function UserInfoCard({ user, onLogout }) {
    if (!user) return null;

    return (
        <Card
            className="shadow-sm border-0 rounded-3 position-sticky"
            style={{
                top: '2rem',
                backgroundColor: '#fdf6e3',
                minWidth: '250px',
                maxWidth: '300px',
                height: 'fit-content',
            }}
        >
            <Card.Body>
                <Card.Title className="mb-3" style={{ color: '#6B4226' }}>
                    Account Details
                </Card.Title>

                <p><strong>Email:</strong> {user.email}</p>
                {user.createdAt && (
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                )}
                <p><strong>Role:</strong> {user.isAdmin ? 'Admin' : 'User'}</p>

                <Button variant="danger" onClick={onLogout} className="mt-3 w-100">
                    Log Out
                </Button>
            </Card.Body>
        </Card>
    );
}
