// typst compile file.typ -f png --ppi 144


#let theme = (
  card-background: oklch(21.6%, 0.006, 56.043deg),
  card-foreground: oklch(98.5%, 0.001, 106.423deg),
  muted-foreground: oklch(70.9%, 0.01, 56.259deg),
  secondary-background: oklch(97%, 0.001, 106.424deg),
  secondary-foreground: oklch(21.6%, 0.006, 56.043deg),
)

#set page(
  width: 600pt,
  height: 315pt,
  margin: 0pt,
  fill: theme.card-background,
) // Resuling png dimensions in `px` are double the input `pt` with `ppi=144`

#let coin-icon-svg = read("LucideCoins.svg")

#let colorize-icon(color: black) = {
  image(
    bytes(coin-icon-svg.replace("currentColor", color.to-hex())),
    height: 90%,
  )
}

#set text(font: "New Computer Modern Sans 08")

#let pattern = tiling(size: (40pt, 40pt), spacing: (0pt, 0pt), box(
  width: 100%,
  height: 100%,
  fill: theme.secondary-background,
  inset: 5pt,
)[
  #colorize-icon(color: theme.muted-foreground.transparentize(80%))
])
)

#rect(width: 100%, height: 95pt, fill: theme.card-background)[
  #pad(left: 2em, top: 1em)[

    #box(colorize-icon(color: white))
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
            )[Calculate Poker Payouts]]]
      ]
    ]
  ]
]

#rect(
  width: 100%,
  height: 100% - 95pt - 35pt,
  stroke: (
    top: (paint: theme.card-background, thickness: 1em, join: "round"),
    rest: (paint: theme.card-background, thickness: 30pt, join: "round"),
  ),
  // radius: 4em,
  fill: pattern,
)[
  #pad(left: 2em, top: 2em)[
  ]
]
