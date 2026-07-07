# GSAP Mouse Follow Animation (FollowBox)

An interactive, fluid, and hardware-accelerated mouse-tracking trail animation built with **React**, **TypeScript**, and **GSAP (GreenSock Animation Platform)**.

---

## Component Code

### `FollowBox.tsx`
```tsx
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
      scale: 0,
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
```

### `FollowBox.css`
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
  pointer-events: none; /* Ignore mouse events to not block mousemove on the container */
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

### `FollowBox.tsx`

* **`import { useEffect, useRef } from 'react'`** (Line 1): Imports the standard React hooks. `useRef` lets us target DOM elements, and `useEffect` lets us execute and clean up side-effects (adding event listeners).
* **`import gsap from 'gsap'`** (Line 2): Imports the core GSAP engine to run tweening and timeline animations.
* **`import './FollowBox.css'`** (Line 3): Imports the component-specific styles so they are applied automatically.
* **`export default function FollowBox() {`** (Line 5): Declares and exports the `FollowBox` React component.
* **`const wrapRef = useRef<HTMLDivElement>(null)`** (Line 6): Creates a ref hook to track the `#Wrap` container `div`.
* **`useEffect(() => {`** (Line 8): Opens a side-effect hook that runs once after the component mounts.
* **`const wrapEl = wrapRef.current; if (!wrapEl) return`** (Lines 9-10): Safely references the raw DOM element of the wrapper. If it doesn't exist, we halt initialization.
* **`const targets = wrapEl.querySelectorAll('.FollowBox')`** (Line 12): Queries and collects all the image tags (`.FollowBox`) nested under the container to animate them.
* **`gsap.set(targets, { xPercent: -50, yPercent: -50, scale: 0 })`** (Lines 15-19): Instantly centers the images under the cursor using transforms and sets their size (scale) to `0` (hidden) so they aren't visible initially.
* **`const handleMouseMove = (e: MouseEvent) => {`** (Line 21): Declares the mouse movement handler callback.
* **`const rect = wrapEl.getBoundingClientRect()`** (Line 23): Measures the current position of the container relative to the viewport (crucial for scroll offsets and headers).
* **`const x = e.clientX - rect.left`** (Line 24): Calculates the horizontal position of the mouse relative to the container.
* **`const y = e.clientY - rect.top`** (Line 25): Calculates the vertical position of the mouse relative to the container.
* **`gsap.to(targets, { duration: 0.5, overwrite: 'auto', x, y, stagger: 0.15, ease: 'none' })`** (Lines 27-34): Animates the position (x and y) of the images towards the cursor. `stagger: 0.15` delays the start of each consecutive image to create the trail effect. `overwrite: 'auto'` stops previous conflicting movement animations.
* **`const TL = gsap.timeline({ defaults: { duration: 0.5, ease: 'none' } })`** (Lines 36-38): Creates a new GSAP timeline to coordinate scaling sequence.
* **`TL.to(targets, { scale: 1, overwrite: 'auto', stagger: { amount: 0.15, from: 'start', ease: 'none' } })`** (Lines 40-44): Animates the scale of the images up to `1` sequentially, starting from the first image (`from: 'start'`).
* **`TL.to(targets, { overwrite: 'auto', scale: 0, stagger: { amount: 0.15, from: 'end', ease: 'none' } }, '<+=2.5')`** (Lines 46-54): Animates the scale back down to `0` sequentially, starting from the last image (`from: 'end'`), exactly `2.5 seconds` after the start of the scale-up animation. This dissolves the trail.
* **`const handleMouseLeave = () => {`** (Line 57): Declares the callback for when the mouse leaves the container.
* **`gsap.to(targets, { scale: 0, overwrite: 'auto', duration: 0.3, ease: 'power2.out' })`** (Lines 59-64): Immediately shrinks all trail images back to `0` when the cursor leaves the element.
* **`wrapEl.addEventListener('mousemove', handleMouseMove)`** (Line 67): Registers the mouse listener on the container element.
* **`wrapEl.addEventListener('mouseleave', handleMouseLeave)`** (Line 68): Registers the mouse leave listener on the container element.
* **`return () => {`** (Line 70): Returns a cleanup function that runs on unmount.
* **`wrapEl.removeEventListener('mousemove', handleMouseMove)`** (Line 71): Removes the mousemove listener.
* **`wrapEl.removeEventListener('mouseleave', handleMouseLeave)`** (Line 72): Removes the mouseleave listener.
* **`gsap.killTweensOf(targets)`** (Line 73): Instantly kills all active GSAP animations on these targets to prevent memory leaks and coordinate mismatches.
* **`const images = [ ... ]`** (Lines 77-82): An array of high-quality image URLs to render.
* **`return ( ... )`** (Lines 84-105): Renders the component HTML, mapping each URL to an absolute `<img className="FollowBox" />` stacked inside a relative container.

### `FollowBox.css`

* **`#Wrap { position: relative; ... overflow: hidden; }`** (Lines 111-120): The container must have `position: relative` so that its absolute children are positioned relative to its coordinate space. `overflow: hidden` clips images that go outside the container bounds, avoiding scrollbars.
* **`#Wrap .FollowBox { position: absolute; top: 0; left: 0; pointer-events: none; ... }`** (Lines 122-132): Positioned absolute so that GSAP can move them dynamically via transforms. `pointer-events: none` makes images ignore mouse clicks and hover triggers, letting the mouse pass through to the container underneath.
* **`#Wrap .FollowBox:nth-child(i) { z-index: n; }`** (Lines 134-148): Orders the images stacked on top of each other. The first element in the DOM has the highest `z-index` (4), meaning it appears on top of the other images in the trail.
