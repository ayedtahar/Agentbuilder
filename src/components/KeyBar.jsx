import { useState } from 'react';

// La clé est optionnelle : tant qu'elle n'est pas là, le robot répond en
// démonstration. Cette barre reste donc discrète, au pied de la conversation.
export default function KeyBar({ hasKey, onSave, onForget }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  if (hasKey) {
    return (
      <div className="keybar">
        <span className="keybar__state">🔑 Clé active</span>
        <button type="button" className="keybar__link" onClick={onForget}>
          Oublier ma clé
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="keybar">
        <span className="keybar__state keybar__state--demo">Mode démo</span>
        <button type="button" className="keybar__link" onClick={() => setOpen(true)}>
          Brancher ma clé API
        </button>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const key = value.trim();
    if (key) onSave(key);
  };

  return (
    <form className="keybar keybar--form" onSubmit={submit}>
      <input
        className="keybar__input"
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="sk-ant-..."
        aria-label="Clé API Anthropic"
        autoComplete="off"
        spellCheck="false"
      />
      <button type="submit" className="keybar__submit" disabled={!value.trim()}>
        OK
      </button>
      <button type="button" className="keybar__link" onClick={() => setOpen(false)}>
        Annuler
      </button>
    </form>
  );
}
