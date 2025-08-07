import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { FiFileText, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import SettingsModal from './SettingsModal';

export default function Sidebar({
    isOpen
}: {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}) {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    //const [userName, setUserName] = useState('Mateen Akram');
    const [userName] = useState('Mateen Akram');

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            className={clsx(
                'fixed top-16 left-0 h-full bg-[#121417] text-white z-50 transition-all duration-300',
                {
                    'w-64': isOpen,
                    'w-0': !isOpen,
                }
            )}
            style={{ overflow: isOpen ? 'auto' : 'hidden' }}
        >


            {isOpen && (
                <div className="mt-16 px-5">
                    <h2 className="text-lg font-bold mb-6">Transcribe</h2>
                    <p className="mb-2 flex items-center gap-2"><FiFileText /> Transcripts</p>
                    <button className="text-sm bg-gray-700 px-3 py-1 rounded">
                        Transcript 1
                    </button>
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
                                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-600 cursor-pointer"
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
