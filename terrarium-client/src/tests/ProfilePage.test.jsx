import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import * as AuthContext from '../context/AuthContext';

// Mock subcomponents
jest.mock('../components/UserInfoCard', () => () => <div data-testid="UserInfoCard" />);
jest.mock('../components/BookmarkedGamesList', () => () => <div data-testid="BookmarkedGamesList" />);
jest.mock('../components/NotifyMeList', () => () => <div data-testid="NotifyMeList" />);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to /login if user is not logged in and not loading', () => {
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, loading: false });

    render(<ProfilePage />, { wrapper: MemoryRouter });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('renders nothing if still loading', () => {
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, loading: true });

    const { container } = render(<ProfilePage />, { wrapper: MemoryRouter });
    expect(container).toBeEmptyDOMElement();
  });

  test('renders all sections when user is logged in', () => {
    const fakeUser = { id: 1, email: 'test@example.com', isAdmin: false };
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: fakeUser, loading: false });

    render(<ProfilePage />, { wrapper: MemoryRouter });

    expect(screen.getByTestId('UserInfoCard')).toBeInTheDocument();
    expect(screen.getByTestId('BookmarkedGamesList')).toBeInTheDocument();
    expect(screen.getByTestId('NotifyMeList')).toBeInTheDocument();
  });
});
