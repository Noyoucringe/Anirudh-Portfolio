const paths = [
  'M2 20h12l8-12h12l8 12h12 M3 13h7m26 12h15',
  'M5 5h43v17H23l-10 7v-7H5z M16 12h4m5 0h4m5 0h4',
  'M4 25h48 M10 20v-5m10 5V9m10 11V5m10 15V11',
  'M4 20h13l8-10h14l9 10h5 M8 23h5m29 0h5',
  'M4 7h48v18H4z M4 12h48m-43-5 5 5m7-5 5 5m7-5 5 5',
];
export default function ProjectGlyph({ index }: { index: number }) {
  return (
    <svg className="archive-symbol" viewBox="0 0 56 32" aria-hidden="true">
      <path
        d={paths[index]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
