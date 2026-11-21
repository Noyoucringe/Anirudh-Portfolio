# Curiosity Engine sculptures

Edit `sculptures.ts` to change the models. The Knowledge Atlas has curved, layered leaves, printed canvas textures, and a lifted 3–4–2 network sketch. SentinelAI uses a signal shield with three sensor channels. The attention study uses six glass matrix planes with routed signals. The architecture study connects an entry gateway, two workers, and a shared store.

The editable procedural factories produce the geometry used by both renderers. Static geometry is indexed and batched by material within each selectable assembly. GLB snapshots are in `assets/models`. The live renderers use the factories so that scroll, selection, and signal movement can update individual assemblies. The WebP images in `public/art` are transparent renders of the same models.

`SignalInstrument.ts` uses the existing GSAP clock and scroll positions. It pauses rendering offscreen and disables idle movement in reduced-motion mode. `Exhibition.tsx` mounts the workflow and skills sculptures into their existing React Three Fiber slots.

The workflow diagram uses a verification plotter whose head follows the selected station. The skills diagram uses a six-blade engineering multitool. Their mesh factories and the signal shield are in `instruments.ts`.
