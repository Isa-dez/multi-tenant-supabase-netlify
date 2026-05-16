import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OrgHome from './routes/[orgSlug]/index'
import OrgProjectsPage from './routes/[orgSlug]/projects'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:orgSlug" element={<OrgHome />} />
        <Route path="/:orgSlug/projects" element={<OrgProjectsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
