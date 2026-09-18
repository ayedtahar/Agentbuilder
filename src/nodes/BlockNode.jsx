import { Handle, Position } from '@xyflow/react';
import { BLOCK_TYPES, iconFor } from '../blockLibrary';

function preview(type, data) {
  if (type === 'llm') return data.model;
  if (type === 'tool') return data.kind;
  if (type === 'skill') return data.sourceType;
  return '';
}

export default function BlockNode({ type, data, selected }) {
  const meta = BLOCK_TYPES[type];

  return (
    <div
      className={`block-node${selected ? ' is-selected' : ''}`}
      style={{ '--block-color': meta.color }}
    >
      {/* Un point de connexion de chaque côté : le trait vers le robot reste
          lisible quel que soit le côté où le bloc est posé. */}
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />

      <div className="block-node__icon">{iconFor(type, data)}</div>
      <div className="block-node__body">
        <div className="block-node__label">{data.label}</div>
        <div className="block-node__preview">{preview(type, data)}</div>
      </div>
    </div>
  );
}
