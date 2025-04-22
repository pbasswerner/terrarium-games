import { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import GameCard from './GameCard';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { API_BASE } from '../api';

export default function NotifyMeList({ className = '' }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal state
    const [showModal, setShowModal] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);

    // fetch notify-me requests on mount
    useEffect(() => {
        const fetchNotifyRequests = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/notify`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setRequests(data.requests || []);
            } catch (err) {
                console.error('Failed to fetch notify requests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifyRequests();
    }, []);

    const handleDelete = async () => {
        if (!requestToDelete) return;

        try {
            await fetch(`${API_BASE}/api/notify/ ${requestToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            setRequests((prev) =>
                prev.filter((r) => r.id !== requestToDelete.id)
            );
        } catch (err) {
            console.error('Failed to delete notify request:', err);
        } finally {
            setShowModal(false);
            setRequestToDelete(null);
        }
    };

    return (
        <div className={className}>
            <h4 className="mb-3" style={{ color: '#6B4226' }}>
                Notify Me Requests
            </h4>

            {loading ? (
                <Spinner animation="border" />
            ) : requests.length === 0 ? (
                <Card body className="text-muted">
                    You haven't requested notifications for any games.
                </Card>
            ) : (
                requests.map(({ id, product }) => (
                    <GameCard
                        key={id}
                        product={product}
                        onDelete={() => {
                            setRequestToDelete({ id, title: product.title });
                            setShowModal(true);
                        }}
                    />
                ))
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleDelete}
                message={
                    requestToDelete
                        ? `Cancel notify - me request for "${requestToDelete.title}" ? `
                        : 'Are you sure you want to delete this request?'
                }
            />
        </div>
    );
}
