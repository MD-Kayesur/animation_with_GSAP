import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DUMMY_BOOKS } from './books.data'
import videoAsset from './Create_a_highly_realistic_cine (1).mp4'
import './Hero.css'

export default function Hero() {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [activeBookIndex, setActiveBookIndex] = React.useState(0)

  React.useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    let targetTime = 0
    let animationFrameId: number

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const scrollHeight = rect.height - window.innerHeight
      if (scrollHeight <= 0) return

      // Calculate scroll progress (0 to 1) inside container
      const progress = Math.max(0, Math.min(1, -rect.top / scrollHeight))

      // Calculate active book index based on progress
      const totalBooks = DUMMY_BOOKS.length
      const index = Math.min(
        totalBooks - 1,
        Math.floor(progress * totalBooks)
      )
      setActiveBookIndex(index)

      if (video.duration) {
        targetTime = progress * video.duration
      }
    }

    const updateVideoTime = () => {
      if (video && video.duration && !video.seeking) {
        // Smoothly interpolate the current time towards target time
        const diff = targetTime - video.currentTime
        if (Math.abs(diff) > 0.01) {
          video.currentTime += diff * 0.25
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoTime)
    }

    window.addEventListener('scroll', handleScroll)
    animationFrameId = requestAnimationFrame(updateVideoTime)

    // Initial check when metadata loads
    const onLoadedMetadata = () => {
      handleScroll()
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

  const book = DUMMY_BOOKS[activeBookIndex]

  return (
    <div ref={containerRef} className="hero-scroll-container">
      {/* Sticky Frame */}
      <div className="hero-sticky-frame">
        {/* Background Video */}
        <video
          ref={videoRef}
          src={videoAsset}
          muted
          playsInline
          preload="auto"
          className="hero-bg-video"
        />

        {/* Ambient Overlays */}
        <div className="hero-overlay-dark" />
        <div className="hero-overlay-gradient" />

        {/* Content Wrapper */}
        <div className="hero-content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBookIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="hero-book-card"
            >
              <span className="hero-badge">
                Featured Book {activeBookIndex + 1} of {DUMMY_BOOKS.length}
              </span>
              <h1 className="hero-title">
                {book.title}
              </h1>
              <p className="hero-author">
                by {book.author}
              </p>
              <p className="hero-description">
                {book.description}
              </p>
              <div className="hero-btn-container">
                <button className="hero-btn-primary">
                  Borrow Now
                </button>
                <button className="hero-btn-outline">
                  Read Summary
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
