import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';

import { BLOCK_TYPES } from './blockLibrary';
import Palette from './components/Palette';
import ConfigPanel from './components/ConfigPanel';
import ExportModal from './components/ExportModal';
import BlockNode from './nodes/BlockNode';

const nodeTypes = {
  agent: BlockNode,
  llm: BlockNode,
  tool: BlockNode,
  skill: BlockNode,
};

let idCounter = 1;
const nextId = () => `block-${idCounter++}`;

// Sans plafond de zoom, fitView grossit le cœur seul jusqu'à remplir l'écran
// et les blocs posés ensuite débordent du canvas.
const FIT_VIEW_OPTIONS = { maxZoom: 1, padding: 0.3 };

const initialNodes = [
  {
    id: 'agent-core',
    type: 'agent',
    position: { x: 60, y: 220 },
    deletable: false,
    data: { ...BLOCK_TYPES.agent.defaultData },
  },
];

function buildConfig(nodes, edges) {
  const agentNode = nodes.find((n) => n.type === 'agent');
  const connectedIds = new Set(
    edges.filter((e) => e.target === agentNode.id).map((e) => e.source),
  );
  const connected = nodes.filter((n) => connectedIds.has(n.id));

  return {
    agent: { label: agentNode.data.label, persona: agentNode.data.persona, goal: agentNode.data.goal },
    llm: connected.find((n) => n.type === 'llm')?.data ?? null,
    tools: connected.filter((n) => n.type === 'tool').map((n) => n.data),
    skills: connected.filter((n) => n.type === 'skill').map((n) => n.data),
  };
}

function Forge() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef(null);
  const addCount = useRef(0);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges],
  );

  const addBlock = useCallback(
    (blockType, position) => {
      setNodes((nds) =>
        nds.concat({
          id: nextId(),
          type: blockType,
          position,
          data: { ...BLOCK_TYPES[blockType].defaultData },
        }),
      );
    },
    [setNodes],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const blockType = event.dataTransfer.getData('application/agent-forge-block');
      if (!blockType || !BLOCK_TYPES[blockType]) return;
      addBlock(blockType, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    },
    [addBlock, screenToFlowPosition],
  );

  // Le glisser-déposer HTML5 n'existe pas au tactile : toucher un bloc de la
  // palette doit suffire à le poser.
  const onPaletteTap = useCallback(
    (blockType) => {
      const rect = canvasRef.current.getBoundingClientRect();
      // Cascade verticale : un bloc fait ~62px de haut, moins d'écart et les
      // blocs posés à la suite se recouvrent.
      const slot = addCount.current++ % 4;
      addBlock(
        blockType,
        screenToFlowPosition({
          x: rect.x + rect.width * 0.25 + slot * 14,
          y: rect.y + rect.height * 0.12 + slot * 80,
        }),
      );
    },
    [addBlock, screenToFlowPosition],
  );

  const onNodeClick = useCallback((_, node) => setSelectedId(node.id), []);
  const onPaneClick = useCallback(() => setSelectedId(null), []);

  const onFieldChange = useCallback(
    (id, key, value) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, [key]: value } } : n)),
      );
    },
    [setNodes],
  );

  const onDeleteNode = useCallback(
    (id) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    [setNodes, setEdges],
  );

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="forge">
      <header className="forge__header">
        <h1>⚒️ Agent Builder</h1>
        <p>Assemble ton agent : glisse des blocs, relie-les au cœur, exporte.</p>
        <button type="button" className="forge__export" onClick={() => setExporting(true)}>
          🚀 Exporter la config
        </button>
      </header>

      <div className="forge__body">
        <Palette onTap={onPaletteTap} />

        <div className="forge__canvas" ref={canvasRef}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={FIT_VIEW_OPTIONS}
          >
            <Background variant="dots" gap={18} size={1.5} color="#5b4636" />
            <Controls />
            <MiniMap pannable zoomable nodeColor={(n) => BLOCK_TYPES[n.type]?.color ?? '#999'} />
          </ReactFlow>
        </div>

        <ConfigPanel node={selectedNode} onChange={onFieldChange} onDelete={onDeleteNode} />
      </div>

      {exporting && (
        <ExportModal config={buildConfig(nodes, edges)} onClose={() => setExporting(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Forge />
    </ReactFlowProvider>
  );
}
