import { NavLink } from 'react-router-dom'
import viteLogo from '../../assets/vite.svg'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar-header">
      <div className="navbar-logo">
        <img src={viteLogo} alt="Logo" className="logo-img" />
        <span className="logo-text">GSAP Play</span>
      </div>
      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          About
        </NavLink>
        <NavLink to="/follow" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Mouse Follow
        </NavLink>
        <NavLink to="/follow-dynamic" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dynamic Follow
        </NavLink>
      </nav>
      <div className="navbar-actions">
        <a href="https://github.com/MD-Kayesur/animation_with_GSAP" target="_blank" rel="noreferrer" className="github-btn">
          GitHub
        </a>
      </div>
    </header>
  )
}
