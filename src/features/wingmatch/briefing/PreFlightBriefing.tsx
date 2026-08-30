import "./preflight-briefing.css";


interface Props {
  onBack: () => void;
  onStart: () => void;
}


function PreFlightBriefing({
  onBack,
  onStart,
}: Props) {

  return (
    <main className="preflight-shell">

      <header className="preflight-nav">

        <button
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>

      </header>


      <section className="preflight-card">

        <div className="preflight-penguin">

          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

          <i />

        </div>


        <span className="preflight-kicker">
          WINGMATCH V5
        </span>


        <h1>
          Make decisions.
          <strong>
            {" "}Don&apos;t describe
            yourself.
          </strong>
        </h1>


        <p className="preflight-intro">
          You do not need aerospace
          knowledge. AltWing uses
          short mission situations
          and mini interactions
          instead of asking what
          kind of person you think
          you are.
        </p>


        <div className="preflight-facts">

          <article>
            <b>
              ~5 MIN
            </b>

            <span>
              Quick mission
            </span>
          </article>

          <article>
            <b>
              8 SCENES
            </b>

            <span>
              Different situations
            </span>
          </article>

          <article>
            <b>
              2 MINI LABS
            </b>

            <span>
              Actual interaction
            </span>
          </article>

          <article>
            <b>
              NO GRADES
            </b>

            <span>
              No right answer
            </span>
          </article>

        </div>


        <div className="preflight-rule">

          <span>
            IMPORTANT
          </span>

          <strong>
            Every option can be a
            reasonable engineering
            choice.
          </strong>

          <p>
            Choose what you would
            actually want to examine
            or do next.
          </p>

        </div>


        <button
          type="button"
          className="preflight-start"
          onClick={onStart}
        >
          START WINGMATCH →
        </button>


        <button
          type="button"
          className="preflight-back"
          onClick={onBack}
        >
          Maybe later
        </button>

      </section>

    </main>
  );
}


export default PreFlightBriefing;
