import React from 'react';

export type AccreditationId = 'icap' | 'secp' | 'fbr' | 'hmrc' | 'irs';

/** A single laurel leaf, drawn around the origin pointing along +x. */
const LEAF = 'M0,0C2.4,-2.3 6.8,-2.7 9.4,0 6.8,2.7 2.4,2.3 0,0Z';

/** Half-ring of laurel leaves — two mirrored halves make a full wreath. */
const Wreath: React.FC<{
  cx: number;
  cy: number;
  r: number;
  scale: number;
  from: number;
  to: number;
  count: number;
}> = ({ cx, cy, r, scale, from, to, count }) => (
  <>
    {Array.from({ length: count }, (_, i) => {
      const angle = from + ((to - from) * i) / (count - 1);
      const tilt = i % 2 === 0 ? -20 : 10;
      return (
        <path
          key={i}
          d={LEAF}
          opacity={0.72 + (i % 3) * 0.14}
          transform={`translate(${cx} ${cy}) rotate(${angle.toFixed(1)}) translate(${r} 0) rotate(${tilt}) scale(${scale})`}
        />
      );
    })}
  </>
);

const Icap: React.FC = () => (
  <svg viewBox="0 0 72 72" className="h-14 w-14" fill="currentColor" aria-hidden="true">
    {/* laurel wreath */}
    <Wreath cx={36} cy={36} r={24} scale={0.78} from={-68} to={68} count={8} />
    <Wreath cx={36} cy={36} r={24} scale={0.78} from={112} to={248} count={8} />

    {/* crescent and star crest */}
    <path d="M34.4,10.8a3.2,3.2 0 1,0 0,6.4 4.4,4.4 0 0,1 0,-6.4z" />
    <path d="M41,9.2l.9,2.1 2.1,.9-2.1,.9-.9,2.1-.9,-2.1-2.1,-.9 2.1,-.9z" />

    {/* quartered shield */}
    <path
      d="M36,20 48,24v12c0,8-6,14-12,17-6-3-12-9-12-17V24z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M36,20v33" />
      <path d="M24.4,35.5h23.2" />
    </g>

    {/* quadrant charges */}
    <circle cx="30.4" cy="28" r="2.5" />
    <path d="M27.9,28h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M41.2,24.9l1.1,2.7 2.7,1.1-2.7,1.1-1.1,2.7-1.1,-2.7-2.7,-1.1 2.7,-1.1z" />
    <rect x="28.6" y="39" width="4.6" height="6" rx="0.6" />
    <path d="M38.4,45.6 44.4,39.6M44.4,45.6 38.4,39.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

    {/* ribbon banner */}
    <path d="M27,53.6h18v5.6H27z" />
    <path d="M27,53.6 22.2,56.4 27,59.2zM45,53.6 49.8,56.4 45,59.2z" />
  </svg>
);


const Secp: React.FC = () => (
  <svg viewBox="0 0 72 72" className="h-14 w-14" fill="currentColor" aria-hidden="true">
    {/* laurel wreath */}
    <Wreath cx={36} cy={25} r={18} scale={0.66} from={-66} to={66} count={7} />
    <Wreath cx={36} cy={25} r={18} scale={0.66} from={114} to={246} count={7} />

    {/* inner seal */}
    <circle cx="36" cy="25" r="13.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="36" cy="25" r="11" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />

    {/* quadrant cross */}
    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M26.5,15.5 45.5,34.5" />
      <path d="M45.5,15.5 26.5,34.5" />
    </g>

    {/* quadrant studs */}
    <circle cx="29.7" cy="18.7" r="1.5" />
    <circle cx="42.3" cy="18.7" r="1.5" />
    <circle cx="29.7" cy="31.3" r="1.5" />
    <circle cx="42.3" cy="31.3" r="1.5" />

    {/* wordmark */}
    <text
      x="36"
      y="62"
      textAnchor="middle"
      fontSize="15"
      fontWeight="800"
      letterSpacing="0.8"
      className="font-heading"
    >
      SECP
    </text>
  </svg>
);

const Fbr: React.FC = () => (
  <svg viewBox="0 0 132 78" className="h-16 w-[132px]" aria-hidden="true">
    <defs>
      <linearGradient id="rgcFbrGreen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1a9641" />
        <stop offset="50%" stopColor="#2fb457" />
        <stop offset="100%" stopColor="#1a9641" />
      </linearGradient>
      <linearGradient id="rgcFbrBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1a4fa0" />
      </linearGradient>
    </defs>

    {/* green swoosh */}
    <path
      d="M2,34C28,12 52,7 66,7s38,5 64,27c-26-15-50-20-64-20S28,19 2,34z"
      fill="url(#rgcFbrGreen)"
    />

    {/* gold eight-point star */}
    <path
      d="M66,2l1.49,6.4 5.58-3.47-3.5,5.58 6.4,1.49-6.4,1.49 3.5,5.58-5.58-3.47L66,22l-1.49-6.4-5.58,3.47 3.5-5.58L56,12l6.4-1.49-3.5-5.58 5.58,3.47z"
      fill="#f5c451"
    />

    {/* FBR wordmark */}
    <text
      x="66"
      y="52"
      textAnchor="middle"
      fontSize="33"
      fontWeight="900"
      letterSpacing="1.5"
      fill="url(#rgcFbrBlue)"
      className="font-heading"
    >
      FBR
    </text>

    {/* REGISTERED */}
    <text
      x="66"
      y="68"
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      letterSpacing="2.2"
      fill="currentColor"
      opacity="0.9"
      className="font-heading"
    >
      REGISTERED
    </text>
  </svg>
);


