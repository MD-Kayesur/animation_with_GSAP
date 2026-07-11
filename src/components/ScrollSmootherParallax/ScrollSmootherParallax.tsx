import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollSmootherParallax.css'

// Register plugins
gsap.registerPlugin(ScrollTrigger)

/**
 * ScrollSmootherParallax
 *
 * Demonstrates custom parallax speed via GSAP ScrollTrigger.
 * - "ref" box scrolls at native speed (1.0)
 * - "a", "b", "c" boxes scroll at speed 0.5 (half speed)
 * - Each box's top edge aligns with ref's top edge when centered in the viewport
 */

export default function ScrollSmootherParallax() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Get all the parallax boxes
    const boxA = container.querySelector('.box-a') as HTMLElement
    const boxB = container.querySelector('.box-b') as HTMLElement
    const boxC = container.querySelector('.box-c') as HTMLElement
    const boxRef = container.querySelector('.box-ref') as HTMLElement

    if (!boxA || !boxB || !boxC || !boxRef) return

    const parallaxBoxes = [
      { element: boxA, speed: 0.5 },
      { element: boxB, speed: 0.5 },
      { element: boxC, speed: 0.5 },
    ]

    // Custom parallax animation using ScrollTrigger scrub
    // Formula: y = (scrollPos - sRef) * (1 - speed)
    // where sRef = scroll position when ref box's top edge is centered in viewport
    // This means each box's top edge aligns with ref's top edge when centered in viewport
    const ctx = gsap.context(() => {
      parallaxBoxes.forEach(({ element: box, speed }) => {
        gsap.fromTo(
          box,
          {
            y: () => {
              const innerHeight = window.innerHeight
              const containerTop = container.getBoundingClientRect().top + window.scrollY
              const refTop = containerTop + boxRef.offsetTop
              // sRef = scroll position when refTop is at 50vh
              const sRef = refTop - innerHeight / 2
              const sStart = 0
              return (sStart - sRef) * (1 - speed)
            },
          },
          {
            y: () => {
              const innerHeight = window.innerHeight
              const containerTop = container.getBoundingClientRect().top + window.scrollY
              const refTop = containerTop + boxRef.offsetTop
              const sRef = refTop - innerHeight / 2
              const sEnd = document.documentElement.scrollHeight - innerHeight
              return (sEnd - sRef) * (1 - speed)
            },
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 0,
              end: 'max',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        )
      })
    }, container)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="smoother-parallax-container">
      <div className="parallax-scene">
        {/* Reference box - scrolls at normal speed */}
        <div className="box box-ref">ref</div>
        {/* Parallax boxes - data-speed="0.5" means they move at half speed */}
        <div className="box box-a">a</div>
        <div className="box box-b">b</div>
        <div className="box box-c">c</div>
      </div>

      {/* Info section */}
      <div className="parallax-info">
        <h2 className="info-title">ScrollSmoother Parallax</h2>
        <p className="info-desc">
          <code>ref</code> scrolls normally. All divs start at <code>top: 80vh</code>.
          Boxes <code>a</code>, <code>b</code>, and <code>c</code> have{' '}
          <code>data&#8209;speed: 0.5</code> — they move at half the scroll speed.
          Each box's top edge aligns with <code>ref</code>'s top edge when centered in the viewport.
        </p>
      </div>
    </div>
  )
}
