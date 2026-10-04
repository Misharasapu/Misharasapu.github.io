#projects/portfolio #learning/web #learning/animation

# 04 The hero animation

## Map

One canvas (a drawing surface), about 2,400 dots, and three target shapes. The same dots travel from one shape to the next, so your story (engineering, then data, then AI) reads as one continuous transformation.

```
          precompute once                         every frame (about 60 per second)
 +---------------------------------+         +-------------------------------------+
 | shapes as lists of points:      |         | t = time since start                |
 |  0 noise                        |  --->   | which transition are we in?         |
 |  1 bike drawing                 |         | for each dot: blend from A to B     |
 |  2 data clusters                |         | colour by role (ice, slate, amber)  |
 |  3 neural network               |         | draw 2,400 tiny squares             |
 +---------------------------------+         +-------------------------------------+
```

**Analogy:** a CNC machine running a toolpath. The paths (shapes) are computed up front; at run time the machine only interpolates between stored coordinates. Nothing is worked out during the cut, so it runs smoothly.

## Step 1: turning shapes into points (sampling)

Each shape is built from simple primitives:

| Primitive | Used for |
| --- | --- |
| Line | Frame tubes, dimension lines, network edges |
| Arc (part of a circle) | Wheels, chainring, network nodes |
| Curve (quadratic) | The bike's curved main frame, the saddle |
| Blob (random scatter around a centre) | The data clusters |

The code shares out the 2,400 points across the primitives in proportion to their length, so long lines get more dots. Then it **sorts every shape's points from left to right**. Point number 500 in the bike and point number 500 in the network are therefore in roughly the same area, so each dot only travels a short way. That is what makes the morph look like a flow rather than an explosion.

A **seeded random** generator makes the "random" clusters identical on every visit, so the design is fixed.

## Step 2: the timeline (a pure function of time)

```
0.0s  -> 1.2s   noise assembles into the bike   (grid behind it)
2.4s  -> 3.6s   bike morphs into data clusters  (one cluster turns amber at 3.9s)
4.4s  -> 5.6s   clusters morph into the network
5.7s  -> 6.6s   a pulse of light travels left to right through the network
6.6s            the output node lights amber (a prediction)
6.8s            stop
```

**The key design rule:** every frame is computed only from `t`, the elapsed time. That single decision makes all of these easy:

- **Pause:** stop advancing `t`.
- **Replay:** set `t` back to 0.
- **Reduced motion:** draw `t = 6.8s` once and stop.
- **Testing:** `?hero-t=4100` in the URL freezes that exact moment.
- **Resizing:** redraw the same `t` at the new size.

**Analogy:** a cam profile. The follower's position is a fixed function of shaft angle, so you can stop the shaft anywhere and know exactly where everything is.

## Step 3: blending and easing

For each dot:

```
progress p = how far through this transition (0 to 1), minus a small per-dot delay
p          = easeInOut(p)            slow start, fast middle, slow end
position   = A + (B - A) x p         straight-line blend between the two shapes
```

The **per-dot delay** (up to about 0.4s, increasing from left to right) is what makes the change sweep across the picture like a wave.

## Step 4: drawing fast

- Dots are grouped by colour, then drawn as tiny squares (`fillRect`), one colour at a time. That cuts state changes, the slow part.
- Pixel density is capped at 2x, so very high-resolution phones do not draw four times the pixels.
- On small screens the point count halves to 1,200.
- Drawing stops completely when the animation ends, the hero scrolls off screen, or the tab is hidden. Nothing burns battery in the background.

## Step 5: the rules it must obey

| Rule | How it is met |
| --- | --- |
| Nothing moves for more than 5s without a way to stop it (WCAG 2.2.2) | Pause and Replay button; it stops by itself at 6.8s |
| Reduced motion | Reads `prefers-reduced-motion` and draws the final frame once |
| No JS | Still poster image plus all three captions in the HTML |
| Decorative only | The canvas is `aria-hidden`; the meaning is in the captions |
| Cursor play | On mouse devices only, dots near the pointer ease away and spring back (a simple spring: each frame they move 14% of the way to their target) |

## In industry

- **The term:** this is a "particle system" with "keyframe interpolation", the same idea used in game engines and data visualisation tools.
- **Animation libraries:** libraries such as GSAP do the timeline part for you. We built variant A by hand to avoid adding a dependency.

## Interview line

"The hero is a pure function of time: shapes are sampled into point arrays once, and each frame just interpolates, which made pause, reduced motion and testing trivial. The limitation is that I have not yet profiled it on a mid-range Android phone."

## Check yourself

If you wanted the morph to sweep from right to left instead, what would you change: the sorting, the delays, or both?
