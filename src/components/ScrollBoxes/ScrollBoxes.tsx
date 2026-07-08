import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollBoxes.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function ScrollBoxes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const boxes = gsap.utils.toArray('.box')
      boxes.forEach((box, index) => {
        // Alternating 1 by 1 starting with right
        const isEvenIndex = index % 2 === 0

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: box as HTMLElement,
            start: 'top 90%',
            end: 'top 10%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        tl.to(box as HTMLElement, {
          x: () => {
            // Half of screen width minus half of box width (120px/2 = 60px) to touch the page edge exactly
            const maxTravel = window.innerWidth / 2 - 60
            return isEvenIndex ? maxTravel : -maxTravel
          },
          ease: 'power1.out',
        }, 0)

        tl.to(box as HTMLElement, {
          y: 50, // Elevates the box as it sweeps out
          ease: 'power2.in', // Slow start, fast end creates the curved arc sweep
        }, 0)

        tl.to(box as HTMLElement, {
          rotation: 360,
          borderRadius: '50px',
          ease: 'none',
        }, 0)
      })
    }, container)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="scroll-boxes-container">
      <h2 className="scroll-title">Scroll Down</h2>
      <p className="scroll-subtitle">Watch the boxes alternate directions (right and left) as you scroll</p>
      
      <div className="box">Box 1</div>
      <div className="box">Box 2</div>
      <div className="box">Box 3</div>
      <div className="box">Box 4</div>
      <div className="box">Box 5</div>
      <div className="box">Box 6</div>
    </div>
  )
}
