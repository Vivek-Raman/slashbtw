import { Navigate, Route, Routes } from 'react-router-dom'

import CanvasPage from '@/components/CanvasPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CanvasPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
