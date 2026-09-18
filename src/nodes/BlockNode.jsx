import { Handle, Position } from '@xyflow/react';
import { BLOCK_TYPES } from '../blockLibrary';

function preview(type, data) {
  if (type === 'llm') return data.model;
  if (type === 'tool') return data.kind;
  if (type === 'skill') return data.sourceType;
  if (type === 'agent') return 'racine de l’agent';
  return '';
}

export default function BlockNode({ type, data, selected }) {
  const meta = BLOCK_TYPES[type];

  return (
    <div
      className={`block-node${selected ? ' is-selected' : ''}`}
      style={{ '--block-color': meta.color }}
    >
      {type !== 'agent' && <Handle type="source" position={Position.Right} />}
      {type === 'agent' && <Handle type="target" position={Position.Left} />}

      <div className="block-node__icon">{meta.icon}</div>
      <div className="block-node__body">
        <div className="block-node__label">{data.label}</div>
        <div className="block-node__preview">{preview(type, data)}</div>
      </div>
    </div>
  );
}
