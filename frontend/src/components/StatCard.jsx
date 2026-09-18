// Matches Dashboard.jsx usage: <StatCard title value change icon />
export default function StatCard({ title, value, change, icon }) {
  // Purely presentational: the "!" icon (Reported Issues) gets the
  // negative accent color on its change line. No business data here.
  const isNegative = icon === "!";

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div>
          <p className="stat-title">{title}</p>
          <h2 className="stat-value">{value}</h2>
        </div>

        <div className="stat-icon">{icon}</div>
      </div>

      <p className={`stat-change ${isNegative ? "negative" : ""}`}>
        {change}
      </p>

      <span className="stat-glow-line" />
    </div>
  );
}
