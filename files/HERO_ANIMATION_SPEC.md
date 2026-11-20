# Hero Animation Spec

## Final composition (desktop >= 1024 px)
```
[ Headline + description + buttons ]   [        3D Honda Vezel        ]
        left ~45%                            right ~55%, overlaps text edge slightly
```
The car sits slightly overlapping the end of the headline so the two read as one joined composition.

## Intro timeline (play once on load, ~2.2 s total)
| t (s) | Car (3D) | Text block |
|---|---|---|
| 0.0 | Off-screen **right** (x = +12), slight yaw 35 deg, opacity 0 | Off-screen **left** (translateX -120 px), opacity 0 |
| 0.0 - 1.6 | Moves right -> left to final x, yaw eases to ~ -20 deg (side-3/4 view), ease `power3.out` | Moves left -> right to final position, ease `power3.out` |
| 1.6 | The two **meet** (join) | |
| 1.6 - 2.2 | Small settle bounce, headline words stagger a subtle highlight, buttons fade up | |
| 2.2+ | Idle: car floats +/-0.05 units, slow breathing; mouse parallax rotates +/-8 deg | static |

Navbar fades in at 0.0 and stays fixed at the top.

## Rules
- Use GSAP timeline (`gsap.timeline({ defaults: { ease: "power3.out" } })`) driving both the DOM text and the R3F group ref.
- Start the timeline only when the GLB has finished loading (`useProgress` -> `active === false`), otherwise show a thin progress bar over the poster image.
- `prefers-reduced-motion: reduce`: skip the intro, render final state, no idle motion.
- Mobile (< 768 px): stack vertically. Text first, car below, car enters from right only, same timing. Lower pixel ratio (`dpr={[1, 1.5]}`).
- Lighting: environment map (drei `Environment preset="city"`), one soft key light, contact shadow (`ContactShadows`) under the car, dark background to match the site.
- Do not auto-rotate continuously; keep the car readable from the side.
