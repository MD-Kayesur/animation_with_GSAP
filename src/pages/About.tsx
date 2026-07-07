import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import '../App.css'

export default function About() {
  return (
    <>
      <section id="center" style={{ padding: '40px 20px', minHeight: 'auto' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>About This Project</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px', color: 'var(--text)' }}>
            This application is built as a playground to explore advanced web animations using 
            <strong> GSAP (GreenSock Animation Platform)</strong>, React, and Vite.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent-border)',
              borderRadius: '8px',
              padding: '20px',
              flex: '1'
            }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)', marginTop: 0 }}>Vite Speed</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                Powered by Vite for ultra-fast Hot Module Replacement (HMR) and development experience.
              </p>
            </div>
            <div style={{
              background: 'var(--code-bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '20px',
              flex: '1'
            }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-h)', marginTop: 0 }}>React State</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                Leverages React 19 for declarative rendering and interactive component states.
              </p>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <img src={viteLogo} alt="Vite Logo" style={{ height: '32px' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--border)' }}>+</span>
            <img src={reactLogo} alt="React Logo" style={{ height: '32px' }} />
          </div>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}
