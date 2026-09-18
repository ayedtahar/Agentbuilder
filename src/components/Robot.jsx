import { OBJECTS_BY_ID } from '../catalog';

// Chaque emplacement est une zone HTML posée sur le dessin : c'est elle qui
// reçoit l'objet lâché et qui affiche ce qui s'y trouve.
function Zone({ slot, className, dragSlot, hoverSlot, filled, children }) {
  // Attraper un objet allume tous ses emplacements possibles ; celui sous le
  // doigt s'allume plus fort.
  const target = dragSlot === slot;
  const classes = [
    'zone',
    className,
    target ? ' is-target' : '',
    target && hoverSlot === slot ? ' is-active' : '',
    filled ? ' is-filled' : '',
  ].join(' ');

  return (
    <div className={classes} data-slot={slot}>
      {children}
    </div>
  );
}

function Equipped({ item, selected, onSelect }) {
  const object = OBJECTS_BY_ID[item.objectId];
  return (
    <button
      type="button"
      className={`equipped${selected ? ' is-selected' : ''}`}
      title={item.label}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.uid);
      }}
    >
      {object.icon}
    </button>
  );
}

export default function Robot({
  brain,
  tools,
  skills,
  dragSlot,
  hoverSlot,
  selectedUid,
  onSelect,
}) {
  const awake = Boolean(brain);
  const hands = [tools[0], tools[1]];
  const belt = tools.slice(2);

  return (
    <div className={`robot${awake ? ' is-awake' : ''}`}>
      <svg className="robot__art" viewBox="0 0 220 300" aria-hidden="true">
        <circle className="robot__bulb" cx="110" cy="10" r="7" />
        <line className="robot__wire" x1="110" y1="17" x2="110" y2="28" />

        <rect className="robot__shell" x="58" y="26" width="104" height="100" rx="22" />
        <circle className="robot__eye" cx="86" cy="102" r="9" />
        <circle className="robot__eye" cx="134" cy="102" r="9" />
        <rect className="robot__mouth" x="95" y="113" width="30" height="5" rx="2.5" />

        <rect className="robot__shell" x="101" y="126" width="18" height="10" />
        <rect className="robot__shell" x="56" y="134" width="108" height="86" rx="16" />
        <rect className="robot__screen" x="66" y="146" width="88" height="30" rx="8" />
        <text className="robot__screen-text" x="110" y="166" textAnchor="middle">
          {awake ? brain.model : 'hors ligne'}
        </text>

        <rect className="robot__shell" x="36" y="142" width="16" height="46" rx="8" />
        <rect className="robot__shell" x="168" y="142" width="16" height="46" rx="8" />

        <rect className="robot__shell" x="78" y="220" width="18" height="28" rx="6" />
        <rect className="robot__shell" x="124" y="220" width="18" height="28" rx="6" />
        <rect className="robot__shell" x="68" y="246" width="38" height="12" rx="5" />
        <rect className="robot__shell" x="114" y="246" width="38" height="12" rx="5" />
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

      {hands.map((tool, i) => (
        <Zone
          key={i}
          slot="tool"
          className={i === 0 ? 'zone--hand-left' : 'zone--hand-right'}
          dragSlot={dragSlot}
          hoverSlot={hoverSlot}
          filled={Boolean(tool)}
        >
          {tool && (
            <Equipped item={tool} selected={selectedUid === tool.uid} onSelect={onSelect} />
          )}
        </Zone>
      ))}

      {/* La ceinture ne sert qu'au-delà de deux mains : inutile de laisser un
          rectangle vide sur le torse le reste du temps. */}
      {(belt.length > 0 || dragSlot === 'tool') && (
        <Zone
          slot="tool"
          className="zone--belt"
          dragSlot={dragSlot}
          hoverSlot={hoverSlot}
          filled={belt.length > 0}
        >
          {belt.map((tool) => (
            <Equipped
              key={tool.uid}
              item={tool}
              selected={selectedUid === tool.uid}
              onSelect={onSelect}
            />
          ))}
        </Zone>
      )}

      <Zone
        slot="memory"
        className="zone--memory"
        dragSlot={dragSlot}
        hoverSlot={hoverSlot}
        filled={skills.length > 0}
      >
        {skills.length === 0 && <span className="zone__empty zone__empty--faint">mémoire</span>}
        {skills.map((skill) => (
          <Equipped
            key={skill.uid}
            item={skill}
            selected={selectedUid === skill.uid}
            onSelect={onSelect}
          />
        ))}
      </Zone>
    </div>
  );
}
