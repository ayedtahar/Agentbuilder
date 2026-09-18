import { BLOCK_TYPES } from '../blockLibrary';

export default function ConfigPanel({ node, onChange, onDelete }) {
  if (!node) {
    return (
      <aside className="config-panel config-panel--empty">
        <p>Clique un bloc sur l’établi pour le configurer.</p>
      </aside>
    );
  }

  const meta = BLOCK_TYPES[node.type];

  return (
    <aside className="config-panel">
      <div className="config-panel__header" style={{ '--block-color': meta.color }}>
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
      </div>

      {meta.fields.map((field) => (
        <label key={field.key} className="config-field">
          <span className="config-field__label">{field.label}</span>
          {field.type === 'textarea' && (
            <textarea
              rows={3}
              value={node.data[field.key] ?? ''}
              onChange={(e) => onChange(node.id, field.key, e.target.value)}
            />
          )}
          {field.type === 'text' && (
            <input
              type="text"
              value={node.data[field.key] ?? ''}
              onChange={(e) => onChange(node.id, field.key, e.target.value)}
            />
          )}
          {field.type === 'select' && (
            <select
              value={node.data[field.key] ?? ''}
              onChange={(e) => onChange(node.id, field.key, e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
          {field.type === 'range' && (
            <div className="config-field__range">
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={node.data[field.key] ?? field.min}
                onChange={(e) => onChange(node.id, field.key, Number(e.target.value))}
              />
              <span>{node.data[field.key]}</span>
            </div>
          )}
        </label>
      ))}

      {node.type !== 'agent' && (
        <button type="button" className="config-panel__delete" onClick={() => onDelete(node.id)}>
          🗑️ Retirer ce bloc
        </button>
      )}
    </aside>
  );
}
