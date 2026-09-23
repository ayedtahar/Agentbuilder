export default function ConfigPanel({ item, fields, icon, kind, onChange, onRemove }) {
  if (!item) {
    return (
      <aside className="config config--empty">
        <p>Clique une partie du robot pour régler ce qu’elle apporte à l’agent.</p>
      </aside>
    );
  }

  return (
    <aside className="config">
      <div className="config__header">
        <span className="config__icon">{icon}</span>
        <span className="config__title">
          {item.label}
          <span className="config__kind">{kind}</span>
        </span>
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

      <p className="config__note">
        Retirer cette partie enlève aussi ce qu’elle apporte à l’agent.
      </p>
    </aside>
  );
}
