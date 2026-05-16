import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { resolveOrganizationBySlug } from '../../lib/tenant'

export default function OrgProjectsPage() {
  const { orgSlug } = useParams()
  const [org, setOrg] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgSlug) return

    ;(async () => {
      setLoading(true)

      const organization = await resolveOrganizationBySlug(orgSlug)
      setOrg(organization)

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (!error) setProjects(data ?? [])

      setLoading(false)
    })()
  }, [orgSlug])

  if (loading) return <p>Loading…</p>
  if (!org) return <p>Organization not found or access denied.</p>

  return (
    <div>
      <h1>{org.name} – Projects</h1>
      <ul>
        {projects.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
