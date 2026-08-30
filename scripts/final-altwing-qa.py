from pathlib import Path
import sys


checks = [
    (
        Path(
            "src/features/wingmatch/engine/wingmatchV5.ts"
        ),
        "V5_CHOICE_MISSIONS",
        "WingMatch V5",
    ),

    (
        Path(
            "src/features/wingmatch/result/WingMascot.tsx"
        ),
        "wing-mascot",
        "Wing mascots",
    ),

    (
        Path(
            "src/features/wingmatch/result/WingMatchResult.tsx"
        ),
        "WHAT YOU COULD HAVE",
        "Wing landscape",
    ),

    (
        Path(
            "src/features/wingmatch/opportunities/OpportunityRadar.tsx"
        ),
        "YOUR STATE",
        "State opportunity selector",
    ),

    (
        Path(
            "src/features/wingmatch/build/BuildWing.tsx"
        ),
        "PROJECT OWNERSHIP",
        "Project ownership",
    ),

    (
        Path(
            "src/features/wingmatch/build/BuildWing.tsx"
        ),
        "VERSION HISTORY",
        "Version history",
    ),

    (
        Path(
            "src/features/wingmatch/build/ProjectPortfolio.tsx"
        ),
        "PROJECT EVIDENCE",
        "Evidence portfolio",
    ),

    (
        Path(
            "src/features/progression/MyUniversePanel.tsx"
        ),
        "Deep Space Packs",
        "Cosmic Pack Vault",
    ),

    (
        Path(
            "src/features/progression/MyUniversePanel.tsx"
        ),
        "VERIFIED ACCOUNTS REQUIRED",
        "Honest leaderboard lock",
    ),
]


failed = []


print("")
print(
    "===== ALTWING FINAL QA ====="
)


for path, phrase, label in checks:

    if not path.exists():
        print(
            f"✗ {label}: file missing"
        )

        failed.append(
            label
        )

        continue


    text =
        path.read_text()


    if phrase not in text:
        print(
            f"✗ {label}: expected marker missing"
        )

        failed.append(
            label
        )

    else:
        print(
            f"✓ {label}"
        )


print("")


if failed:

    print(
        "FINAL QA FAILED:"
    )

    for item in failed:
        print(
            f"- {item}"
        )

    sys.exit(1)


print(
    "PASS: required AltWing V2 systems are present."
)
