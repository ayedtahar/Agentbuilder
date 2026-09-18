import { Handle, Position } from '@xyflow/react';
import { iconFor } from '../blockLibrary';

// Le robot est la lecture directe de ce qui lui est relié : sans cerveau il
// reste éteint, chaque tool lui remplit une main, chaque skill empile un
// livre à ses pieds.
export default function RobotNode({ data, selected }) {
  const { label, llm, tools = [], skills = [] } = data;
  const awake = Boolean(llm);
  const hands = tools.slice(0, 2);
  const belt = tools.slice(2);

  return (
    <div className={`robot${selected ? ' is-selected' : ''}${awake ? ' is-awake' : ''}`}>
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />

      <svg className="robot__svg" viewBox="0 0 220 250" role="img" aria-label={label}>
        {/* Antenne */}
        <line className="robot__wire" x1="110" y1="34" x2="110" y2="18" />
        <circle className="robot__bulb" cx="110" cy="12" r="7" />

        {/* Tête */}
        <rect className="robot__shell" x="64" y="34" width="92" height="64" rx="18" />
        <circle className="robot__eye" cx="89" cy="62" r="10" />
        <circle className="robot__eye" cx="131" cy="62" r="10" />
        <rect className="robot__mouth" x="95" y="80" width="30" height="5" rx="2.5" />

        {/* Cou et torse */}
        <rect className="robot__shell" x="101" y="98" width="18" height="10" />
        <rect className="robot__shell" x="58" y="106" width="104" height="80" rx="16" />
        <rect className="robot__screen" x="73" y="120" width="74" height="36" rx="8" />
        <text className="robot__screen-text" x="110" y="143" textAnchor="middle">
          {awake ? llm.model : 'hors ligne'}
        </text>

        {/* Bras : chaque main tient un tool */}
        <rect className="robot__shell" x="38" y="114" width="16" height="44" rx="8" />
        <rect className="robot__shell" x="166" y="114" width="16" height="44" rx="8" />
        {[
          { cx: 46, tool: hands[0] },
          { cx: 174, tool: hands[1] },
        ].map(({ cx, tool }) => (
          <g key={cx}>
            <circle className={`robot__hand${tool ? ' is-filled' : ''}`} cx={cx} cy="170" r="17" />
            {tool && (
              <text className="robot__hand-icon" x={cx} y="177" textAnchor="middle">
                {iconFor('tool', tool)}
              </text>
            )}
          </g>
        ))}

        {/* Jambes */}
        <rect className="robot__shell" x="80" y="186" width="18" height="26" rx="6" />
        <rect className="robot__shell" x="122" y="186" width="18" height="26" rx="6" />
        <rect className="robot__shell" x="70" y="210" width="38" height="11" rx="5" />
        <rect className="robot__shell" x="112" y="210" width="38" height="11" rx="5" />

        {/* Mémoire empilée aux pieds */}
        {skills.slice(0, 4).map((skill, i) => (
          <text
            key={skill.label + i}
            className="robot__book"
            x={26 + i * 7}
            y={228 - i * 13}
            textAnchor="middle"
          >
            {iconFor('skill', skill)}
          </text>
        ))}

        {/* Ceinture : les tools au-delà des deux mains */}
        {belt.map((tool, i) => (
          <text
            key={tool.label + i}
            className="robot__belt-icon"
            x={178 + (i % 2) * 20}
            y={210 + Math.floor(i / 2) * 20}
            textAnchor="middle"
          >
            {iconFor('tool', tool)}
          </text>
        ))}
      </svg>

      <div className="robot__name">{label}</div>
      <div className="robot__status">
        {awake ? `${tools.length} outil(s) · ${skills.length} mémoire(s)` : 'branche-lui un cerveau'}
      </div>
    </div>
  );
}
