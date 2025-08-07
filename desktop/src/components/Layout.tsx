import { ReactNode, useState } from 'react';
import DropModal from './DropModal';
import SettingsModal from './SettingsModal';
import Toast from './Toast';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';
import { PanelRightClose } from 'lucide-react';
import ModelOptions from '~/components/Params';
import { viewModel } from '~/pages/home/viewModel';
import { Mic } from 'lucide-react'
import { cx } from '~/lib/utils'
export default function Layout({ children }: { children: ReactNode }) {
	const [settingsVisible, setSettingsVisible] = useState(false);
	const [isSidebarOpen, setSidebarOpen] = useState(false);
	const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
	const vm = viewModel();

	return (
		<div className="flex min-h-screen text-white bg-zinc-900">
			{/* Sidebar */}
			<Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} refreshKey={Date.now()} />

			{/* Main Layout */}
			<div className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>

				{/* Top Bar */}
				<div className="w-full h-16 flex items-center justify-between px-4 bg-zinc-800 border-b border-zinc-700 shadow-sm fixed top-0 z-40">
					<div className="flex items-center space-x-4">
						<button
							onClick={() => setSidebarOpen(prev => !prev)}
							className="text-white p-2 bg-zinc-600 hover:bg-zinc-700 rounded"
						>
							<FiMenu size={24} />
						</button>
					</div>
					<div className='bg-zinc-600 hover:bg-zinc-700 text-white transition-all duration-200'>
						<button
							onClick={() => vm.preference.setHomeTabIndex(0)}
							className={cx(
								'ml-2 px-4 py-2 rounded-full shadow-md flex items-center space-x-2',

								vm.preference.homeTabIndex === 0 && 'ring-2 ring-blue-300'
							)}
						>
							<Mic className="w-5 h-5" />
							<span className="font-medium">New Recording</span>
						</button>

					</div>
					<button
						onClick={() => setRightSidebarOpen(prev => !prev)}
						className="text-white p-2 bg-zinc-600 hover:bg-zinc-700 rounded"
					>
						<PanelRightClose size={24} />
					</button>
				</div>

				{/* Main Content */}
				<div className="flex flex-grow pt-16 pb-[80px]">
					<div className={`transition-all duration-300 px-10 w-full ${isRightSidebarOpen ? 'max-w-[calc(100%-500px)]' : 'w-full'}`}>
						<Toast />
						{settingsVisible && (
							<SettingsModal visible={settingsVisible} setVisible={setSettingsVisible} />
						)}
						<DropModal />
						<div className="mt-4 w-full">
							{children}
						</div>
					</div>

					{/*  Right Sidebar  */}
					{isRightSidebarOpen && (
						<div className="w-[500px] p-4 border-l border-zinc-700 bg-zinc-800 max-h-screen overflow-y-auto transition-all duration-300">
							<ModelOptions
								options={vm.preference.modelOptions}
								setOptions={vm.preference.setModelOptions}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
