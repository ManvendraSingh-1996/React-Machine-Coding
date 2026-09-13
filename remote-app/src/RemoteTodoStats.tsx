import "./style.css";

const stats = [
  { label: "Remote module", value: "Loaded" },
  { label: "Owner", value: "todoRemote" },
  { label: "Port", value: "5001" },
];

export default function RemoteTodoStats() {
  return (
    <section className="remote-card">
      <div>
        <span className="remote-eyebrow">Federated component</span>
        <h2>Todo Remote Stats</h2>
      </div>

      <div className="remote-grid">
        {stats.map((item) => (
          <div className="remote-stat" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
