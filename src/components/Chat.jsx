import { useEffect, useRef, useState } from 'react';

import { describeError, messageText, streamReply } from '../llm/client';
import KeyBar from './KeyBar';

export default function Chat({ agent, apiKey, onSaveKey, onForgetKey, onBusyChange }) {
  const [turns, setTurns] = useState([]);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const logRef = useRef(null);

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [turns, streaming]);

  const send = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;

    const history = [...turns, { role: 'user', content: text }];
    setTurns(history);
    setDraft('');
    setError(null);
    setBusy(true);
    setStreaming('');

    try {
      let accumulated = '';
      const message = await streamReply({
        apiKey,
        agent,
        messages: history,
        onText: (chunk) => {
          accumulated += chunk;
          setStreaming(accumulated);
        },
      });
      setTurns([
        ...history,
        { role: 'assistant', content: messageText(message), demo: message.demo },
      ]);
    } catch (err) {
      setError(describeError(err));
      // On retire la question restée sans réponse : la relancer telle quelle
      // doit rester possible.
      setTurns(turns);
      setDraft(text);
    } finally {
      setStreaming('');
      setBusy(false);
    }
  };

  const ready = Boolean(agent.brain);

  return (
    <div className="chat">
      <div className="chat__log" ref={logRef}>
        {!ready && (
          <p className="chat__hint">
            Pose un cerveau dans sa tête : sans modèle, il n’a rien pour répondre.
          </p>
        )}
        {ready && turns.length === 0 && !streaming && (
          <p className="chat__hint">Dis-lui quelque chose.</p>
        )}
        {turns.map((turn, i) => (
          <div key={i} className={`bubble bubble--${turn.role}`}>
            {turn.demo && <span className="bubble__tag">démo</span>}
            {turn.content}
          </div>
        ))}
        {streaming && <div className="bubble bubble--assistant">{streaming}</div>}
        {busy && !streaming && <div className="bubble bubble--thinking">…</div>}
      </div>

      {error && <p className="chat__error">{error}</p>}

      <form className="chat__form" onSubmit={send}>
        <input
          className="chat__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={ready ? 'Écris-lui…' : 'Il lui faut d’abord un cerveau'}
          aria-label="Message"
          disabled={busy || !ready}
        />
        <button type="submit" className="chat__send" disabled={busy || !ready || !draft.trim()}>
          {busy ? '…' : 'Envoyer'}
        </button>
      </form>

      <KeyBar hasKey={Boolean(apiKey)} onSave={onSaveKey} onForget={onForgetKey} />
    </div>
  );
}
