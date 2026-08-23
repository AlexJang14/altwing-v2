import { useMemo, useState } from "react";
import "./final-mission.css";

export type MissionPriorityId =
  | "communications"
  | "safety"
  | "science"
  | "verification";

export interface FinalMissionResult {
  allocations: Record<MissionPriorityId, number>;

  totalAllocated: number;
  adjustments: number;

  dominantPriority: MissionPriorityId;
  dominantPriorityName: string;

  balanceSpread: number;
}

interface FinalMissionPanelProps {
  locked?: boolean;

  onLock?: (
    result: FinalMissionResult,
  ) => void;
}

interface MissionPriority {
  id: MissionPriorityId;
  label: string;
  shortLabel: string;
  description: string;
}

const TOTAL_POINTS = 100;
const STEP = 5;

const priorities: MissionPriority[] = [
  {
    id: "communications",
    label: "COMMUNICATIONS RECOVERY",
    shortLabel: "COMMS",

    description:
      "Restore the RF link, confirm antenna health, and improve the probability that mission data reaches Earth.",
  },

  {
    id: "safety",
    label: "VEHICLE SAFETY",
    shortLabel: "SAFETY",

    description:
      "Protect thermal, structural, and power margins before beginning extended surface operations.",
  },

  {
    id: "science",
    label: "SCIENCE OPERATIONS",
    shortLabel: "SCIENCE",

    description:
      "Use the remaining mission window to collect high-value measurements from the landing site.",
  },

  {
    id: "verification",
    label: "DATA VERIFICATION",
    shortLabel: "VERIFY",

    description:
      "Cross-check navigation, sensor, and system data before committing the vehicle to its next operational phase.",
  },
];

const initialAllocations: Record<
  MissionPriorityId,
  number
> = {
  communications: 0,
  safety: 0,
  science: 0,
  verification: 0,
};

function FinalMissionPanel({
  locked = false,
  onLock,
}: FinalMissionPanelProps) {
  const [
    allocations,
    setAllocations,
  ] = useState(initialAllocations);

  const [
    adjustments,
    setAdjustments,
  ] = useState(0);

  const totalAllocated =
    useMemo(() => {
      return Object.values(
        allocations,
      ).reduce(
        (sum, value) =>
          sum + value,
        0,
      );
    }, [allocations]);

  const remaining =
    TOTAL_POINTS -
    totalAllocated;

  function changeAllocation(
    id: MissionPriorityId,
    direction: 1 | -1,
  ) {
    if (locked) {
      return;
    }

    setAllocations(
      (current) => {
        const currentValue =
          current[id];

        const nextValue =
          currentValue +
          direction * STEP;

        if (nextValue < 0) {
          return current;
        }

        if (
          direction === 1 &&
          remaining < STEP
        ) {
          return current;
        }

        setAdjustments(
          (count) =>
            count + 1,
        );

        return {
          ...current,
          [id]: nextValue,
        };
      },
    );
  }

  function handleReset() {
    if (locked) {
      return;
    }

    setAllocations(
      initialAllocations,
    );

    setAdjustments(0);
  }

  function handleLock() {
    if (
      totalAllocated !==
      TOTAL_POINTS
    ) {
      return;
    }

    const ranked =
      priorities
        .map((priority) => ({
          ...priority,
          value:
            allocations[
              priority.id
            ],
        }))
        .sort(
          (a, b) =>
            b.value -
            a.value,
        );

    const highest =
      ranked[0];

    const lowest =
      ranked[
        ranked.length - 1
      ];

    const result:
      FinalMissionResult = {
        allocations,

        totalAllocated,

        adjustments,

        dominantPriority:
          highest.id,

        dominantPriorityName:
          highest.label,

        balanceSpread:
          highest.value -
          lowest.value,
      };

    console.group(
      "AltWing Final Mission",
    );

    console.log(
      "Final allocation:",
      result,
    );

    console.groupEnd();

    onLock?.(result);
  }

  return (
    <div className="final-mission">
      <div className="final-mission__header">
        <div>
          <span>
            MISSION COMMAND
          </span>

          <h2>
            Set the final priorities.
          </h2>
        </div>

        <div className="final-mission__remaining">
          {remaining}

          <small>
            POINTS LEFT
          </small>
        </div>
      </div>

      <div className="final-mission__brief">
        <span>
          FINAL OPERATIONS WINDOW
        </span>

        <strong>
          100 mission points.
          Four competing objectives.
        </strong>

        <p>
          Touchdown succeeded,
          but communications,
          vehicle margins,
          science opportunity,
          and data confidence
          still compete for the
          remaining mission
          resources.
        </p>
      </div>

      <div className="final-mission__allocation">
        {priorities.map(
          (priority) => {
            const value =
              allocations[
                priority.id
              ];

            const percentage =
              `${value}%`;

            return (
              <div
                className="priority-card"
                key={
                  priority.id
                }
              >
                <div className="priority-card__heading">
                  <div>
                    <span>
                      {
                        priority.shortLabel
                      }
                    </span>

                    <strong>
                      {
                        priority.label
                      }
                    </strong>
                  </div>

                  <b>
                    {value}
                  </b>
                </div>

                <p>
                  {
                    priority.description
                  }
                </p>

                <div className="priority-card__bar">
                  <div
                    style={{
                      width:
                        percentage,
                    }}
                  />
                </div>

                <div className="priority-card__controls">
                  <button
                    type="button"
                    disabled={
                      locked ||
                      value <= 0
                    }
                    onClick={() =>
                      changeAllocation(
                        priority.id,
                        -1,
                      )
                    }
                    aria-label={`Remove ${STEP} points from ${priority.label}`}
                  >
                    −
                  </button>

                  <span>
                    {value}
                    <small>
                      pts
                    </small>
                  </span>

                  <button
                    type="button"
                    disabled={
                      locked ||
                      remaining <
                        STEP
                    }
                    onClick={() =>
                      changeAllocation(
                        priority.id,
                        1,
                      )
                    }
                    aria-label={`Add ${STEP} points to ${priority.label}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          },
        )}
      </div>

      <div className="final-mission__summary">
        <div>
          <span>
            TOTAL ALLOCATED
          </span>

          <strong>
            {totalAllocated}
            <small>
              {" "}
              / {TOTAL_POINTS}
            </small>
          </strong>
        </div>

        <div>
          <span>
            ADJUSTMENTS
          </span>

          <strong>
            {adjustments}
          </strong>
        </div>
      </div>

      {remaining > 0 ? (
        <div className="final-mission__feedback">
          <span>
            PLAN INCOMPLETE
          </span>

          <p>
            Allocate the remaining{" "}
            <strong>
              {remaining}
            </strong>{" "}
            mission points before
            execution.
          </p>
        </div>
      ) : (
        <div className="final-mission__feedback final-mission__feedback--ready">
          <span>
            PLAN READY
          </span>

          <p>
            All mission resources
            are allocated. Review
            your tradeoffs before
            execution.
          </p>
        </div>
      )}

      <div className="final-mission__actions">
        <button
          type="button"
          className="final-mission__reset"
          disabled={
            locked ||
            totalAllocated === 0
          }
          onClick={
            handleReset
          }
        >
          Reset allocation
        </button>

        <button
          type="button"
          className="final-mission__lock"
          disabled={
            locked ||
            totalAllocated !==
              TOTAL_POINTS
          }
          onClick={
            handleLock
          }
        >
          {locked
            ? "Mission plan executed"
            : totalAllocated ===
                TOTAL_POINTS
              ? "Execute mission plan"
              : "Allocate all 100 points"}
        </button>
      </div>
    </div>
  );
}

export default FinalMissionPanel;