import { ReactNode, useState } from 'react';
//import { useTranslation } from 'react-i18next';
import DropModal from './DropModal';
import SettingsModal from './SettingsModal';
import Toast from './Toast';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';
import ModelOptions from '~/components/Params';
import { viewModel } from '~/pages/home/viewModel';
import { PanelRightClose } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
	const [settingsVisible, setSettingsVisible] = useState(false);
	const [isSidebarOpen, setSidebarOpen] = useState(true);
	const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
	//const { t } = useTranslation();
	const vm = viewModel();

	return (
		<div className="flex min-h-screen text-white transition-all duration-300 relative">


			<Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
			{!isSidebarOpen && (
				<button
					onClick={() => setSidebarOpen(true)}
					className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded text-xl shadow-md"
				>
					<FiMenu size={24} />
				</button>
			)}


			<button
				onClick={() => setRightSidebarOpen(prev => !prev)}
				className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded text-xl shadow-md"
			>
				<PanelRightClose size={24} />

			</button>
			<div className={`flex w-full transition-all duration-300 bg-zinc-900 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
				<div className="flex-grow flex flex-col pb-[80px] px-10">
					<Toast />
					{settingsVisible && (
						<SettingsModal visible={settingsVisible} setVisible={setSettingsVisible} />
					)}
					<DropModal />
					<div className="mt-20">
						{/*<div className="text-center">
							<h1 className="text-4xl mb-10 text-base-content font-bold">
								{t('common.app-title')}
							</h1>
						</div>*/}
						{children}
					</div>
				</div>

				{isRightSidebarOpen && (
					<div className="w-[500px] p-4 border-l border-zinc-700 bg-zinc-800 max-h-screen overflow-y-auto">
						<ModelOptions
							options={vm.preference.modelOptions}
							setOptions={vm.preference.setModelOptions}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