const Hmrc: React.FC = () => (
  <svg viewBox="0 0 72 72" className="h-14 w-14" fill="currentColor" aria-hidden="true">
    <defs>
      <path id="rgcHmrcRing" d="M36,26 m-21.5,0 a21.5,21.5 0 1,1 43,0 a21.5,21.5 0 1,1 -43,0" />
    </defs>

    {/* outer + inner ring */}
    <circle cx="36" cy="26" r="25.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="36" cy="26" r="16.5" fill="none" stroke="currentColor" strokeWidth="1" />

    {/* curved legend around the ring */}
    <text
      fill="currentColor"
      fontSize="4.2"
      fontWeight="700"
      letterSpacing="0.28"
      className="font-heading"
    >
      <textPath href="#rgcHmrcRing" startOffset="25%" textAnchor="middle">
        HIS MAJESTY&apos;S REVENUE &amp; CUSTOMS
      </textPath>
    </text>

    {/* crown */}
    <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M36,10.5v3.2M33.7,11.9h4.6" fill="none" />
      <path d="M27.6,27.5C27.6,18.4 44.4,18.4 44.4,27.5" fill="none" />
      <path d="M26.6,27.5 29.2,19.4 32.2,24.2 36,17.4 39.8,24.2 42.8,19.4 45.4,27.5Z" fill="none" />
      <path d="M25.6,27.5h20.8v5.2H25.6z" fill="none" />
    </g>
    <circle cx="31" cy="30.1" r="0.95" />
    <circle cx="36" cy="30.1" r="0.95" />
    <circle cx="41" cy="30.1" r="0.95" />

    {/* wordmark */}
    <text
      x="36"
      y="64"
      textAnchor="middle"
      fontSize="14"
      fontWeight="800"
      letterSpacing="1.1"
      className="font-heading"
    >
      HMRC
    </text>
  </svg>
);

const Irs: React.FC = () => (
  <svg viewBox="0 0 72 72" className="h-14 w-14" fill="currentColor" aria-hidden="true">
    {/* spread wings */}
    <path d="M36,29C28,20 20,15 9,13.5c5,4.2 8,7.6 9,11.6-5-3.2-8.2-3.4-11-2.6 6,4 11,6.2 15,7.4-4.2-.2-8,1-10.2,3 8.2,2 16.4,1 24.2-2.6z" />
    <path d="M36,29c8-9 16-14 27-15.5-5,4.2-8,7.6-9,11.6 5-3.2 8.2-3.4 11-2.6-6,4-11,6.2-15,7.4 4.2-.2 8,1 10.2,3-8.2,2-16.4,1-24.2-2.6z" />

    {/* head + beak */}
    <path d="M36,14.4c1.9,0 3.3,1.5 3.3,3.3 0,1.4-.8,2.5-2,3l2.6.9-3.2.5-.7,1.4-.7-1.4-3.2-.5 2.6-.9c-1.2-.5-2-1.6-2-3 0-1.8 1.4-3.3 3.3-3.3z" />
    <path d="M38.6,17.2 43.4,18.4 38.6,19.8z" />

    {/* body */}
    <path d="M36,21.6 41.2,35c0,6-2.4,10.4-5.2,13-2.8-2.6-5.2-7-5.2-13z" />

    {/* chest shield */}
    <path
      d="M36,28.6 40.8,30.4v5.2c0 3.4-2.2 5.9-4.8,7-2.6-1.1-4.8-3.6-4.8-7v-5.2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />

    {/* tail */}
    <path d="M31.6,45.4 36,52.4 40.4,45.4 36,48z" />

    {/* serif wordmark */}
    <text
      x="36"
      y="69"
      textAnchor="middle"
      fontSize="17"
      fontWeight="700"
      letterSpacing="1.4"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      IRS
    </text>
  </svg>
);

/* ------------------------------------------------------------------ */

export const AccreditationMark: React.FC<{ id: AccreditationId }> = ({ id }) => {
  switch (id) {
    case 'icap':
      return <Icap />;
    case 'secp':
      return <Secp />;
    case 'fbr':
      return <Fbr />;
    case 'hmrc':
      return <Hmrc />;
    case 'irs':
      return <Irs />;
  }
};
