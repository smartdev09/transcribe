import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cx } from '~/lib/utils'
import { InfoTooltip } from './InfoTooltip'
import * as dialogExt from '@tauri-apps/plugin-dialog'
import * as config from '~/lib/config'
import { invoke } from '@tauri-apps/api/core'
import { useNavigate } from 'react-router-dom'
import { usePreferenceProvider } from '~/providers/Preference'

export default function AdvancedTranscribe() {
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()
	const [collecting, setCollecting] = useState(false)
	const navigate = useNavigate()
	const preference = usePreferenceProvider()

	async function selectFolder() {
		const selectedFolder = await dialogExt.open({
			multiple: false,
			directory: true,
		})
		if (!selectedFolder) {
			return
		}
		setCollecting(true)
		const files = await invoke<string[]>('glob_files', {
			folder: selectedFolder,
			patterns: [...config.audioExtensions, ...config.videoExtensions],
			recursive: preference.advancedTranscribeOptions.includeSubFolders,
		})
		setCollecting(false)
		navigate('/batch', { state: { files, outputFolder: selectedFolder } })
	}
	return (
		<div className={cx('collapse !overflow-visible mb-5', open && 'collapse-open')}>
			<div
				onMouseDown={() => setOpen(!open)}
				className={cx('flex items-center justify-between cursor-pointer label-text text-xl font-bold mb-2')}>

				{t('common.advanced')}
				{open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
			</div>
			{open && (
				<div className={cx(`collapse-content w-full`)}>
					<div className="label mt-5">
						<span className="label-text text-2xl font-bold">
							{t('common.transcribe-folder')}
							<span className="text-primary text-sm ms-2 pb-2 text-purple-600">(beta)</span>
						</span>
					</div>
					<div className="form-control w-full mt-3">
						<label className="label cursor-pointer">
							<span className="label-text flex items-center gap-1 cursor-default">
								<InfoTooltip text={t('common.include-sub-folders')} />
								{t('common.include-sub-folders')}
							</span>
							<input
								type="checkbox"
								className="toggle toggle-primary"
								checked={preference.advancedTranscribeOptions.includeSubFolders}
								onChange={(e) =>
									preference.setAdvancedTranscribeOptions({ ...preference.advancedTranscribeOptions, includeSubFolders: e.target.checked })
								}

							// onChange={onRecognizeSpeakerChange}
							/>
						</label>
					</div>
					<div className="form-control w-full mt-3">
						<label className="label cursor-pointer">
							<span className="label-text flex items-center gap-1 cursor-default">
								<InfoTooltip text={t('common.skip-if-transcript-exists')} />
								{t('common.skip-if-transcript-exists')}
							</span>
							<input
								type="checkbox"
								className="toggle toggle-primary"
								checked={preference.advancedTranscribeOptions.skipIfExists}
								onChange={(e) =>
									preference.setAdvancedTranscribeOptions({ ...preference.advancedTranscribeOptions, skipIfExists: e.target.checked })
								}
							/>
						</label>
					</div>
					<div className="form-control w-full mt-3">
						<label className="label cursor-pointer">
							<span className="label-text flex items-center gap-1 cursor-default">
								<InfoTooltip text={t('common.place-transcript-next-to-files')} />
								{t('common.place-transcript-next-to-files')}
							</span>
							<input
								type="checkbox"
								className="toggle toggle-primary"
								checked={preference.advancedTranscribeOptions.saveNextToAudioFile}
								onChange={(e) =>
									preference.setAdvancedTranscribeOptions({ ...preference.advancedTranscribeOptions, saveNextToAudioFile: e.target.checked })
								}
							/>
						</label>
					</div>

					<button onClick={() => selectFolder()} className="btn btn-primary opacity-80 w-full mt-5 bg-purple-600 hover:bg-purple-700">
						{collecting && <span className="loading loading-spinner"></span>}
						{t('common.select-folder')}
					</button>
				</div>
			)}
		</div>
	)
}
