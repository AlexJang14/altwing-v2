import { useState } from "react";
import "./structure-scan.css";

export type StructureZoneId =
  | "upper-joint"
  | "main-strut"
  | "lower-joint"
  | "footpad";

export interface StructureScanResult {
  zoneId: StructureZoneId;
  zoneName: string;

  strain: number;
  bucklingMargin: number;
  reinforcementMass: number;

  inspections: number;
  inspectedZones: StructureZoneId[];
}

interface StructureZone {
  id: StructureZoneId;
  name: string;

  strain: number;
  bucklingMargin: number;
  reinforcementMass: number;

  note: string;

  x: number;
  y: number;
}

interface StructureScanPanelProps {
  locked?: boolean;

  onLock?: (
    result: StructureScanResult,
  ) => void;
}

const zones: StructureZone[] = [
  {
    id: "upper-joint",

    name: "UPPER JOINT",

    strain: 42,
    bucklingMargin: 1.8,
    reinforcementMass: 1.5,

    note:
      "Loads transfer cleanly into the vehicle frame. Margin remains healthy.",

    x: 50,
    y: 18,
  },

  {
    id: "main-strut",

    name: "MAIN STRUT",

    strain: 78,
    bucklingMargin: 1.15,
    reinforcementMass: 2.5,

    note:
      "Compression is high and the member is approaching its buckling margin.",

    x: 43,
    y: 48,
  },

  {
    id: "lower-joint",

    name: "LOWER JOINT",

    strain: 66,
    bucklingMargin: 1.35,
    reinforcementMass: 1.2,

    note:
      "The joint is carrying significant combined compression and bending load.",

    x: 38,
    y: 72,
  },

  {
    id: "footpad",

    name: "FOOTPAD",

    strain: 35,
    bucklingMargin: 2.1,
    reinforcementMass: 0.8,

    note:
      "Surface contact load is elevated but remains distributed across the pad.",

    x: 32,
    y: 89,
  },
];

function StructureScanPanel({
  locked = false,
  onLock,
}: StructureScanPanelProps) {
  const [
    selectedZoneId,
    setSelectedZoneId,
  ] = useState<StructureZoneId | null>(
    null,
  );

  const [
    inspectedZones,
    setInspectedZones,
  ] = useState<StructureZoneId[]>([]);

  const selectedZone =
    zones.find(
      (zone) =>
        zone.id === selectedZoneId,
    ) ?? null;

  function inspectZone(
    zone: StructureZone,
  ) {
    if (locked) {
      return;
    }

    setSelectedZoneId(zone.id);

    setInspectedZones((current) => {
      if (current.includes(zone.id)) {
        return current;
      }

      return [
        ...current,
        zone.id,
      ];
    });
  }

  function handleLock() {
    if (!selectedZone) {
      return;
    }

    const result: StructureScanResult = {
      zoneId:
        selectedZone.id,

      zoneName:
        selectedZone.name,

      strain:
        selectedZone.strain,

      bucklingMargin:
        selectedZone.bucklingMargin,

      reinforcementMass:
        selectedZone.reinforcementMass,

      inspections:
        inspectedZones.length,

      inspectedZones,
    };

    console.group(
      "AltWing Structural Diagnosis",
    );

    console.log(
      "Reinforcement target:",
      result,
    );

    console.log(
      "Inspected zones:",
      inspectedZones,
    );

    console.groupEnd();

    onLock?.(result);
  }

  return (
    <div className="structure-scan">
      <div className="structure-scan__header">
        <div>
          <span>
            STRUCTURAL ANALYSIS
          </span>

          <h2>
            Find the weak link.
          </h2>
        </div>

        <div className="structure-scan__counter">
          {inspectedZones.length}

          <small>
            / 4 inspected
          </small>
        </div>
      </div>

      <div className="structure-diagram">
        <div className="structure-diagram__vehicle">
          LANDER
        </div>

        <div className="structure-diagram__body" />

        <div className="structure-diagram__strut" />

        <div className="structure-diagram__foot" />

        <div className="structure-diagram__load">
          ↓ TOUCHDOWN LOAD
        </div>

        {zones.map((zone) => {
          const selected =
            selectedZoneId === zone.id;

          const inspected =
            inspectedZones.includes(
              zone.id,
            );

          return (
            <button
              type="button"
              key={zone.id}
              disabled={locked}
              onClick={() =>
                inspectZone(zone)
              }
              className={[
                "structure-zone",

                selected
                  ? "structure-zone--selected"
                  : "",

                inspected
                  ? "structure-zone--inspected"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
              }}
              aria-label={
                zone.name
              }
            >
              <span />
            </button>
          );
        })}
      </div>

      <div className="structure-zone-list">
        {zones.map((zone) => {
          const selected =
            selectedZoneId === zone.id;

          const inspected =
            inspectedZones.includes(
              zone.id,
            );

          return (
            <button
              type="button"
              key={zone.id}
              disabled={locked}
              onClick={() =>
                inspectZone(zone)
              }
              className={[
                "structure-zone-card",

                selected
                  ? "structure-zone-card--selected"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div>
                <strong>
                  {zone.name}
                </strong>

                {inspected && (
                  <small>
                    INSPECTED
                  </small>
                )}
              </div>

              <span>
                {inspected
                  ? `${zone.strain}% strain`
                  : "SCAN"}
              </span>
            </button>
          );
        })}
      </div>

      {selectedZone ? (
        <div className="structure-readout">
          <div className="structure-readout__title">
            <span>
              SENSOR READOUT
            </span>

            <strong>
              {selectedZone.name}
            </strong>
          </div>

          <div className="structure-readout__metrics">
            <div>
              <span>STRAIN</span>

              <strong>
                {selectedZone.strain}%
              </strong>
            </div>

            <div>
              <span>
                BUCKLING MARGIN
              </span>

              <strong>
                {selectedZone.bucklingMargin.toFixed(
                  2,
                )}
              </strong>
            </div>

            <div>
              <span>
                REINFORCEMENT
              </span>

              <strong>
                +
                {
                  selectedZone.reinforcementMass
                }
                kg
              </strong>
            </div>
          </div>

          <p>
            {selectedZone.note}
          </p>
        </div>
      ) : (
        <div className="structure-readout structure-readout--empty">
          Inspect a structural zone to
          reveal its load data.
        </div>
      )}

      <button
        type="button"
        className="structure-lock"
        disabled={
          locked ||
          !selectedZone
        }
        onClick={handleLock}
      >
        {locked
          ? "Reinforcement locked"
          : selectedZone
            ? `Reinforce ${selectedZone.name}`
            : "Choose reinforcement target"}
      </button>
    </div>
  );
}

export default StructureScanPanel;