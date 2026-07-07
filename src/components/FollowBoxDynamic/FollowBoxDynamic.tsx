import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './FollowBoxDynamic.css'

export default function FollowBoxDynamic() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialMouseMoveRef = useRef<boolean>(true)

  useEffect(() => {
    const wrapEl = wrapRef.current
    if (!wrapEl) return

    const targets = wrapEl.querySelectorAll('.FollowBox')

    // Initial setup: scale to 0 and center initially
    gsap.set(targets, {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: 'center',
      scale: 0,
    })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapEl.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // If it's the first mouse movement, scale the images up
      if (initialMouseMoveRef.current) {
        initialMouseMoveRef.current = false
        
        gsap.to(targets, {
          scale: 1,
          stagger: 0.02,
          ease: 'sine.out',
          overwrite: 'auto'
        })
      }

      // Clear the timer every time the mouse moves
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Set a timer for 0.2 seconds (200ms) to detect when the mouse stops moving
      timerRef.current = setTimeout(mouseStopped, 200)

      function mouseStopped() {
        console.log('stopped')
        
        // Reset this variable so we can track the first mouse move again
        initialMouseMoveRef.current = true
        
        gsap.to(targets, {
          scale: 0,
          stagger: 0.02,
          ease: 'sine.out',
          overwrite: 'auto'
        })
      }

      // Move the follow boxes smoothly to the mouse position
      gsap.to(targets, {
        duration: 0.5,
        overwrite: 'auto',
        x: x,
        y: y,
        stagger: 0.1,
        ease: 'none',
      })
    }

    const handleMouseLeave = () => {
      // Reset variables, clear timer, and immediately scale down elements on leave
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      initialMouseMoveRef.current = true
      gsap.to(targets, {
        scale: 0,
        overwrite: 'auto',
        duration: 0.3,
        ease: 'sine.out',
      })
    }

    wrapEl.addEventListener('mousemove', handleMouseMove)
    wrapEl.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      wrapEl.removeEventListener('mousemove', handleMouseMove)
      wrapEl.removeEventListener('mouseleave', handleMouseLeave)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      gsap.killTweensOf(targets)
    }
  }, [])

  const images = [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
  ]

  return (
    <div id="Wrap" ref={wrapRef}>
      {images.map((src, index) => (
        <img
          key={index}
          className="FollowBox"
          src={src}
          alt={`Dynamic Follow ${index + 1}`}
        />
      ))}
    </div>
  )
}
