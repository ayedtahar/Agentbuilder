import { useState } from 'react';

export default function KeyGate({ onSave }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const key = value.trim();
    if (key) onSave(key);
  };

  return (
    <form className="keygate" onSubmit={submit}>
      <h2 className="keygate__title">🔑 Ta clé API Anthropic</h2>
      <p className="keygate__text">
        Pour que le robot réponde vraiment, il lui faut ta clé. Elle reste dans ce navigateur
        (localStorage) et n’est jamais envoyée ailleurs qu’à l’API d’Anthropic.
      </p>
      <p className="keygate__warn">
        ⚠️ L’app est un site statique : l’appel part depuis ton navigateur, donc la clé est
        lisible dans cette page. Utilise-la pour toi, ne partage pas la page une fois la clé
        saisie.
      </p>
      <input
        className="keygate__input"
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="sk-ant-..."
        aria-label="Clé API Anthropic"
        autoComplete="off"
        spellCheck="false"
      />
      <button type="submit" className="keygate__submit" disabled={!value.trim()}>
        Réveiller le robot
      </button>
    </form>
  );
}
