# Exhibition renderer

The hero and three featured projects share the instanced mesh in `SignalInstrument.ts`. Its 36 beveled vanes open into an event perimeter, unroll into diagnostic contacts, and form the layers of an adapter stack. Chapter positions determine the pose in both scroll directions. Project controls select the highlighted contacts. Dragging and the rotation buttons change the viewing angle.

The instrument uses the GSAP clock and renders when its pose, selection, orientation, or viewport changes. An intersection observer suspends rendering outside the stage. Reduced motion selects discrete poses. The prerendered illustration supplies the initial and WebGL fallback frame.

The workflow and skills diagrams use the on-demand React Three Fiber canvas in `Exhibition.tsx`. Their geometry and materials are owned by the factories in `models.ts`.
