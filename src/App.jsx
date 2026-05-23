import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import WidgetLayer from './pages/WidgetLayer'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WidgetLayer />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
