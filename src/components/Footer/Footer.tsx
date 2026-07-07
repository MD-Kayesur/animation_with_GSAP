import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="ticks"></div>
      <div className="footer-content">
        <div className="footer-left">
          <p className="copyright">
            &copy; {new Date().getFullYear()} GSAP Play. All rights reserved.
          </p>
        </div>
        <div className="footer-right">
          <ul className="footer-social-links">
            <li>
              <a href="https://github.com/MD-Kayesur/animation_with_GSAP" target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg className="social-icon" role="presentation">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer" aria-label="Discord">
                <svg className="social-icon" role="presentation">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer" aria-label="X">
                <svg className="social-icon" role="presentation">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
