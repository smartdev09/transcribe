import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TranscriptPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { name, content } = state || {};
    useEffect(() => {
        console.log('TranscriptPage mounted:', content);
    }, []);
    if (!name || !content) {
        return <div className="p-8 text-red-500">Transcript data not found.</div>;
    }

    return (
        <div className="p-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 text-white rounded bg-purple-600 hover:bg-purple-700 transition"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-bold mb-4">{name.replace('.txt', '')}</h1>

            <div className="bg-zinc-600 p-4 rounded shadow text-sm text-white">
                {content}
            </div>
        </div>
    );
}
