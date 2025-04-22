
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import * as AuthContext from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

global.fetch = jest.fn();

jest.mock('../components/GameCard', () => ({ product, isAdmin, onDelete, onEdit }) => (
    <div data-testid="GameCard">{product.title}</div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('AdminDashboardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('redirects if user is not admin', () => {
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { isAdmin: false } });

        render(<AdminDashboardPage />, { wrapper: MemoryRouter });

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('renders game cards when user is admin', async () => {
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { isAdmin: true } });

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                products: [
                    { id: 1, title: 'Game One' },
                    { id: 2, title: 'Game Two' }
                ]
            }),
        });

        render(<AdminDashboardPage />, { wrapper: MemoryRouter });

        await waitFor(() => {
            expect(screen.getByText('Game One')).toBeInTheDocument();
            expect(screen.getByText('Game Two')).toBeInTheDocument();
        });
    });

    test('shows error alert if fetch fails', async () => {
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { isAdmin: true } });

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Fetch failed' })
        });

        render(<AdminDashboardPage />, { wrapper: MemoryRouter });

        await waitFor(() => {
            expect(screen.getByText('Failed to load games')).toBeInTheDocument();
        });
    });
});
