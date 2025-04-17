import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const user = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        window.location.reload(); // Quick refresh to reset auth state
    };

    return (
        <Navbar expand="lg" className="bg-light shadow-sm sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
                    Terrarium Games
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/products">Shop</Nav.Link>
                        {user?.role === 'admin' && (
                            <Nav.Link as={Link} to="/add-product">Add Product</Nav.Link>
                        )}
                    </Nav>

                    <Nav>
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        ) : (
                            <NavDropdown title={user.username} id="profile-nav-dropdown" align="end">
                                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
