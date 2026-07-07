# Dynamic Mouse Follow Animation (FollowBoxDynamic)

An advanced variation of the mouse-follow animation that dynamically scales elements up **only while the cursor is moving** and scales them down **when the cursor stops moving** using timer checks and GSAP tweens.

---

## Component Code

### `FollowBoxDynamic.tsx`
```tsx
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
```

### `FollowBoxDynamic.css`
```css
#Wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  overflow: hidden;
}

#Wrap .FollowBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  pointer-events: none; /* Ignore pointer events so they do not block mousemove listeners */
  box-shadow: var(--shadow);
}

#Wrap .FollowBox:nth-child(1) {
  z-index: 4;
}

#Wrap .FollowBox:nth-child(2) {
  z-index: 3;
}

#Wrap .FollowBox:nth-child(3) {
  z-index: 2;
}

#Wrap .FollowBox:nth-child(4) {
  z-index: 1;
}
```

---

## Line-by-Line Code Breakdown

### `FollowBoxDynamic.tsx`

* **`const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)`** (Line 7): Creates a persistent ref container to store the active `setTimeout` ID so we can clear/reset it across rendering cycles without causing re-renders.
* **`const initialMouseMoveRef = useRef<boolean>(true)`** (Line 8): Creates a ref to track whether this is the start of a mouse movement session.
* **`gsap.set(targets, { ... transformOrigin: 'center' })`** (Lines 20-25): Configures initial styles. `transformOrigin: 'center'` ensures that when the images scale up and down, they do so relative to their exact center points.
* **`if (initialMouseMoveRef.current) { ... }`** (Lines 32-42): When the mouse first starts moving, we toggle `initialMouseMoveRef.current` to `false` and smoothly scale the images up to size `1`. The `stagger` makes them scale up one after the other.
* **`if (timerRef.current) { clearTimeout(timerRef.current) }`** (Lines 45-47): If the mouse is still moving, we cancel the previously scheduled "stop detection" timer so the images don't shrink prematurely.
* **`timerRef.current = setTimeout(mouseStopped, 200)`** (Line 50): Sets a new timer. If the mouse does not move for another $200\text{ milliseconds}$ ($0.2\text{ seconds}$), the browser triggers `mouseStopped()`.
* **`function mouseStopped() { ... }`** (Lines 52-64): Runs when the mouse stands still for $200\text{ms}$. It resets `initialMouseMoveRef.current` back to `true` (so the next movement triggers scale-up again) and scales the images back down to `0`.
* **`gsap.to(targets, { duration: 0.5, ... stagger: 0.1 })`** (Lines 67-74): Moves the images to the cursor position `(x, y)` with a smooth `0.1s` sequential stagger.
* **`const handleMouseLeave = () => { ... }`** (Lines 77-88): If the mouse leaves the box completely, we cancel any running timeouts, reset movement tracking, and immediately shrink the trail to `0` to keep the UI clean.
