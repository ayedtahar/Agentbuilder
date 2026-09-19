import { useCallback, useEffect, useRef, useState } from 'react';

import { FIELDS, OBJECTS_BY_ID, newItem } from './catalog';
import Palette from './components/Palette';
import ConfigPanel from './components/ConfigPanel';
import ExportModal from './components/ExportModal';
import Robot from './components/Robot';

export default function App() {
  const [name, setName] = useState('Mon agent');
  const [brain, setBrain] = useState(null);
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [rags, setRags] = useState([]);
  const [selectedUid, setSelectedUid] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [ghost, setGhost] = useState(null);
  const dragRef = useRef(null);

  const equip = useCallback((object) => {
    const item = newItem(object);
    if (object.slot === 'brain') setBrain(item);
    if (object.slot === 'skill') setSkills((s) => [...s, item]);
    if (object.slot === 'tool') setTools((t) => [...t, item]);
    if (object.slot === 'rag') setRags((r) => [...r, item]);
    setSelectedUid(item.uid);
  }, []);

  // Le glisser-déposer HTML5 n'émet rien au doigt : on suit le pointeur
  // nous-mêmes, ce qui donne le même geste à la souris et au tactile.
  const startDrag = useCallback((object, event) => {
    event.preventDefault();
    dragRef.current = { object };
    setGhost({ icon: object.icon, slot: object.slot, x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    if (!ghost) return undefined;

    const move = (e) => {
      setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g));
    };

    // Un objet n'a qu'un emplacement possible : viser juste n'apporte rien,
    // il rejoint sa place où qu'on le lâche.
    const end = () => {
      if (dragRef.current) equip(dragRef.current.object);
      dragRef.current = null;
      setGhost(null);
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
    [brain, ...skills, ...tools, ...rags].find((item) => item && item.uid === selectedUid) ?? null;

  const updateSelected = useCallback(
    (key, value) => {
      const patch = (item) => (item && item.uid === selectedUid ? { ...item, [key]: value } : item);
      setBrain(patch);
      setSkills((s) => s.map(patch));
      setTools((t) => t.map(patch));
      setRags((r) => r.map(patch));
    },
    [selectedUid],
  );

  const removeSelected = useCallback(() => {
    const keep = (item) => item.uid !== selectedUid;
    setBrain((b) => (b && b.uid === selectedUid ? null : b));
    setSkills((s) => s.filter(keep));
    setTools((t) => t.filter(keep));
    setRags((r) => r.filter(keep));
    setSelectedUid(null);
  }, [selectedUid]);

  const hint = !brain
    ? 'Attrape le cerveau et lâche-le dans sa tête.'
    : tools.length === 0
      ? 'Pose un outil sur son torse : un bras pousse pour le tenir.'
      : 'Ajoute des yeux sur son visage, d’autres outils, ou un RAG sur son torse.';

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
          🚀 Exporter
        </button>
      </header>

      <Palette onGrab={startDrag} />

      <div className="app__body">
        <main className="stage">
          <Robot
            brain={brain}
            skills={skills}
            tools={tools}
            rags={rags}
            dragSlot={ghost?.slot ?? null}
            selectedUid={selectedUid}
            onSelect={setSelectedUid}
          />
          <p className="stage__hint">{hint}</p>
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

      {exporting && (
        <ExportModal
          config={{ agent: { label: name }, brain, skills, tools, rag: rags }}
          onClose={() => setExporting(false)}
        />
      )}
    </div>
  );
}
