import React, { useEffect } from 'react'
import { useState } from 'react'
const WindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Width: {width}</h1>
      <h1 className="text-3xl font-bold">Height: {height}</h1>
    </div>
  )
}

export default WindowSize