import { OBJECTS_BY_ID } from '../catalog';

const VIEW = { w: 300, h: 320 };

const SHOULDER_Y = 152;
const ARM_LENGTH = 56;

// Les bras poussent par paires en éventail : un outil de plus, un bras de
// plus, alterné à gauche puis à droite et abaissé d'un cran à chaque tour.
function armGeometry(index) {
  const side = index % 2 === 0 ? -1 : 1;
  const tier = Math.floor(index / 2);
  const angle = ((14 + tier * 26) * Math.PI) / 180;
  const shoulderX = 150 + side * 54;
  // Chaque étage s'accroche plus bas sur le flanc : partis d'un même point,
  // les bras formaient un bouquet au lieu d'une paire de plus.
  const shoulderY = SHOULDER_Y + tier * 18;
  return {
    shoulderX,
    shoulderY,
    handX: shoulderX + side * ARM_LENGTH * Math.cos(angle),
    handY: shoulderY + ARM_LENGTH * Math.sin(angle),
  };
}

const pct = (value, total) => `${(value / total) * 100}%`;

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

function Equipped({ item, selected, onSelect, className = '' }) {
  return (
    <button
      type="button"
      className={`equipped ${className}${selected ? ' is-selected' : ''}`}
      title={item.label}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.uid);
      }}
    >
      {OBJECTS_BY_ID[item.objectId].icon}
    </button>
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

  return (
    <div className={`robot${awake ? ' is-awake' : ''}`}>
      <svg className="robot__art" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} aria-hidden="true">
        <circle className="robot__bulb" cx="150" cy="14" r="7" />
        <line className="robot__wire" x1="150" y1="21" x2="150" y2="32" />

        {/* Bras : un par outil, dessiné avant le torse pour s'y enfoncer */}
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

        <rect className="robot__shell" x="100" y="30" width="100" height="96" rx="22" />
        <rect className="robot__mouth" x="135" y="116" width="30" height="5" rx="2.5" />
        <rect className="robot__shell" x="141" y="126" width="18" height="10" />
        <rect className="robot__shell" x="96" y="136" width="108" height="88" rx="16" />
        <rect className="robot__screen" x="106" y="150" width="88" height="30" rx="8" />
        <text className="robot__screen-text" x="150" y="170" textAnchor="middle">
          {awake ? brain.model : 'hors ligne'}
        </text>

        <rect className="robot__shell" x="118" y="224" width="18" height="28" rx="6" />
        <rect className="robot__shell" x="164" y="224" width="18" height="28" rx="6" />
        <rect className="robot__shell" x="108" y="250" width="38" height="12" rx="5" />
        <rect className="robot__shell" x="154" y="250" width="38" height="12" rx="5" />
      </svg>

      <Zone
        slot="brain"
        className="zone--head"
        dragSlot={dragSlot}
        hoverSlot={hoverSlot}
        filled={awake}
      >
        {brain ? (
          <Equipped item={brain} selected={selectedUid === brain.uid} onSelect={onSelect} />
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
        {skills.map((skill) => (
          <Equipped
            key={skill.uid}
            item={skill}
            selected={selectedUid === skill.uid}
            onSelect={onSelect}
          />
        ))}
      </Zone>

      {/* Le torse reçoit les outils : c'est là que pousse le bras. */}
      <Zone
        slot="tool"
        className="zone--torso"
        dragSlot={dragSlot}
        hoverSlot={hoverSlot}
        filled={false}
      >
        {dragSlot === 'tool' && <span className="zone__empty zone__empty--faint">+ un bras</span>}
      </Zone>

      {arms.map(({ tool, handX, handY }) => (
        <div
          key={tool.uid}
          className="hand"
          style={{ left: pct(handX, VIEW.w), top: pct(handY, VIEW.h) }}
        >
          <Equipped
            item={tool}
            selected={selectedUid === tool.uid}
            onSelect={onSelect}
            className="equipped--hand"
          />
        </div>
      ))}

      <Zone
        slot="rag"
        className="zone--books"
        dragSlot={dragSlot}
        hoverSlot={hoverSlot}
        filled={rags.length > 0}
      >
        {rags.length === 0 && <span className="zone__empty zone__empty--faint">RAG</span>}
        {rags.map((rag) => (
          <Equipped
            key={rag.uid}
            item={rag}
            selected={selectedUid === rag.uid}
            onSelect={onSelect}
          />
        ))}
      </Zone>
    </div>
  );
}
