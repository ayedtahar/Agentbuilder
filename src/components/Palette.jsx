import { OBJECTS } from '../catalog';

export default function Palette({ onGrab }) {
  return (
    <div className="palette">
      {OBJECTS.map((object) => (
        <button
          key={object.id}
          type="button"
          className="object"
          aria-label={`${object.part} — ${object.role}`}
          onPointerDown={(e) => onGrab(object, e)}
        >
          <span className="object__icon">{object.icon}</span>
          <span className="object__label">{object.part}</span>
          <span className="object__hint">{object.role}</span>
        </button>
      ))}
    </div>
  );
}
