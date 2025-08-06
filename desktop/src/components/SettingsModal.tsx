import { ModifyState, cx } from '~/lib/utils'
import SettingsPage from '~/pages/settings/Page'
import * as os from '@tauri-apps/plugin-os'

interface SettingsModalProps {
	visible: boolean
	setVisible: ModifyState<boolean>
}

export default function SettingsModal({ visible, setVisible }: SettingsModalProps) {
	if (!visible) return null

	return (
		<div
			className={cx(
				'modal modal-open backdrop-blur-3xl !bg-base-100 overflow-y-auto',
				os.platform() !== 'linux' && 'dark:!bg-transparent'
			)}
		>
			{/* Independent Back Button */}
			<div className="absolute top-4 left-4 z-50">
				<button
					onClick={() => setVisible(false)}
					className="text-white hover:bg-gray-600 px-4 py-2 rounded transition"
				>
					← Back
				</button>
			</div>

			{/* The actual Settings page content */}
			<SettingsPage setVisible={setVisible} />
		</div>
	)
}
