// Reusable brand wordmark. Renders as an <svg> so it can be sized purely
// via the className the caller passes in (matches how the existing CSS
// targets it: .nav-logo, .footer-pw-logo, .login-bg-logo svg, etc.)
export default function Logo({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 46"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Proof of Work"
    >
      <text
        x="0"
        y="34"
        fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
        fontWeight="900"
        fontSize="34"
        fill="#ffffff"
        letterSpacing="-1"
      >
        P
      </text>
      <text
        x="26"
        y="34"
        fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
        fontWeight="900"
        fontSize="34"
        fill="#a6d83f"
        letterSpacing="-1"
      >
        /
      </text>
      <text
        x="44"
        y="34"
        fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
        fontWeight="900"
        fontSize="34"
        fill="#ffffff"
        letterSpacing="-1"
      >
        W
      </text>
    </svg>
  );
}
