import { OBJECTS, SLOTS } from '../catalog';

export default function Palette({ onGrab }) {
  return (
    <aside className="palette">
      {Object.entries(SLOTS).map(([slot, meta]) => (
        <section key={slot} className="palette__group">
          <h2 className="palette__title">
            {meta.label} <span>· {meta.where}</span>
          </h2>
          <div className="palette__objects">
            {OBJECTS.filter((o) => o.slot === slot).map((object) => (
              <button
                key={object.id}
                type="button"
                className="object"
                title={object.label}
                aria-label={object.label}
                onPointerDown={(e) => onGrab(object, e)}
              >
                <span className="object__icon">{object.icon}</span>
                <span className="object__label">{object.label}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
}
