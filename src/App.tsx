import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OrgProjectsPage from './routes/[orgSlug]/projects'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:orgSlug/projects" element={<OrgProjectsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
