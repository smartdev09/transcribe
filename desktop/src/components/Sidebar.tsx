import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { FiFileText, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import SettingsModal from './SettingsModal';
import { readDir, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({
    isOpen,
    refreshKey,
}: {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    refreshKey: number;
}) {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName] = useState('Mateen Akram');
    const [transcripts, setTranscripts] = useState<{ name: string; content: string }[]>([]);
    //const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
    const [selectedTranscript] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const loadTranscripts = async () => {
        try {
            const files = await readDir('', { baseDir: BaseDirectory.Document });
            const transcriptFiles = files.filter(file =>
                file.name?.startsWith('transcript-') && file.name.endsWith('.txt')
            );

            const loaded = await Promise.all(
                transcriptFiles.map(async (file) => {
                    const content = await readTextFile(file.name!, { baseDir: BaseDirectory.Document });
                    return { name: file.name!, content };
                })
            );

            loaded.sort((a, b) => b.name.localeCompare(a.name));
            setTranscripts(loaded);
        } catch (err) {
            console.error('Failed to load transcripts:', err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadTranscripts();
        }
    }, [isOpen, refreshKey]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedContent = transcripts.find(t => t.name === selectedTranscript)?.content;

    return (
        <div
            className={clsx(
                'fixed top-16 left-0 h-full bg-[#121417] text-white z-50 transition-all duration-300',
                { 'w-64': isOpen, 'w-0': !isOpen }
            )}
            style={{ overflow: isOpen ? 'auto' : 'hidden' }}
        >
            {isOpen && (
                <div className="mt-16 px-5">
                    <h2 className="text-lg font-bold mb-6">Transcribe</h2>
                    <p className="mb-2 flex items-center gap-2"><FiFileText /> Transcripts</p>

                    {transcripts.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(`/transcript/${encodeURIComponent(t.name.replace('.txt', ''))}`, {
                                state: { name: t.name, content: t.content },
                            })}
                            className="text-sm px-3 py-1 rounded block w-full mb-2 text-left truncate bg-gray-700 hover:bg-purple-700 transition"
                            title={t.name}
                        >
                            {t.name.replace('.txt', '')}
                        </button>
                    ))}


                    {transcripts.length === 0 && (
                        <p className="text-xs text-gray-400 mt-2">No transcripts found.</p>
                    )}

                    {selectedTranscript && (
                        <div className="mt-4 p-2 bg-zinc-800 rounded text-xs max-h-60 overflow-y-auto border border-gray-600">
                            {selectedContent}
                        </div>
                    )}
                </div>
            )}

            {isOpen && settingsVisible && (
                <SettingsModal visible={settingsVisible} setVisible={setSettingsVisible} />
            )}

            {isOpen && (
                <div className="absolute bottom-4 left-4 w-56 border-t text-sm text-white" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="w-full p-2 flex items-center space-x-3 rounded-md hover:bg-gray-700 transition"
                    >
                        <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{userName}</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute bottom-14 left-0 w-full bg-gray-700 shadow-lg rounded-md overflow-hidden z-50">
                            <div className="p-4 flex flex-col items-center">
                                <div className="text-sm font-semibold mb-2">Mateen's Workspace</div>
                                <div className="text-sm text-gray-300">mateen.akram124@gmail.com</div>
                            </div>
                            <div className="border-t border-gray-600 my-2"></div>
                            <ul className="text-sm">
                                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-600 cursor-pointer">
                                    <FiUser /> Profile
                                </li>
                                <li
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => setSettingsVisible(true)}
                                >
                                    <FiSettings /> Settings
                                </li>
                                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-600 cursor-pointer">
                                    <FiLogOut /> Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
