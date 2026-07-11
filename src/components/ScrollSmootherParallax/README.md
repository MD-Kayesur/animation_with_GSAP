# ScrollSmoother Parallax Alignment (ScrollSmootherParallax)

An advanced scroll implementation using **GSAP ScrollSmoother** and **ScrollTrigger** that achieves precise top-edge alignment for elements with variable heights and speed factors.

Normally, GSAP's `ScrollSmoother` translates elements with `data-speed` so that they align with their CSS-defined "native" layout position only when their **vertical center points** cross the center of the viewport. However, in this component, all target elements (`box-a`, `box-b`, `box-c`) of differing heights (100px, 200px, 400px) must align their **top edges** exactly with the reference element (`box-ref`) when the top edge of the reference element is centered vertically in the viewport (`50vh`).

---

## Component Code

### `ScrollSmootherParallax.tsx`
```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import './ScrollSmootherParallax.css'

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function ScrollSmootherParallax() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Temporarily extract and clean up data-speed attributes
    // This prevents standard ScrollSmoother from automatically center-aligning these specific boxes,
    // allowing us to apply custom alignment logic.
    const speedBoxes = container.querySelectorAll('.box[data-speed]')
    const configs: { element: HTMLElement; speed: number }[] = []

    speedBoxes.forEach((boxEl) => {
      const box = boxEl as HTMLElement
      const speed = parseFloat(box.getAttribute('data-speed') || '0.5')
      configs.push({ element: box, speed })
      
      // Store custom attribute and remove data-speed so ScrollSmoother effects bypasses them
      box.removeAttribute('data-speed')
      box.setAttribute('data-custom-speed', speed.toString())
    })

    // 2. Create the smooth scroller FIRST!
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 2,   // seconds it takes to "catch up" to native scroll position
      effects: true // still look for other data-speed and data-lag attributes on elements
    })

    // 3. Create custom ScrollTrigger animations with gsap.context
    const ctx = gsap.context(() => {
      configs.forEach(({ element: box, speed }) => {
        gsap.fromTo(box,
          {
            y: () => {
              const boxRef = container.querySelector('.box-ref') as HTMLElement
              if (!boxRef) return 0
              const innerHeight = window.innerHeight
              const refTop = boxRef.offsetTop // Top position relative to parent content flow
              
              // Scroll position where refTop's top edge is aligned with the center of the viewport (50vh)
              const sRef = refTop - innerHeight / 2
              const sStart = 0
              
              // Return initial translation at scroll position 0
              return (sStart - sRef) * (1 - speed)
            }
          },
          {
            y: () => {
              const boxRef = container.querySelector('.box-ref') as HTMLElement
              if (!boxRef) return 0
              const innerHeight = window.innerHeight
              const refTop = boxRef.offsetTop
              const sRef = refTop - innerHeight / 2
              
              // Maximum scrollable height
              const sEnd = document.documentElement.scrollHeight - innerHeight
              
              // Return final translation at max scroll position
              return (sEnd - sRef) * (1 - speed)
            },
            ease: 'none',
            scrollTrigger: {
              trigger: '#smooth-content',
              start: 0,
              end: 'max',
              scrub: true,
              invalidateOnRefresh: true,
            }
          }
        )
      })
    }, container)

    return () => {
      ctx.revert()
      smoother.kill()
      
      // Restore attributes to their original state on unmount
      configs.forEach(({ element, speed }) => {
        element.setAttribute('data-speed', speed.toString())
        element.removeAttribute('data-custom-speed')
      })
    }
  }, [])

  return (
    <div ref={containerRef} className="smoother-parallax-container">
      {/* Information Overlay */}
      <div className="info-overlay">
        <h2>ScrollSmoother Parallax</h2>
        <p><strong>Goal:</strong> Align top edges of all boxes (a, b, c) with the top of the <code>ref</code> box when the <code>ref</code> box's top edge reaches the vertical center of the viewport.</p>
        <p><strong>Parameters:</strong></p>
        <ul>
          <li><code>ref</code>: Scrolls normally (no data-speed)</li>
          <li><code>a</code>, <code>b</code>, <code>c</code>: Height 100px, 200px, 400px; <code>data-speed="0.5"</code></li>
          <li>CSS position: <code>top: 80vh</code></li>
        </ul>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#ff7777' }}>
          Watch the red Viewport Center line and purple Native Reference Line align perfectly with the tops of all four boxes.
        </p>
      </div>

      {/* Main Viewport Center Line indicator (fixed) */}
      <div className="middle"></div>

      {/* Smooth Scroll Structure */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="box box-ref">ref</div>
          <div className="box box-a" data-speed="0.5">a</div>
          <div className="box box-b" data-speed="0.5">b</div>
          <div className="box box-c" data-speed="0.5">c</div>
          <div className="refline"></div>
        </div>
      </div>
    </div>
  )
}
```

### `ScrollSmootherParallax.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300;400;600;700&display=swap');

.smoother-parallax-container {
  background-color: #111;
  font-family: "Signika Negative", sans-serif, Arial;
  overscroll-behavior: none;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  position: relative;
  min-height: 100vh;
}

#smooth-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

#smooth-content {
  overflow: visible;
  width: 100%;
  /* set a height because the contents are position: absolute, thus natively there's no height */
  height: 4000px;

  background-image:
    linear-gradient(rgba(255,255,255,.07) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255,255,255,.07) 2px, transparent 2px),
    linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
}

