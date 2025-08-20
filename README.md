# Trimlight Amp Calculator

The **Trimlight Amp Calculator** is a React Native + TypeScript app (built with Expo) that helps Trimlight installers quickly determine how many amps are required for a given lighting run. The goal is to remove guesswork in the field, prevent dimming or color failures, and standardize installs across all dealers.

## Why It’s Useful

When too many lights are run on a single line, voltage drop causes visible issues — lights dim, colors fail to change, or patterns look inconsistent. Fixing this after installation wastes labor time, materials, and can delay job completion.  
This tool automates the math that installers have traditionally done by hand, saving hours of rework and ensuring accurate planning _before_ the first light goes up.

## How It Works

- Uses known values from the field:

  - ~100 lights per amp for standard runs
  - ~70 lights per amp for 3L runs
  - Each piece of trim = 7.7 ft with ~10 lights at 9" spacing

- Example:

  - 245' ÷ 7.7 ≈ 32 pieces
  - 32 × 10 = 320 lights
  - 320 ÷ 70 = ~4.4 → rounds up to **5 amps required**

- The app currently outputs **how many amps are needed** on a run. (Optional logic for telling dealers exactly _where_ to splice is commented out and can be enabled if needed.)

- All calculations run **client-side** — no internet connection required in the field.

## Features

- 🔢 **Accurate Amp Calculations** — Automates the light count → amp requirement math installers already do.
- 📱 **Cross-Platform** — Built with Expo to run on iOS, Android, and the web.
- ⚡ **Prevents Voltage Drop** — Ensures runs don’t exceed safe thresholds.
- 🏠 **Optimized for Full House Wraps** — Scales easily for large projects.
- 🔒 **Offline-First** — Works without connectivity on job sites.
- 🛠️ **Configurable** — Thresholds and product types can be updated as Trimlight expands its product line.

## Tech Stack

- **Languages:** TypeScript, JavaScript
- **Framework:** React Native (Expo Router)
- **Styling:** React Native StyleSheet (mobile) + React Native Web
- **Deployment:** Expo (iOS, Android, Web)

## Demo

👉 [Live App]()

Screenshots:  
_(insert field screenshots here)_

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/fauxfox117/trimlight-amp-calculator.git
cd trimlight-amp-calculator
npm install
npx expo start
# Scan QR code with Expo Go app
```

## Current Working State - August 19, 2025

### Recent Updates:

- ✅ Individual line calculations with different lengths
- ✅ Amp positioning with 40-foot rule compliance
- ✅ Support for Standard, 3L, Globe, and Soffit light types
- ✅ Save/load system functionality with scrolling history
- ✅ Multi-line systems with detailed breakdown

### Example Calculation:

**Input:** 3 lines (150ft, 200ft, 100ft) with 9" spacing, Standard lights  
**Output:** Line 1: 2 amps, Line 2: 3 amps, Line 3: 1 amp = **6 total amps needed**
