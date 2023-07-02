export default function CircleSvg({ seed, bg = "#001220", fg = "#A7233A", className }: { seed: string, bg?: string, fg?: string, className: string }) {
  let hash = stringHash(seed);
  hash = hash * hash % 839;
  const circle1Radius = hash % 22 + 50;
  const circle1X = hash % 21 + 20;
  const circle1Y = hash % 37 + 50;
  hash = hash * hash % 839;
  const circle2Radius = hash % 91 + 55;
  const circle2X = hash % 91 + 11;
  const circle2Y = hash % 31 + 12;
  hash = hash * hash % 839;
  const circle3Radius = hash % 14 + 75;
  const circle3X = hash % 11 + 60;
  const circle3Y = hash % 29 + 25;

  return (
    <svg id="visual" viewBox="0 0 900 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" className={className}>
      <rect x="0" y="0" width="600" height="600" fill={bg}></rect>
      <g fill={fg}>
        <circle r={circle1Radius} cx={circle1X} cy={circle1Y}></circle>
        <circle r={circle2Radius} cx={circle2X} cy={circle2Y}></circle>
        <circle r={circle3Radius} cx={circle3X} cy={circle3Y}></circle>
      </g>
    </svg>
  )
}

const stringHash = (str: string) => {
  const act = str.toLowerCase();
  let i: number;
  let chr: number;
  let hash: number = 0;
  for (i = 0; i < act.length; i++) {
    chr = act.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  if (hash < 0) {
    hash = hash * -1;
  }
  return hash;
}
