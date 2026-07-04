'use client';

import styles from './hero.module.css';

/**
 * Realistic-styled metal pouring ladle (a tapered steel can with a spout lip
 * and a long straight handle), tipped to pour a ribbon of pigment into the
 * mold. No hand. Metallic gradients, a specular highlight, a welded seam and
 * a soft cast shadow give it volume.
 * Animated by the Hero scroll timeline (the whole .handLayer tips a little
 * deeper as it pours; [data-stream] grows as the pigment falls).
 */
export default function HandPour() {
  return (
    <div className={styles.handLayer} aria-hidden>
      <svg
        viewBox="0 0 400 400"
        className={styles.handSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* brushed-steel body shading (light catches the middle) */}
          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0%" stopColor="#4F545B" />
            <stop offset="20%" stopColor="#8D939B" />
            <stop offset="44%" stopColor="#C6CBD1" />
            <stop offset="62%" stopColor="#979DA5" />
            <stop offset="82%" stopColor="#666B73" />
            <stop offset="100%" stopColor="#43474E" />
          </linearGradient>
          <linearGradient id="metalRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C2C7CD" />
            <stop offset="100%" stopColor="#6B7079" />
          </linearGradient>
          <linearGradient id="metalHandle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B5BAC1" />
            <stop offset="50%" stopColor="#7F858D" />
            <stop offset="100%" stopColor="#4E535A" />
          </linearGradient>
          <radialGradient id="bore" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#23262B" />
            <stop offset="100%" stopColor="#41454B" />
          </radialGradient>
          <linearGradient id="stream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E1241C" />
            <stop offset="50%" stopColor="#CE1B16" />
            <stop offset="100%" stopColor="#A8120E" />
          </linearGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* soft cast shadow */}
        <ellipse
          cx="238"
          cy="300"
          rx="96"
          ry="24"
          fill="#3a3e45"
          opacity="0.18"
          filter="url(#soft)"
        />

        {/* falling ribbon of pigment (behind the ladle) */}
        <g data-stream className={styles.stream}>
          <path
            d="M120 192
               C 124 232, 142 280, 154 332
               C 156 337, 162 337, 164 331
               C 154 280, 138 232, 132 194
               C 129 188, 122 187, 120 192 Z"
            fill="url(#stream)"
          />
          <path
            d="M128 198 C 131 236, 148 282, 159 326"
            fill="none"
            stroke="#F0524B"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <ellipse cx="158" cy="336" rx="13" ry="5" fill="#A8120E" opacity="0.65" />
          <circle cx="169" cy="342" r="3.2" fill="#CE1B16" />
          <circle cx="148" cy="344" r="2.6" fill="#CE1B16" />
        </g>

        {/* long straight handle (behind the body) */}
        <g>
          <path
            d="M256 132 L 392 72"
            fill="none"
            stroke="url(#metalHandle)"
            strokeWidth="17"
            strokeLinecap="butt"
          />
          <path
            d="M256 126 L 392 66"
            fill="none"
            stroke="#CDD2D8"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* mounting plate / rivets where the handle meets the body */}
          <path d="M250 118 L 286 104 L 296 132 L 260 146 Z" fill="url(#metalRim)" />
          <circle cx="266" cy="124" r="3" fill="#3f444b" />
          <circle cx="280" cy="130" r="3" fill="#3f444b" />
        </g>

        {/* ladle body (tapered cylinder, tipped to pour) */}
        <path
          d="M138.8 174.7
             L 191.2 282.7
             Q 245 305 298.8 239.3
             L 261.2 125.3
             Q 200 150 138.8 174.7 Z"
          fill="url(#metal)"
        />
        {/* welded seam near the base */}
        <path
          d="M173 256 Q 240 282 290 232"
          fill="none"
          stroke="#3f444b"
          strokeWidth="2.5"
          opacity="0.5"
        />
        {/* vertical seam */}
        <path
          d="M210 152 L 224 268"
          fill="none"
          stroke="#3f444b"
          strokeWidth="2"
          opacity="0.35"
        />
        {/* specular highlight band */}
        <ellipse
          cx="182"
          cy="205"
          rx="13"
          ry="64"
          transform="rotate(-22 182 205)"
          fill="#EBEEF1"
          opacity="0.4"
          filter="url(#soft)"
        />

        {/* mouth opening: metal rim + dark bore */}
        <ellipse
          cx="200"
          cy="150"
          rx="66"
          ry="26"
          transform="rotate(-22 200 150)"
          fill="url(#metalRim)"
        />
        <ellipse
          cx="202"
          cy="149"
          rx="55"
          ry="19"
          transform="rotate(-22 202 149)"
          fill="url(#bore)"
        />

        {/* spout lip pulling down to the pour point */}
        <path
          d="M150 170 C 132 176, 120 186, 122 198 C 134 190, 146 184, 158 180 Z"
          fill="url(#metalRim)"
        />
        <path
          d="M150 172 C 136 178, 126 186, 126 195"
          fill="none"
          stroke="#3f444b"
          strokeWidth="1.6"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
