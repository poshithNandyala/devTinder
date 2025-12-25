import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import WindowSize from './components/WindowSize'

function App() {
  const [count, setCount] = useState(0)

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
      <WindowSize />
     </div>
  )
}

export default App
