const VIEW = { w: 320, h: 340 };

const SHOULDER = { x: 160, y: 182, spread: 56 };
const ARM_LENGTH = 70;
const FACE = { cx: 160, cy: 120, width: 88 };

// Les bras poussent par paires étagées : un outil de plus, un bras de plus,
// alterné à gauche puis à droite et accroché un cran plus bas sur le flanc.
function armGeometry(index) {
  const side = index % 2 === 0 ? -1 : 1;
  const tier = Math.floor(index / 2);
  const angle = ((16 + tier * 26) * Math.PI) / 180;
  const shoulderX = SHOULDER.x + side * SHOULDER.spread;
  const shoulderY = SHOULDER.y + tier * 20;
  const reach = (distance) => ({
    x: shoulderX + side * distance * Math.cos(angle),
    y: shoulderY + distance * Math.sin(angle),
  });
  const elbow = reach(ARM_LENGTH * 0.5);
  const hand = reach(ARM_LENGTH);

  // L'outil se tient perpendiculaire au bras, tête en l'air : des deux
  // perpendiculaires on garde celle qui pointe vers le haut.
  const armAngle = (Math.atan2(hand.y - elbow.y, hand.x - elbow.x) * 180) / Math.PI;
  const up = Math.sin(((armAngle + 90) * Math.PI) / 180) < 0 ? armAngle + 90 : armAngle - 90;

  return { shoulderX, shoulderY, elbow, hand, toolAngle: up + 90 };
}

// Une skill = une paire d'yeux. Plus il y en a, plus elles se resserrent pour
// tenir sur le visage.
function eyeGeometry(count) {
  const spacing = FACE.width / count;
  // Une paire occupe 4 rayons plus l'écart : sans cette contrainte, l'œil
  // intérieur d'une paire chevauchait celui de la paire voisine.
  const radius = Math.min(13, (spacing - 8) / 4);
  return Array.from({ length: count }, (_, i) => ({
    cx: FACE.cx + (i - (count - 1) / 2) * spacing,
    radius,
    gap: radius + 3,
  }));
}

function Zone({ slot, className, dragSlot, filled, children }) {
  const target = dragSlot === slot;
  const classes = [
    'zone',
    className,
    target ? 'is-target' : '',
    filled ? 'is-filled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} data-slot={slot}>
      {children}
    </div>
  );
}

