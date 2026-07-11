import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import viteLogo from '../../assets/vite.svg'
import './Navbar.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="navbar-header">
      <div className="navbar-logo">
        <img src={viteLogo} alt="Logo" className="logo-img" />
        <span className="logo-text">GSAP Play</span>
      </div>

      <nav className={`navbar-links ${isMenuOpen ? 'mobile-open' : ''}`}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/follow" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Mouse Follow
        </NavLink>
        <NavLink to="/follow-dynamic" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Dynamic Follow
        </NavLink>
        <NavLink to="/hero" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Hero Showcase
        </NavLink>
        <NavLink to="/panels" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Horizontal Scroll
        </NavLink>
        <NavLink to="/scroll-boxes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Scroll Boxes
        </NavLink>
        <NavLink to="/scroll-smoother-parallax" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Smoother Parallax
        </NavLink>
        <div className="mobile-only-action">
          <a href="https://github.com/MD-Kayesur/animation_with_GSAP" target="_blank" rel="noreferrer" className="github-btn" onClick={closeMenu}>
            GitHub
          </a>
        </div>
      </nav>

      <div className="navbar-actions">
        <a href="https://github.com/MD-Kayesur/animation_with_GSAP" target="_blank" rel="noreferrer" className="github-btn">
          GitHub
        </a>

        <button
          className={`navbar-toggle-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </header>
  )
}
