// typst compile file.typ -f png --ppi 144

#let theme = (
  card-background: oklch(21.6%, 0.006, 56.043deg),
  card-foreground: oklch(98.5%, 0.001, 106.423deg),
  muted-foreground: oklch(70.9%, 0.01, 56.259deg),
  secondary-background: oklch(97%, 0.001, 106.424deg),
  secondary-foreground: oklch(21.6%, 0.006, 56.043deg),
)

#let coin-icon-svg = read("LucideCoins.svg") // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4"/><path d="m16.71 13.88l.7.71l-2.82 2.82"/></g></svg>


#let colorize-icon(color: black) = {
  image(
    bytes(
      coin-icon-svg.replace(
        "currentColor",
        color.to-hex(),
      ),
    ),
    height: 90%,
  )
}

#set text(font: "Inter")

#let pattern = tiling(
  size: (40pt, 40pt),
  spacing: (0pt, 0pt),
  box(
    width: 100%,
    height: 100%,
    fill: theme.card-foreground,
    inset: 5pt,
  )[
    #colorize-icon(
      color: theme.muted-foreground.transparentize(20%),
    )
  ],
)

#set page(
  width: 600pt,
  height: 315pt,
  margin: 0pt,
  fill: pattern,
) // Resuling png dimensions in `px` are double the input `pt` with `ppi=144`

#rect(
  width: 100%,
  height: 100%,
  stroke: (
    paint: theme.card-background,
    thickness: 3.5em,
    join: "round",
  ),
  radius: 5em,
)[
  #align(horizon)[
    #pad(left: 3em, top: 1em)[
      #rect(
        fill: theme.card-foreground.transparentize(30%),
        outset: 1em,
        radius: 2em,
      )[
        #rect(
          height: 95pt,
          fill: theme.card-background,
          outset: 1em,
          radius: 1.5em,
        )[
          #box(colorize-icon(color: theme.card-foreground))
          #box()[
            #pad(left: 1em)[
              #align(horizon)[
                #par(leading: 1em, spacing: 1.5em)[
                  #text(
                    size: 40pt,
                    fill: theme.card-foreground,
                    weight: "bold",
                  )[Chipcount]]
                #par(leading: 1em, spacing: 1em)[
                  #text(
                    size: 30pt,
                    fill: theme.muted-foreground,
                    weight: "semibold",
                  )[Calculate Poker Payouts]]]
            ]
          ]
        ]
      ]
    ]
  ]
]

// #rect(height: 95pt, fill: theme.card-background)[
//   #pad(left: 2em, top: 1em)[

//     #box(colorize-icon(color: white))
//     #box()[
//       #pad(left: 1em)[
//         #align(horizon)[
//           #par(leading: 1em, spacing: 1.5em)[
//             #text(
//               size: 40pt,
//               fill: theme.card-foreground,
//               weight: "bold",
//             )[Chipcount]]
//           #par(leading: 1em, spacing: 1em)[
//             #text(
//               size: 30pt,
//               fill: theme.muted-foreground,
//             )[Calculate Poker Payouts]]]
//       ]
//     ]
//   ]
// ]

// #rect(
//   width: 100%,
//   height: 100% - 95pt - 35pt,
//   stroke: (
//     top: (paint: theme.card-background, thickness: 1em, join: "round"),
//     rest: (paint: theme.card-background, thickness: 30pt, join: "round"),
//   ),
//   radius: 4em,
//   fill: pattern,
// )[
//   #pad(left: 2em, top: 2em)[
//   ]
// ]
