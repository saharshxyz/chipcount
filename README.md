# ChipCount

> A simple, client-side poker payout calculator with shareable results.

ChipCount is a web-based tool that makes it easy to settle up after a poker game. Enter each player's cash-in and cash-out amounts, and the app instantly calculates who owes whom. All calculations are performed in your browser, and the entire game state is stored in the URL, ensuring your data remains private and is easy to share.

## Key Features

-   **🧮 Instant Calculations**: Automatically calculate net winnings and losses for each player.
-   **⚖️ Slippage Handling**: Automatically handles pot discrepancies by distributing any surplus or shortage equally among all players.
-   **💸 Clear Payouts**: Get a clear, simple breakdown of exactly who needs to pay whom to settle up.
-   **🔗 Sharable State**: Share game results and state effortlessly with a single, shareable link.
-   **📊 Visual Breakdown**: Visualize winners and losers with interactive donut and bar charts.
## How It Works

-   **Client-Side & Stateless**: The application operates entirely in your browser. All game data is serialized, compressed, and stored in the URL, ensuring privacy and easy sharing without needing a backend server.
-   **Payout Calculation**: To settle debts, the app uses an efficient algorithm:
    1.  **Slippage Distribution**: It first calculates any discrepancy (surplus or shortage) in the total pot and distributes it equally among all players.
    2.  **Optimal Payments**: Players are sorted by their net balance. A two-pointer algorithm then matches the biggest losers with the biggest winners to determine the simplest and most direct payment flows, minimizing the number of transactions needed to settle the game.

## Tech Stack

-   **Framework**: Next.js / React
-   **UI**: shadcn/ui, Tailwind CSS
-   **State Management**: React Hook Form, `nuqs` (for URL query string state)
-   **Validation**: Zod
-   **Charting**: Recharts

## Getting Started

```sh
git clone https://github.com/saharshxyz/pokercalc.git
cd pokercalc
bun install
bun dev
```

Next, open [http://localhost:3000](http://localhost:3000) in your browser.
