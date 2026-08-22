function VerificationProgress() {
  const steps = [
    {
      number: "1",
      icon: "📋",
      title: "Registered",
      status: "completed",
    },
    {
      number: "2",
      icon: "📷",
      title: "Before Evidence",
      status: "completed",
    },
    {
      number: "3",
      icon: "🏗️",
      title: "Work Completed",
      status: "completed",
    },
    {
      number: "4",
      icon: "📸",
      title: "After Evidence",
      status: "completed",
    },
    {
      number: "5",
      icon: "🤖",
      title: "AI Verification",
      status: "active",
    },
    {
      number: "6",
      icon: "👥",
      title: "Citizen Verification",
      status: "pending",
    },
    {
      number: "7",
      icon: "✓",
      title: "Final Status",
      status: "pending",
    },
  ];

  return (
    <section className="verification-card">

      {/* HEADER */}

      <div className="verification-title">

        <div>
          <p className="section-label">
            VERIFICATION JOURNEY
          </p>

          <h2>
            Work Verification Progress
          </h2>
        </div>

        <div className="verification-percent">
          68%
        </div>

      </div>


      {/* TIMELINE */}

      <div className="verification-timeline">

        {steps.map((step, index) => (

          <div
            className="verification-item"
            key={step.number}
          >

            <div
              className={`verification-circle ${step.status}`}
            >
              {step.icon}
            </div>

            <span className="verification-number">
              {step.number}.
            </span>

            <p>
              {step.title}
            </p>


            {index < steps.length - 1 && (
              <div
                className={`verification-line ${
                  step.status === "completed"
                    ? "completed"
                    : ""
                }`}
              />
            )}

          </div>

        ))}

      </div>

    </section>
  );
}

export default VerificationProgress;