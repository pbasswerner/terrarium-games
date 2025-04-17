import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="p-4 border rounded bg-white shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Log In</h2>
                <LoginForm />
            </div>
        </div>
    );
}
