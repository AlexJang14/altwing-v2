import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import "./wing-reveal-loading.css";

interface WingRevealLoadingProps {
  children: ReactNode;
}

function WingRevealLoading({
  children,
}: WingRevealLoadingProps) {
  const [ready, setReady] =
    useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setReady(true),
      2400,
    );

    return () =>
      window.clearTimeout(timer);
  }, []);

  if (ready) {
    return <>{children}</>;
  }

  return (
    <main className="wing-reveal">
      <div className="wing-reveal-stars" />

      <div className="wing-reveal-flight">
        <div className="wing-reveal-trail" />

        <img
          src="/brand/altwing-penguin.png"
          alt=""
          className="wing-reveal-penguin"
        />
      </div>

      <div className="wing-reveal-content">
        <span className="wing-reveal-kicker">
          MISSION COMPLETE
        </span>

        <h1>
          Finding your
          <strong> Wing...</strong>
        </h1>

        <p>
          Reading the engineering pattern
          behind your decisions.
        </p>

        <div className="wing-reveal-checks">
          <div className="wing-reveal-check check-one">
            <span>TRADEOFFS</span>
            <b>✓</b>
          </div>

          <div className="wing-reveal-check check-two">
            <span>EVIDENCE</span>
            <b>✓</b>
          </div>

          <div className="wing-reveal-check check-three">
            <span>
              ENGINEERING PATTERN
            </span>
            <b>●</b>
          </div>
        </div>

        <div className="wing-reveal-progress">
          <div />
        </div>
      </div>
    </main>
  );
}

export default WingRevealLoading;
