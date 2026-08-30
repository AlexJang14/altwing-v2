from itertools import product
from collections import Counter


WINGS = [
    "gnc",
    "avionics",
    "structures",
    "thermal",
    "propulsion",
    "mission-design",
]


MISSIONS = [

    [
        {
            "structures": 1.00,
            "mission-design": 0.17,
        },

        {
            "propulsion": 1.00,
            "structures": 0.17,
        },

        {
            "mission-design": 1.00,
            "propulsion": 0.17,
        },
    ],


    [
        {
            "avionics": 1.00,
            "thermal": 0.17,
        },

        {
            "gnc": 1.00,
            "avionics": 0.17,
        },

        {
            "mission-design": 1.00,
            "propulsion": 0.17,
        },
    ],


    [
        {
            "propulsion": 1.00,
            "structures": 0.17,
        },

        {
            "avionics": 1.00,
            "mission-design": 0.17,
        },

        {
            "thermal": 1.00,
            "gnc": 0.17,
        },
    ],


    [
        {
            "structures": 1.00,
            "avionics": 0.17,
        },

        {
            "gnc": 1.00,
            "mission-design": 0.17,
        },

        {
            "thermal": 1.00,
            "structures": 0.17,
        },
    ],


    [
        {
            "avionics": 1.00,
            "propulsion": 0.17,
        },

        {
            "mission-design": 1.00,
            "propulsion": 0.17,
        },

        {
            "propulsion": 1.00,
            "thermal": 0.17,
        },
    ],


    [
        {
            "gnc": 1.00,
            "structures": 0.17,
        },

        {
            "structures": 1.00,
            "propulsion": 0.17,
        },

        {
            "thermal": 1.00,
            "mission-design": 0.17,
        },
    ],
]


counts = Counter()

overlaps = 0

total_paths = 0


for answers in product(
    range(3),
    repeat=len(MISSIONS),
):

    total_paths += 1

    scores = {
        wing: 0.0
        for wing in WINGS
    }


    for mission_index, option_index in enumerate(
        answers
    ):

        weights = (
            MISSIONS
            [mission_index]
            [option_index]
        )


        for wing, value in weights.items():
            scores[wing] += value


    ordered = sorted(
        scores.items(),
        key=lambda item:
        item[1],
        reverse=True,
    )


    top_score = ordered[0][1]

    tied = [
        wing
        for wing, value in ordered
        if abs(
            value -
            top_score
        ) < 1e-9
    ]


    if len(tied) > 1:
        overlaps += 1


    counts[
        ordered[0][0]
    ] += 1


print("")
print(
    "=== WINGMATCH V5 MECHANICAL BALANCE ==="
)

print(
    f"Primary forced-choice paths: {total_paths}"
)

print(
    f"Exact top-score overlaps: {overlaps}"
)

print("")


for wing in WINGS:

    count = counts[wing]

    pct = (
        count /
        total_paths *
        100
    )

    print(
        f"{wing:16s} "
        f"{count:4d} "
        f"{pct:5.1f}%"
    )


percentages = [
    counts[wing] /
    total_paths *
    100

    for wing in WINGS
]


spread = (
    max(percentages) -
    min(percentages)
)


print("")
print(
    f"Max-min winner spread: {spread:.1f} percentage points"
)

print("")
print(
    "NOTE: This is a mechanical skew check, NOT psychometric validation."
)

print(
    "Real student outcomes are not expected to be exactly uniform."
)


if (
    min(percentages) < 8 or
    max(percentages) > 28
):
    raise SystemExit(
        "FAIL: one Wing appears mechanically over- or under-favored"
    )


print("")
print(
    "PASS: no Wing is mechanically dominant under the full response-path simulation."
)
