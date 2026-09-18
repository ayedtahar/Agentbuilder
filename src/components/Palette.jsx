import { BLOCK_TYPES, PALETTE_ORDER } from '../blockLibrary';

export default function Palette() {
  const onDragStart = (event, blockType) => {
    event.dataTransfer.setData('application/agent-forge-block', blockType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="palette">
      <div className="palette__title">Blocs</div>
      <p className="palette__hint">Glisse un bloc sur l’établi pour l’ajouter.</p>
      {PALETTE_ORDER.map((type) => {
        const meta = BLOCK_TYPES[type];
        return (
          <div
            key={type}
            className="palette__item"
            style={{ '--block-color': meta.color }}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
          >
            <span className="palette__icon">{meta.icon}</span>
            <div>
              <div className="palette__label">{meta.label}</div>
              <div className="palette__tagline">{meta.tagline}</div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
