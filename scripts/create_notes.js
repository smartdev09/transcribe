import { $ } from 'bun'
import clipboard from 'clipboardy'

// Get the last tag commit
const gitInfo = (await $`git describe --tags --abbrev=0`.text()).trim()
const lastTagCommit = (await $`git rev-list -n 1 ${gitInfo.trim()}`.text()).trim()
const current = (await $`git rev-parse HEAD`.text()).trim()
const messages = await $`git log --oneline ${lastTagCommit}..${current}`.text()
const latestTwoTags = await $`git tag --sort=-creatordate | head -n 2`.text()

const prompt = `
Old Release notes:
"""
What's new? 🎉📣

- 🌍 Fix linux i18n (Thanks for @oleole39)
- ⏱️ Add option to transcribe word timestamps
- 🍏 Add macOS dmg installation background
- 💻 Set GPU preference to high performance on Windows by default
- 🔠 Max letters per sentence! (Thanks for @sdimantsd)
- 🎮 Choose GPU device (Thanks for @israelxss for the suggestion!)

**Full Changelog**: https://github.com/thewh1teagle/vibe/compare/v0.0.0...v0.0.1
"""

Please write new one. based on the new commits. 
Please keep only new features that important to simple users.
And add technical features only if they are critical.
Return it as snippet so I can copy it.
Commits are:
${messages}

Also, change the **full changelog** based on this tags: ${latestTwoTags}
`
console.log(prompt)
await clipboard.write(prompt)
console.log('Prompt in your clipboard 🦄')
console.log('https://chat.openai.com/')
