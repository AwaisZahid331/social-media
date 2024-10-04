import { useHistory } from 'react-router-dom'

export function Logo() {
  const history = useHistory()
  return (
    <section className="logo" onClick={() => history.push(`/`)}>
      <span>SP</span>
    </section>
  )
}
