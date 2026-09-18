import { BLOCK_TYPES, PALETTE_ORDER } from '../blockLibrary';

export default function Palette({ onTap }) {
  const onDragStart = (event, blockType) => {
    event.dataTransfer.setData('application/agent-forge-block', blockType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="palette">
      <div className="palette__title">Blocs</div>
      <p className="palette__hint">Touche un bloc — ou glisse-le à l’endroit voulu.</p>
      {PALETTE_ORDER.map((type) => {
        const meta = BLOCK_TYPES[type];
        return (
          <button
            key={type}
            type="button"
            className="palette__item"
            style={{ '--block-color': meta.color }}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
            onClick={() => onTap(type)}
          >
            <span className="palette__icon">{meta.icon}</span>
            <span className="palette__text">
              <span className="palette__label">{meta.label}</span>
              <span className="palette__tagline">{meta.tagline}</span>
            </span>
          </button>
        );
      })}
    </aside>
  );
}
