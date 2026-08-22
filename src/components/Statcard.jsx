function StatCard({ title, value, change, icon }) {
  const isNegative = change?.includes("↓");

  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <div>
          <p className="stat-title">
            {title}
          </p>

          <h2 className="stat-value">
            {value}
          </h2>

          <p
            className={`stat-change ${
              isNegative ? "negative" : ""
            }`}
          >
            {change}
          </p>

          <span className="stat-period">
            This Month
          </span>
        </div>


        <div className="stat-icon">
          {icon}
        </div>

      </div>


      {/* Decorative line */}

      <div className="stat-glow-line"></div>

    </div>
  );
}

export default StatCard;