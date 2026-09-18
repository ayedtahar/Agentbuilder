import { useState } from 'react';

export default function ExportModal({ config, onClose }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(config, null, 2);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.agent.label.replace(/\s+/g, '-').toLowerCase() || 'agent'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>🚀 Config de l’agent</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <pre className="modal__json">{json}</pre>
        <div className="modal__actions">
          <button type="button" onClick={copy}>
            {copied ? '✅ Copié !' : '📋 Copier'}
          </button>
          <button type="button" onClick={download}>
            ⬇️ Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}
