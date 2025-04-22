// src/components/NavBar.jsx
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout(); // clears token + sets user to null
        window.location.href = '/';
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
                        {/*Admin-only links */}
                        {user?.isAdmin && (
                            <>
                                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                                <Nav.Link as={Link} to="/add-product">Add Product</Nav.Link>
                            </>
                        )}
                    </Nav>

                    <Nav>
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        ) : (
                            <NavDropdown title={user.email} id="profile-nav-dropdown" align="end">
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
