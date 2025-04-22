import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../api';

export default function BookmarkButton({ productId }) {
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkId, setBookmarkId] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchBookmarks = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/bookmarks`, {
                    credentials: 'include',
                });
                const data = await res.json();
                const existing = data.bookmarks.find(b => b.product.id === productId);
                if (existing) {
                    setBookmarked(true);
                    setBookmarkId(existing.id);
                }
            } catch (err) {
                console.error('Error loading bookmarks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [productId, user]);

    const toggleBookmark = async () => {
        if (!user) return alert('Please log in to bookmark games.');

        try {
            if (bookmarked) {
                await fetch(`${API_BASE}/api/bookmarks/${bookmarkId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                setBookmarked(false);
                setBookmarkId(null);
            } else {
                const res = await fetch(`${API_BASE}/api/bookmarks`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId }),
                });
                const data = await res.json();
                setBookmarked(true);
                setBookmarkId(data.bookmark.id);
            }
        } catch (err) {
            console.error('Bookmark toggle failed:', err);
        }
    };

    return (
        <Button
            variant="light"
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                toggleBookmark();
            }}
            disabled={loading}
            style={{
                color: bookmarked ? '#0d6efd' : '#ccc',
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
            }}
            title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            {bookmarked ? <BsBookmarkFill size={20} /> : <BsBookmark size={20} />}
        </Button>
    );
}