.box {
  width: 100px;
  background: linear-gradient(#61c3fb 50%, #04a8d8 50%);
  position: absolute;
  z-index: 100;
  font-size: 30px;
  text-align: center;
  will-change: transform;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-ref {
  top: 80vh;
  left: 100px;
  height: 100px;
}

.box-a {
  top: 80vh;
  left: 250px;
  height: 100px;
}

.box-b {
  top: 80vh;
  left: 400px;
  height: 200px;
}

.box-c {
  top: 80vh;
  left: 550px;
  height: 400px;
}

.middle {
  position: fixed;
  top: 50%;
  left: 0;
  height: 2px;
  width: 100%;
  background: #ff2a2a;
  transform: translateY(-50%);
  z-index: 999;
  pointer-events: none;
}

.middle::after {
  content: 'VIEWPORT CENTER (50vh)';
  position: absolute;
  right: 20px;
  top: -20px;
  color: #ff2a2a;
  font-size: 12px;
  font-family: monospace;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
}

.refline {
  position: absolute;
  top: 80vh;
  background: #aa3bff;
  height: 2px;
  width: 100%;
  z-index: 90;
}

.refline::after {
  content: 'NATIVE REFERENCE LINE (top: 80vh)';
  position: absolute;
  left: 20px;
  top: -20px;
  color: #c084fc;
  font-size: 12px;
  font-family: monospace;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
}
```

---

## Line-by-Line Code Breakdown & Mathematical Explanation

### The Alignment Challenge

By default, when `ScrollSmoother` creates parallax effects using `data-speed`, it translates the element using the formula:
$$y_{smoother} = (S - S_{center}) \times (1 - speed)$$

Where:
- $S$ is the current scroll position.
- $S_{center}$ is the scroll position where the **vertical center** of the element aligns with the vertical center of the viewport (`50vh`).

For two boxes of heights $H_1$ and $H_2$ located at the same starting position $Top_{CSS}$ in the document flow, their vertical centers will be:
- $Center_1 = Top_{CSS} + \frac{H_1}{2}$
- $Center_2 = Top_{CSS} + \frac{H_2}{2}$

Because their center points differ, $S_{center, 1} \neq S_{center, 2}$. As a result, when the top of the reference element is in the middle of the screen, their top edges will be displaced by:
$$y_{offset} = \frac{H}{2} \times (1 - speed)$$

For elements with height $H$ and `speed = 0.5`, this results in a vertical offset of $\frac{H}{4}$ pixels. To ensure that **all top edges align exactly** at the reference line, we bypass `ScrollSmoother`'s automatic parser and apply our own mathematical interpolation.

### The Mathematical Formula

Let:
- $S_{ref}$ be the scroll position where the top edge of `box-ref` is at the center of the viewport (`50vh`).
- Since `box-ref` starts at $Top_{CSS} = 80\text{vh}$, we have:
  $$S_{ref} = 80\text{vh} - 50\text{vh} = 30\text{vh}$$
  In code, this is calculated dynamically as `refTop - window.innerHeight / 2`.
- At this scroll position ($S = S_{ref}$), the translation `y` must be exactly $0$ for all elements:
  $$y(S_{ref}) = 0$$
- At any scroll position $S$, the element must scroll at `speed` (e.g. `0.5`) relative to the viewport. This means the translation `y` must be:
  $$y(S) = (S - S_{ref}) \times (1 - speed)$$

### GSAP ScrollTrigger Implementation

To implement this dynamically and responsively:
1. **Dynamic Attribute Stripping** (Lines 18-28):
   Before creating `ScrollSmoother`, we find all elements with `data-speed` inside the container. We extract their speeds, remove the `data-speed` attribute, and save them as `data-custom-speed`. This stops `ScrollSmoother.create()` from setting up default center-based parallax, giving us full control.
2. **ScrollTrigger Range Mapping** (Lines 40-79):
   We define a GSAP `fromTo` animation that spans the entire scroll range from $S = 0$ to $S = S_{max}$ (`end: 'max'`).
   - At scroll start ($S_1 = 0$), we animate `y` from:
     $$y_{start} = -S_{ref} \times (1 - speed)$$
   - At scroll end ($S_2 = S_{max}$), we animate `y` to:
     $$y_{end} = (S_{max} - S_{ref}) \times (1 - speed)$$
3. **Linear Scrubbing**:
   Since the tween runs with `ease: 'none'` and `scrub: true`, GSAP interpolates the `y` translation linearly between $y_{start}$ and $y_{end}$ as the user scrolls. The interpolation at any scroll position $S$ is:
   $$y(S) = y_{start} + \frac{S}{S_{max}} \times (y_{end} - y_{start})$$
   $$y(S) = -S_{ref} \times (1 - speed) + \frac{S}{S_{max}} \times \left( (S_{max} - S_{ref}) \times (1 - speed) - (-S_{ref} \times (1 - speed)) \right)$$
   $$y(S) = -S_{ref} \times (1 - speed) + \frac{S}{S_{max}} \times S_{max} \times (1 - speed)$$
   $$y(S) = (S - S_{ref}) \times (1 - speed)$$

This perfectly aligns the top edges at $S = S_{ref}$, regardless of window size, document height, or element height, and recalculates flawlessly on resize (`invalidateOnRefresh: true`).
