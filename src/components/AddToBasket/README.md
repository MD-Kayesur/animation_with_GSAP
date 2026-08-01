# Add To Basket Component

A dynamic, interactive "Add to Basket" micro-animation built with [Motion v12](https://motion.dev/) (`motion/react`) and React.

## Overview

When the user clicks the **Add to basket** button, the shoe product item flies in an arc trajectory directly into the shopping basket icon located in the top-right of the sandbox container. The basket responds with a spring-based physics knock and ripples an outline ring outward. Finally, a fresh product bounces back into view ready for the next interaction.

## Key Features

1. **Curved Arc Trajectory (`arc` function)**:
   Utilizes Motion 12's new `arc()` path generator to create natural, non-linear parabolic flight paths with customizable strength, peak, and rotation.
2. **Spring Physics & Velocity Inheritance**:
   The basket absorbs the impact of the incoming product by inheriting its exact collision velocity via `productX.getVelocity()` and `productY.getVelocity()`.
3. **Responsive Positioning**:
   Adapts cleanly across desktop and mobile screens while preserving the true top-right target calculation using `getBoundingClientRect()`.
4. **Theme Integrated**:
   Automatically adapts to light and dark modes using CSS custom properties (`--foreground`, `--layer`, `--accent`, etc.).

## Usage

```tsx
import AddToBasket from './components/AddToBasket/AddToBasket'

export default function MyPage() {
  return (
    <AddToBasket
      strength={0.5}
      peak={0.15}
      rotate={0.9}
      duration={0.45}
      basketVelocityFactor={0.05}
      direction="cw"
    />
  )
}
```
