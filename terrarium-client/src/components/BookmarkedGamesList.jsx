import { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import GameCard from './GameCard';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function BookmarkedGamesList() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal state
    const [showModal, setShowModal] = useState(false);
    const [bookmarkToDelete, setBookmarkToDelete] = useState(null);

    // fetch bookmarks on mount
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await fetch('/api/bookmarks', { credentials: 'include' });
                const data = await res.json();
                setBookmarks(data.bookmarks || []);
            } catch (err) {
                console.error('Failed to fetch bookmarks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    const handleDelete = async () => {
        if (!bookmarkToDelete) return;

        try {
            await fetch(`/api/bookmarks/${bookmarkToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            setBookmarks((prev) =>
                prev.filter((b) => b.id !== bookmarkToDelete.id)
            );
        } catch (err) {
            console.error('Failed to delete bookmark:', err);
        } finally {
            setShowModal(false);
            setBookmarkToDelete(null);
        }
    };

    return (
        <div className="mb-5">
            <h4 className="mb-3" style={{ color: '#6B4226' }}>
                Bookmarked Games
            </h4>

            {loading ? (
                <Spinner animation="border" />
            ) : bookmarks.length === 0 ? (
                <Card body className="text-muted">
                    You haven’t bookmarked any games yet.
                </Card>
            ) : (
                bookmarks.map(({ id, product }) => (
                    <GameCard
                        key={id}
                        product={product}
                        onDelete={() => {
                            setBookmarkToDelete({ id, title: product.title });
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
                    bookmarkToDelete
                        ? `Remove "${bookmarkToDelete.title}" from your bookmarks?`
                        : 'Are you sure you want to delete this bookmark?'
                }
            />
        </div>
    );
}
