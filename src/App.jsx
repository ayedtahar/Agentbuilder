import { useCallback, useEffect, useRef, useState } from 'react';

import { FIELDS, OBJECTS_BY_ID, newItem } from './catalog';
import Palette from './components/Palette';
import ConfigPanel from './components/ConfigPanel';
import ExportModal from './components/ExportModal';
import Robot from './components/Robot';

const TAP_SLOP = 8;

function slotAt(x, y) {
  return document.elementFromPoint(x, y)?.closest('[data-slot]')?.dataset.slot ?? null;
}

export default function App() {
  const [name, setName] = useState('Mon agent');
  const [brain, setBrain] = useState(null);
  const [tools, setTools] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedUid, setSelectedUid] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [ghost, setGhost] = useState(null);
  const [hoverSlot, setHoverSlot] = useState(null);
  const dragRef = useRef(null);

  const equip = useCallback((object) => {
    const item = newItem(object);
    if (object.slot === 'brain') setBrain(item);
    if (object.slot === 'tool') setTools((t) => [...t, item]);
    if (object.slot === 'memory') setSkills((s) => [...s, item]);
    setSelectedUid(item.uid);
  }, []);

  // Le glisser-déposer HTML5 n'émet rien au doigt : on suit le pointeur
  // nous-mêmes, ce qui donne le même geste à la souris et au tactile.
  const startDrag = useCallback((object, event) => {
    event.preventDefault();
    dragRef.current = { object, startX: event.clientX, startY: event.clientY };
    setGhost({ icon: object.icon, slot: object.slot, x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    if (!ghost) return undefined;

    const move = (e) => {
      setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g));
      setHoverSlot(slotAt(e.clientX, e.clientY));
    };

    const end = (e) => {
      const drag = dragRef.current;
      if (drag) {
        const moved = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
        const slot = slotAt(e.clientX, e.clientY);
        // Relâché sur le bon emplacement, ou simple tap sans avoir bougé :
        // dans les deux cas l'objet rejoint le robot.
        if (slot === drag.object.slot || moved < TAP_SLOP) equip(drag.object);
      }
      dragRef.current = null;
      setGhost(null);
      setHoverSlot(null);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [ghost, equip]);

  const selected =
    [brain, ...tools, ...skills].find((item) => item && item.uid === selectedUid) ?? null;

  const updateSelected = useCallback(
    (key, value) => {
      const patch = (item) => (item && item.uid === selectedUid ? { ...item, [key]: value } : item);
      setBrain(patch);
      setTools((t) => t.map(patch));
      setSkills((s) => s.map(patch));
    },
    [selectedUid],
  );

  const removeSelected = useCallback(() => {
    setBrain((b) => (b && b.uid === selectedUid ? null : b));
    setTools((t) => t.filter((item) => item.uid !== selectedUid));
    setSkills((s) => s.filter((item) => item.uid !== selectedUid));
    setSelectedUid(null);
  }, [selectedUid]);

  const config = {
    agent: { label: name },
    brain,
    tools,
    memory: skills,
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>
          🤖 <span className="app__title-text">Agent Builder</span>
        </h1>
        <input
          className="app__name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Nom de l’agent"
        />
        <button type="button" className="app__export" onClick={() => setExporting(true)}>
          🚀 Exporter la config
        </button>
      </header>

      <div className="app__body">
        <Palette onGrab={startDrag} />

        <main className="stage">
          <Robot
            brain={brain}
            tools={tools}
            skills={skills}
            dragSlot={ghost?.slot ?? null}
            hoverSlot={hoverSlot}
            selectedUid={selectedUid}
            onSelect={setSelectedUid}
          />
          <p className="stage__hint">
            {brain
              ? 'Pose d’autres objets sur ses mains ou à ses pieds.'
              : 'Attrape le cerveau et lâche-le dans sa tête.'}
          </p>
        </main>

        <ConfigPanel
          item={selected}
          fields={selected ? FIELDS[OBJECTS_BY_ID[selected.objectId].slot] : null}
          icon={selected ? OBJECTS_BY_ID[selected.objectId].icon : null}
          onChange={updateSelected}
          onRemove={removeSelected}
        />
      </div>

      {ghost && (
        <div className="ghost" style={{ left: ghost.x, top: ghost.y }}>
          {ghost.icon}
        </div>
      )}

      {exporting && <ExportModal config={config} onClose={() => setExporting(false)} />}
    </div>
  );
}
