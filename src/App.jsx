import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OrgHome from './routes/[orgSlug]/index'
import OrgProjectsPage from './routes/[orgSlug]/projects'
import Login from './routes/Login'
import Signup from './routes/Signup'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/:orgSlug" element={<OrgHome />} />
        <Route path="/:orgSlug/projects" element={<OrgProjectsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
