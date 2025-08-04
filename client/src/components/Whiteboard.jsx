import React from 'react'
import { Tldraw } from 'tldraw'
import { useSyncDemo } from '@tldraw/sync'
import 'tldraw/tldraw.css'

const Whiteboard = ({ roomId }) => {
  const store = useSyncDemo({ roomId })

  return (
    <div className="tldraw__editor h-full bg-[#101011]">
      {store && <Tldraw store={store} inferDarkMode defaultName="Editor" deepLinks />}
    </div>
  )
}

export default Whiteboard