export default function Robot({
  brain,
  skills,
  tools,
  rags,
  dragSlot,
  selectedUid,
  onSelect,
  thinking,
}) {
  const awake = Boolean(brain);
  const arms = tools.map((tool, i) => ({ tool, ...armGeometry(i) }));
  const eyes = eyeGeometry(skills.length).map((geo, i) => ({ ...geo, skill: skills[i] }));

  return (
    <div className={`robot${awake ? ' is-awake' : ''}${thinking ? ' is-thinking' : ''}`}>
      <svg className="robot__art" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}>
        <defs>
          <linearGradient id="shell" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#f2ece2" />
            <stop offset="55%" stopColor="#cdc3b4" />
            <stop offset="100%" stopColor="#9b8f7d" />
          </linearGradient>
          <linearGradient id="limb" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#ded5c7" />
            <stop offset="100%" stopColor="#9a8e7c" />
          </linearGradient>
          <linearGradient id="visor" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#cfe6f2" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7fa7bd" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="faceplate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b3229" />
            <stop offset="100%" stopColor="#241c15" />
          </linearGradient>
        </defs>

        {/* Bras d'abord : ils s'enfoncent sous le torse */}
        {arms.map(({ shoulderX, shoulderY, elbow, hand }, i) => (
          <g key={i} className="arm">
            <line className="arm__bone" x1={shoulderX} y1={shoulderY} x2={elbow.x} y2={elbow.y} />
            <line className="arm__bone" x1={elbow.x} y1={elbow.y} x2={hand.x} y2={hand.y} />
            <circle className="arm__joint" cx={elbow.x} cy={elbow.y} r="9" />
            <circle className="arm__joint" cx={shoulderX} cy={shoulderY} r="15" />
          </g>
        ))}

        {/* Antenne */}
        <line className="robot__wire" x1="160" y1="42" x2="160" y2="22" />
        <circle className="robot__bulb" cx="160" cy="15" r="8" />

        {/* Oreillettes */}
        <rect className="robot__ear" x="88" y="90" width="18" height="40" rx="9" />
        <rect className="robot__ear" x="214" y="90" width="18" height="40" rx="9" />

        {/* Tête */}
        <rect className="robot__shell" x="100" y="40" width="120" height="108" rx="30" />
        <rect className="robot__visor" x="114" y="50" width="92" height="46" rx="22" />
        <path className="robot__gloss" d="M124 88 Q126 58 152 55" />
        <rect className="robot__faceplate" x="112" y="100" width="96" height="42" rx="18" />

        {/* Yeux de robot dessinés, une paire par skill */}
        {eyes.map(({ skill, cx, gap, radius }) => (
          <g
            key={skill.uid}
            className={`eyes${selectedUid === skill.uid ? ' is-selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(skill.uid);
            }}
          >
            <title>{skill.label}</title>
            {/* Cible de clic couvrant la paire : viser un cercle de quelques
                pixels, et rien entre les deux, se rate tout le temps. */}
            <rect
              className="eyes__hit"
              x={cx - gap - radius - 3}
              y={FACE.cy - radius - 3}
              width={(gap + radius + 3) * 2}
              height={(radius + 3) * 2}
              rx={radius}
            />
            {[cx - gap, cx + gap].map((ex) => (
              <g key={ex}>
                <circle className="eye" cx={ex} cy={FACE.cy} r={radius} />
                <circle className="eye__iris" cx={ex} cy={FACE.cy} r={radius * 0.55} />
                <circle
                  className="eye__spark"
                  cx={ex - radius * 0.3}
                  cy={FACE.cy - radius * 0.35}
                  r={radius * 0.22}
                />
              </g>
            ))}
          </g>
        ))}

        {/* Cou, épaules, torse */}
        <rect className="robot__shell" x="148" y="146" width="24" height="16" rx="8" />
        <rect className="robot__shell" x="112" y="158" width="96" height="100" rx="30" />

        {/* Jambes et bottes */}
        <line className="robot__leg" x1="137" y1="256" x2="137" y2="284" />
        <line className="robot__leg" x1="183" y1="256" x2="183" y2="284" />
        <rect className="robot__boot" x="110" y="282" width="52" height="24" rx="12" />
        <rect className="robot__boot" x="158" y="282" width="52" height="24" rx="12" />

        {/* Mains : l'outil est tracé avant le poing, son manche disparaît
            derrière et sa tête dépasse au-dessus. */}
        {arms.map(({ tool, hand, toolAngle }) => (
          <g
            key={tool.uid}
            className={`grip${selectedUid === tool.uid ? ' is-selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tool.uid);
            }}
          >
            <title>{tool.label}</title>
            {/* Marteau dessiné plutôt qu'émoticône : l'emoji porte sa propre
                inclinaison, impossible de l'aligner sur le bras. Tracé avant
                le poing, son manche disparaît dedans. */}
            <g transform={`translate(${hand.x} ${hand.y}) rotate(${toolAngle})`}>
              <rect className="tool__handle" x="-3.5" y="-30" width="7" height="36" rx="3.5" />
              <rect className="tool__head" x="-14" y="-39" width="28" height="14" rx="3" />
            </g>
            <rect
              className="grip__fist"
              x={hand.x - 15}
              y={hand.y - 13}
              width="30"
              height="27"
              rx="11"
            />
            <line
              className="grip__knuckle"
              x1={hand.x - 9}
              y1={hand.y + 3}
              x2={hand.x + 9}
              y2={hand.y + 3}
            />
          </g>
        ))}
      </svg>

      <Zone
        slot="brain"
        className="zone--head"
        dragSlot={dragSlot}
        filled={awake}
      >
        {brain ? (
          <button
            type="button"
            className={`brain${selectedUid === brain.uid ? ' is-selected' : ''}`}
            title={brain.label}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(brain.uid);
            }}
          >
            <span className="brain__icon">🧠</span>
            <span className="brain__model">{brain.model}</span>
          </button>
        ) : (
          <span className="zone__empty">?</span>
        )}
      </Zone>

      <Zone
        slot="skill"
        className="zone--face"
        dragSlot={dragSlot}
        filled={skills.length > 0}
      >
        {skills.length === 0 && <span className="zone__empty zone__empty--faint">yeux</span>}
      </Zone>

      {/* Une épaule de chaque côté reçoit les outils : c'est là que pousse le
          bras, et ça laisse la poitrine libre pour le RAG. */}
      {['left', 'right'].map((side) => (
        <Zone
          key={side}
          slot="tool"
          className={`zone--shoulder zone--shoulder-${side}`}
          dragSlot={dragSlot}
          filled={false}
        >
          {dragSlot === 'tool' && <span className="zone__empty zone__empty--faint">+</span>}
        </Zone>
      ))}

      <Zone
        slot="rag"
        className="zone--chest"
        dragSlot={dragSlot}
        filled={rags.length > 0}
      >
        {rags.length === 0 && <span className="zone__empty zone__empty--faint">RAG</span>}
        {rags.map((rag) => (
          <button
            key={rag.uid}
            type="button"
            className={`equipped${selectedUid === rag.uid ? ' is-selected' : ''}`}
            title={rag.label}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(rag.uid);
            }}
          >
            📚
          </button>
        ))}
      </Zone>
    </div>
  );
}
