// Each strand keeps the same control points as it changes from one chapter's motif to the next.
function strand(form: number, i: number) {
  const t = (i - 5) / 5;
  const shapes = [
    [
      112,
      45 + t * 8,
      195,
      4 + t * 10,
      260,
      28 + t * 3,
      330,
      44 + t * 7,
      420,
      4 + t * 9,
    ],
    [98, 25 + t * 18, 188, 30 + t * 15, 260, 26, 332, 26, 424, 30 + t * 18],
    [
      110,
      38 + t * 14,
      170,
      40 + t * 14,
      235,
      40 + t * 14,
      257,
      12 + t * 14,
      423,
      12 + t * 14,
    ],
    [
      110,
      46 + t * 11,
      171,
      46 + t * 11,
      253,
      7 + t * 11,
      303,
      32 + t * 11,
      420,
      32 + t * 11,
    ],
    [115, 30, 175, 30, 230, 30, 295, 30, 420, 30 + t * 2],
  ];
  const [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5] = shapes[form];
  return `M0 30 Q${x1} ${y1} ${x2} ${y2} T${x3} ${y3} L${x4} ${y4} Q${x5} ${y5} 540 30`;
}
export default function ChapterSeam({ from }: { from: number }) {
  return (
    <svg
      viewBox="0 0 540 60"
      preserveAspectRatio="none"
      className={'chapter-seam seam-' + from}
      aria-hidden="true"
    >
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={strand(from, i)} data-next={strand(from + 1, i)} />
      ))}
    </svg>
  );
}
