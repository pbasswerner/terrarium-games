// GameDetailPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import GameDetailPage from '../pages/GameDetailPage';
import * as AuthContext from '../context/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock useParams and useNavigate
jest.mock('react-router-dom', () => {
    const original = jest.requireActual('react-router-dom');
    return {
        ...original,
        useParams: () => ({ slug: 'test-slug' }),
        useNavigate: () => jest.fn(),
    };
});

// Mock fetch
global.fetch = jest.fn();

describe('GameDetailPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders game details if fetch is successful', async () => {
        // Mock auth
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ id: 1, email: 'test@example.com' });

        // Mock API response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                product: {
                    id: 1,
                    title: 'Test Game',
                    price: '19.99',
                    status: 'Available',
                    description: 'This is a test game.',
                    imageUrl: 'http://example.com/image.jpg',
                },
            }),
        });

        render(
            <MemoryRouter initialEntries={['/products/test-slug']}>
                <Routes>
                    <Route path="/products/:slug" element={<GameDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText('Test Game')).toBeInTheDocument();
        expect(screen.getByText('$19.99')).toBeInTheDocument();
        expect(screen.getByText('This is a test game.')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/image.jpg');
    });

    test('displays error if fetch fails', async () => {
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ id: 1, email: 'test@example.com' });

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Game not found' }),
        });

        render(
            <MemoryRouter initialEntries={['/products/test-slug']}>
                <Routes>
                    <Route path="/products/:slug" element={<GameDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText('Failed to load game.')).toBeInTheDocument();
    });
});
