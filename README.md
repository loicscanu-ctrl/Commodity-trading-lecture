Coffee Intelligence Unit - COT Positioning Dashboard

A professional-grade data visualization dashboard for analyzing Commitments of Traders (COT) reports in the coffee markets (Arabica NY & Robusta LDN). This project implements the framework described in "Advanced Positioning Flow and Sentiment Analysis".

🚀 Overview

This dashboard transforms static CFTC/ICE report data into a six-step analytical journey, providing insights into capital flows, industry hedging behavior, and speculative crowding.

🏗 Project Architecture

cot-coffee-dashboard/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── layout/         # Navigation, Sidebar, Header
│   │   ├── charts/         # Specific chart implementations
│   │   └── ui/             # Reusable metric cards and indicators
│   ├── hooks/              # Custom hooks for data management
│   ├── services/           # Data fetching and parsing logic
│   ├── utils/              # Calculation helpers (Margin adjustment, MT conversions)
│   ├── constants/          # Market specs (Lots to MT, Margin requirements)
│   ├── App.jsx             # Main application entry and routing
│   └── main.jsx            # React mounting point

📈 The Analytical Journey

1. Global Money Flow (Margin-Adjusted)

Calculates the actual risk capital entering the market.
Toggles: Users can toggle lines for "Commodity Market," "Softs," and "Coffee Complex" to visualize flow rotation.
Visuals: Cumulative Nominal Line (Total OI Value) vs. Cumulative Margin-Adjusted Line (Risk Capital) vs. Weekly Change Bars.

2. Structural Integrity (Gross OI)

Analyzes the quality of participation (Open Interest evolution vs Price).
Market Filters: Select NY Arabica, London Robusta, or Both (Mixed view).
Category Filters: Filter the stacked area chart by PMPU, Managed Money, Swap Dealers, Other Reportables, and Non-Reportables.
Pricing: When "Combined" is selected, price is displayed as a weighted average in USD/Ton.

3. Counterparty Mapping (Radial)

A "Face-off" Radial visualization showing the balance of power.
Left Hemisphere: Longs (Buyers) breakdown.
Right Hemisphere: Shorts (Sellers) breakdown.
Purpose: Identifies who is holding the risk (e.g., Funds Long vs. Industry Short).

4. Industry Pulse (PMPU Coverage)

Dives into the Producer/Merchant/Processor/User (PMPU) category.
Physical Conversion: All data converted to Metric Tons (MT).
EFP Integration: Tracks Exchange for Physical (EFP) conversions.
Market Toggles: View NY, LDN, or Combined Industry coverage.
3rd Axis: Price is overlaid on the right-hand Y-axis for correlation analysis.

5. Dry Powder Indicator

A scatter plot analyzing market "potential energy."
Axes: Volume in Metric Tons (Y-Axis) vs. Number of Traders (X-Axis).
Color Coding: Current week (Red), Last Month (Orange), Last Year (Blue).

6. Cycle Location (OB/OS Matrix)

A 1-year rolling rank matrix.
Overbought: High Price + High Net Long.
Oversold: Low Price + Low Net Short.

🛠 Tech Stack

Framework: React.js
Visualization: Recharts
Icons: Lucide-react
Styling: Tailwind CSS

📝 Methodology & Logic

Margin-Adjusted Flow
To prevent the "artificial boosting" of money flow by low-cost positions, the dashboard uses estimated margin weights:
Outright Positions: ~$6,000 margin.
Spreading Positions: ~$1,200 margin.

Coffee Complex Units
Arabica (NY): Lots converted at 17.01 Metric Tons (37,500 lbs) per lot.
Robusta (LDN): Lots converted at 10.00 Metric Tons per lot.

🚦 Getting Started

Clone the repository.
Install dependencies: npm install.
Run the development server: npm start.
