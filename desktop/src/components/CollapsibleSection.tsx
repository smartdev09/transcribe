import { useState, ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cx } from '~/lib/utils'

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cx('collapse !overflow-visible mb-5', open && 'collapse-open')}>
      <div
        onMouseDown={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer label-text text-xl font-bold mb-2"
      >
        <span>{title} </span>
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>

      {open && <div className="collapse-content w-full">{children}</div>}
    </div>
  )
}
