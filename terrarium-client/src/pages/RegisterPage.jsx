import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="p-4 border rounded bg-white shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Create an Account</h2>
                <RegisterForm />
            </div>
        </div>
    );
}
