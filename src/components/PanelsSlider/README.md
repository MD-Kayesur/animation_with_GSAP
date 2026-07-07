# GSAP Horizontal Panels Scroll (PanelsSlider)

An interactive, fluid, and hardware-accelerated horizontal snapping slider component built with **React**, **TypeScript**, and **GSAP (GreenSock Animation Platform) ScrollTrigger**.

This component features a special React-routing-safe architecture to avoid DOM unmount crashes.

---

## Component Code

### `PanelsSlider.tsx`
```tsx
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
```

### `PanelsSlider.css`
```css
.panels-slider-outer {
  width: 100%;
  overflow: hidden;
}

.panels-container {
  display: flex;
  flex-wrap: nowrap;
  width: 300vw; /* 3 panels, each 100vw */
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}

.panel {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #ffffff;
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
}

/* Panel Backgrounds (Premium Gradients) */
.panel:nth-child(1) {
  background: linear-gradient(135deg, #4f46e5, #06b6d4); /* Indigo to Cyan */
}

.panel:nth-child(2) {
  background: linear-gradient(135deg, #0f172a, #0d9488); /* Slate to Teal */
}

.panel:nth-child(3) {
  background: linear-gradient(135deg, #ea580c, #db2777); /* Orange to Pink */
}

.panel-title {
  font-family: var(--sans);
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  margin: 0 0 1rem;
  text-transform: uppercase;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
}

@media (min-width: 768px) {
  .panel-title {
    font-size: 5rem;
  }
}

.panel-desc {
  font-family: var(--sans);
  font-size: 1.25rem;
  font-weight: 300;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin: 0;
}

@media (min-width: 768px) {
  .panel-desc {
    font-size: 1.5rem;
  }
}
```

---

## Line-by-Line Code Breakdown

### `PanelsSlider.tsx`

* **`import { ScrollTrigger } from 'gsap/ScrollTrigger'`** (Line 3): Imports GSAP's scroll-based animation engine extension.
* **`gsap.registerPlugin(ScrollTrigger)`** (Line 7): Registers the ScrollTrigger plugin to enable scroll triggering within GSAP animations.
* **`const containerRef = useRef<HTMLDivElement>(null)`** (Line 10): Creates a reference to the outer wrapper DOM element. This root element is never modified or wrapped by GSAP, keeping it stable for React.
* **`const pinRef = useRef<HTMLDivElement>(null)`** (Line 11): Creates a reference to the inner wrapper DOM element that we want to pin.
* **`const ctx = gsap.context(() => { ... }, container)`** (Lines 18-32): Wraps all GSAP setup inside `gsap.context()`. This scopes selectors, animations, and ScrollTriggers to the component's root container.
* **`xPercent: -100 * (panels.length - 1)`** (Line 22): Moves the panels horizontally to the left. Since there are 3 panels, the offset will slide by $-200\%$ of panel width to reveal Panel 3.
* **`ease: 'none'`** (Line 23): Ensures the speed of the sliding animation maps exactly 1-to-1 with the user's scroll speed without acceleration/deceleration.
* **`trigger: pinEl`** (Line 25): Specifies the element that triggers the scroll-based animation (the inner wrapper).
* **`pin: true`** (Line 26): Pins (freezes) the container vertically. Since we pin `pinEl` (inside `container`), GSAP inserts the `.pin-spacer` wrapper inside our stable `containerRef.current`. React's root remains completely unmanipulated, which avoids unmounting crash bugs.
* **`scrub: 1`** (Line 27): Binds scroll progress to the animation position. The value `1` adds a smooth $1\text{ second}$ lag, giving the sliding a soft, premium momentum.
* **`snap: 1 / (panels.length - 1)`** (Line 28): Snaps the slides automatically to the nearest slide when scrolling stops.
* **`end: () => '+=' + pinEl.offsetWidth`** (Line 30): Calculates the end scroll length dynamically based on the width of the container, keeping it consistent across window resize.
* **`ctx.revert()`** (Line 36): Reverts all DOM modifications, deletes `.pin-spacer` elements, and kills active tweens and ScrollTriggers before React starts unmounting.

### `PanelsSlider.css`

* **`.panels-slider-outer { width: 100%; overflow: hidden; }`** (Lines 1-4): Standard layout style for the root unpinned container, hiding child content overflow.
* **`.panels-container { display: flex; flex-wrap: nowrap; width: 300vw; ... }`** (Lines 6-13): Sets up a flex container that does not wrap elements. The width is set to `300vw` (3 panels, each taking up $100\%$ viewport width).
* **`.panel { width: 100vw; height: 100vh; ... }`** (Lines 15-28): Sets each panel to occupy the exact width and height of the screen viewport.
* **`background: linear-gradient(...)`** (Lines 30-43): Gives each slide a modern gradient background to make the visual transition premium and engaging.
