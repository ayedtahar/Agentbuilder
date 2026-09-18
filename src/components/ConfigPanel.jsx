export default function ConfigPanel({ item, fields, icon, onChange, onRemove }) {
  if (!item) {
    return (
      <aside className="config config--empty">
        <p>Clique un objet posé sur le robot pour le régler.</p>
      </aside>
    );
  }

  return (
    <aside className="config">
      <div className="config__header">
        <span className="config__icon">{icon}</span>
        <span>{item.label}</span>
      </div>

      {fields.map((field) => (
        <label key={field.key} className="field">
          <span className="field__label">{field.label}</span>
          {field.type === 'textarea' && (
            <textarea
              rows={3}
              value={item[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          )}
          {field.type === 'text' && (
            <input
              type="text"
              value={item[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          )}
          {field.type === 'select' && (
            <select
              value={item[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
          {field.type === 'range' && (
            <div className="field__range">
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={item[field.key] ?? field.min}
                onChange={(e) => onChange(field.key, Number(e.target.value))}
              />
              <span>{item[field.key]}</span>
            </div>
          )}
        </label>
      ))}

      <button type="button" className="config__remove" onClick={onRemove}>
        🗑️ Retirer du robot
      </button>
    </aside>
  );
}
