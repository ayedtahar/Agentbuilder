import { OBJECTS_BY_ID } from '../catalog';

const VIEW = { w: 300, h: 320 };

const SHOULDER_Y = 150;
const ARM_LENGTH = 56;
const FACE = { cx: 150, cy: 104, width: 86 };

// Les bras poussent par paires étagées : un outil de plus, un bras de plus,
// alterné à gauche puis à droite et accroché un cran plus bas sur le flanc.
function armGeometry(index) {
  const side = index % 2 === 0 ? -1 : 1;
  const tier = Math.floor(index / 2);
  const angle = ((14 + tier * 26) * Math.PI) / 180;
  const shoulderX = 150 + side * 54;
  const shoulderY = SHOULDER_Y + tier * 18;
  return {
    shoulderX,
    shoulderY,
    handX: shoulderX + side * ARM_LENGTH * Math.cos(angle),
    handY: shoulderY + ARM_LENGTH * Math.sin(angle),
  };
}

// Une skill = une paire d'yeux. Plus il y en a, plus elles se resserrent pour
// tenir sur le visage.
function eyeGeometry(count) {
  const spacing = Math.min(42, FACE.width / count);
  const radius = Math.min(9, spacing / 4.4);
  return Array.from({ length: count }, (_, i) => {
    const cx = FACE.cx + (i - (count - 1) / 2) * spacing;
    return { cx, radius, gap: radius + 3 };
  });
}

function Zone({ slot, className, dragSlot, hoverSlot, filled, children }) {
  const target = dragSlot === slot;
  const classes = [
    'zone',
    className,
    target ? 'is-target' : '',
    target && hoverSlot === slot ? 'is-active' : '',
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
  hoverSlot,
  selectedUid,
  onSelect,
}) {
  const awake = Boolean(brain);
  const arms = tools.map((tool, i) => ({ tool, ...armGeometry(i) }));
  const eyes = eyeGeometry(skills.length).map((geo, i) => ({ ...geo, skill: skills[i] }));

  return (
    <div className={`robot${awake ? ' is-awake' : ''}`}>
      <svg className="robot__art" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}>
        <circle className="robot__bulb" cx="150" cy="12" r="7" />
        <line className="robot__wire" x1="150" y1="19" x2="150" y2="28" />

        {/* Bras d'abord : ils s'enfoncent sous le torse */}
        {arms.map(({ shoulderX, shoulderY, handX, handY }, i) => (
          <line
            key={i}
            className="robot__arm"
            x1={shoulderX}
            y1={shoulderY}
            x2={handX}
            y2={handY}
          />
        ))}

        <rect className="robot__shell" x="100" y="26" width="100" height="108" rx="22" />
        <rect className="robot__mouth" x="135" y="120" width="30" height="5" rx="2.5" />
        <rect className="robot__shell" x="141" y="134" width="18" height="10" />
        <rect className="robot__shell" x="96" y="142" width="108" height="90" rx="16" />

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
            <circle className="eye" cx={cx - gap} cy={FACE.cy} r={radius} />
            <circle className="eye" cx={cx + gap} cy={FACE.cy} r={radius} />
            <circle className="eye__pupil" cx={cx - gap} cy={FACE.cy} r={radius * 0.42} />
            <circle className="eye__pupil" cx={cx + gap} cy={FACE.cy} r={radius * 0.42} />
          </g>
        ))}

        {/* Main au bout de chaque bras : la paume tient, le doigt serre */}
        {arms.map(({ tool, handX, handY }) => (
          <g
            key={tool.uid}
            className={`grip${selectedUid === tool.uid ? ' is-selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tool.uid);
            }}
          >
            <title>{tool.label}</title>
            {/* L'outil est dessiné avant le poing : son manche disparaît
                derrière, sa tête dépasse au-dessus. Une barre posée en
                travers du glyphe le masquait au lieu de le tenir. */}
            <text className="grip__tool" x={handX} y={handY - 4} textAnchor="middle">
              {OBJECTS_BY_ID[tool.objectId].icon}
            </text>
            <rect
              className="grip__palm"
              x={handX - 13}
              y={handY - 5}
              width="26"
              height="24"
              rx="9"
            />
            <line
              className="grip__knuckle"
              x1={handX - 8}
              y1={handY + 4}
              x2={handX + 8}
              y2={handY + 4}
            />
          </g>
        ))}

        <rect className="robot__shell" x="118" y="232" width="18" height="26" rx="6" />
        <rect className="robot__shell" x="164" y="232" width="18" height="26" rx="6" />
        <rect className="robot__shell" x="108" y="256" width="38" height="12" rx="5" />
        <rect className="robot__shell" x="154" y="256" width="38" height="12" rx="5" />
      </svg>

      <Zone
        slot="brain"
        className="zone--head"
        dragSlot={dragSlot}
        hoverSlot={hoverSlot}
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
        hoverSlot={hoverSlot}
        filled={skills.length > 0}
      >
        {skills.length === 0 && <span className="zone__empty zone__empty--faint">yeux</span>}
      </Zone>

      {/* Les épaules reçoivent les outils : c'est là que pousse le bras. */}
      <Zone
        slot="tool"
        className="zone--shoulders"
        dragSlot={dragSlot}
        hoverSlot={hoverSlot}
        filled={false}
      >
        {dragSlot === 'tool' && <span className="zone__empty zone__empty--faint">+ un bras</span>}
      </Zone>

      <Zone
        slot="rag"
        className="zone--chest"
        dragSlot={dragSlot}
        hoverSlot={hoverSlot}
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
