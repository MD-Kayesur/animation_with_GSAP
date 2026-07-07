import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './PanelsSlider.css'

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger)

export default function PanelsSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const pinEl = pinRef.current
    if (!container || !pinEl) return

    // Create a GSAP context scoped to our container
    const ctx = gsap.context(() => {
      const panels = pinEl.querySelectorAll('.panel')

      // Apply the horizontal scroll animation
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          // Dynamically set end point based on container width
          end: () => '+=' + pinEl.offsetWidth,
        },
      })
    }, container)

    return () => {
      // Revert all animations and ScrollTriggers within this context
      // This removes pin-spacers and resets DOM structure before React unmounts
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="panels-slider-outer">
      <div className="panels-container" ref={pinRef}>
        <div className="panel">
          <h2 className="panel-title">Crafting Motion</h2>
          <p className="panel-desc">
            Scroll down to initiate the horizontal scrubbing container. This panel transitions smoothly into the next.
          </p>
        </div>
        <div className="panel">
          <h2 className="panel-title">GSAP ScrollTrigger</h2>
          <p className="panel-desc">
            By pinning the container, we lock the screen viewport vertically while moving elements horizontally.
          </p>
        </div>
        <div className="panel">
          <h2 className="panel-title">Fluid Snapping</h2>
          <p className="panel-desc">
            Each panel snaps cleanly into place, creating a premium presentation slide experience.
          </p>
        </div>
      </div>
    </div>
  )
}
