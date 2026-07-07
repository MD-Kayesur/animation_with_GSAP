import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './FollowBox.css'

export default function FollowBox() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapEl = wrapRef.current
    if (!wrapEl) return

    const targets = wrapEl.querySelectorAll('.FollowBox')

    // Initial setup: scale to 0 and center initially
    gsap.set(targets, {
      xPercent: -50,
      yPercent: -50,
      scale:0,
    })

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse coordinates relative to the Wrap container
      const rect = wrapEl.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.to(targets, {
        duration: 0.5,
        overwrite: 'auto',
        x: x,
        y: y,
        stagger: 0.15,
        ease: 'none',
      })

      const TL = gsap.timeline({
        defaults: { duration: 0.5, ease: 'none' },
      })

      TL.to(targets, {
        scale: 1,
        overwrite: 'auto',
        stagger: { amount: 0.15, from: 'start', ease: 'none' },
      })

      TL.to(
        targets,
        {
          overwrite: 'auto',
          scale: 0,
          stagger: { amount: 0.15, from: 'end', ease: 'none' },
        },
        '<+=2.5'
      )
    }

    const handleMouseLeave = () => {
      // Immediately scale down the follow boxes when leaving the container
      gsap.to(targets, {
        scale: 0,
        overwrite: 'auto',
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    wrapEl.addEventListener('mousemove', handleMouseMove)
    wrapEl.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      wrapEl.removeEventListener('mousemove', handleMouseMove)
      wrapEl.removeEventListener('mouseleave', handleMouseLeave)
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
          alt={`Follow illustration ${index + 1}`}
        />
      ))}
    </div>
  )
}
