# 🚇 DMRC Metro Navigator

A **command-line route planner** for the Delhi Metro network, built with **Node.js**. Finds the optimal route between any two stations using graph traversal algorithms — BFS for fewest stops, and Dijkstra's algorithm for fastest or cheapest travel.

> **223 stations** · **11 metro lines** · **3 routing modes**

---

## ✨ Features

| Mode | Algorithm | What it optimizes |
|------|-----------|-------------------|
| 🚏 **Fewest Stops** | BFS (Breadth-First Search) | Minimum number of stations |
| ⏱️ **Fastest Route** | Dijkstra's Algorithm | Minimum travel time (minutes) |
| 💰 **Cheapest Route** | Dijkstra's Algorithm | Minimum fare (₹) |

- **Real DMRC data** — All 11 lines including Red, Yellow, Blue, Green, Violet, Pink, Magenta, Grey, Airport Express & Rapid Metro Gurgaon
- **Interchange handling** — Automatically navigates through interchange stations (Rajiv Chowk, Kashmere Gate, etc.)
- **Input validation** — Rejects invalid station names with helpful error messages
- **Interactive CLI** — Arrow-key selection for route type, loop for multiple searches

---

## 🎬 Demo

```
  DELHI METRO ROUTE PLANNER
  -----------------------------------
  Total stations: 223

? Enter SOURCE station: Rajiv Chowk
? Enter DESTINATION station: HUDA City Centre
? How do you want to travel?
  ❯ ⏱️  Fastest Route    (minimum time)
    💰 Cheapest Route   (minimum fare)
    🚏 Fewest Stops     (minimum stops)

  🚇 Route Found — 42 min (21 stops)
  ─────────────────────────────────────────────
  🟢 1. Rajiv Chowk
  │  2. Patel Chowk
  │  3. Central Secretariat
  │  ...
  │  21. IFFCO Chowk
  🔴 22. HUDA City Centre
  ─────────────────────────────────────────────
  Total: 21 stops | 42 min
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **CLI Framework:** Inquirer.js (v14)
- **Algorithms:** BFS, Dijkstra's Algorithm
- **Data Structure:** Weighted Adjacency List Graph, Priority Queue

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/suryavanshamikgpian/DMRC-Metro-Navigator.git

# Navigate to the project
cd DMRC-Metro-Navigator

# Install dependencies
npm install
```

---

## 🚀 Usage

```bash
node src/index.js
```

Follow the interactive prompts:
1. Enter your **source** station
2. Enter your **destination** station
3. Choose your **route type** (fastest / cheapest / fewest stops)

---

## 🏗️ Project Architecture

```
DMRC-Metro-Navigator/
├── data/
│   └── dmrc_graph.js          # Raw metro network data (223 stations, 11 lines)
├── src/
│   ├── algorithms/
│   │   ├── bfs.js             # Breadth-First Search — fewest stops
│   │   └── dijkstra.js        # Dijkstra's Algorithm — fastest/cheapest
│   ├── graph/
│   │   ├── Graph.js           # Graph wrapper with auto-repair for bidirectional edges
│   │   └── PriorityQueue.js   # Min-priority queue for Dijkstra
│   ├── services/
│   │   └── routeService.js    # Service layer — connects algorithms to CLI
│   ├── utils/
│   │   └── printer.js         # Pretty terminal output formatter
│   ├── cli/
│   │   └── menu.js            # Inquirer-powered interactive menu
│   └── index.js               # Entry point
├── package.json
└── README.md
```

### How it flows:

```
User Input (CLI)
      │
      ▼
   menu.js          ← Inquirer collects source, destination, route type
      │
      ▼
 routeService.js    ← Calls the right algorithm, returns { path, cost, unit }
      │
   ┌──┴──┐
   ▼     ▼
 bfs.js  dijkstra.js   ← Algorithms operate on the Graph
   │       │
   └──┬────┘
      ▼
   Graph.js         ← Wraps raw data, fixes missing reverse edges
      │
      ▼
 dmrc_graph.js      ← Raw adjacency list (223 stations)
      │
      ▼
  printer.js        ← Formats and displays the result
```

---

## 🧠 Algorithm Details

### BFS (Fewest Stops)
- Explores stations **level by level** (1 stop away, then 2, then 3...)
- First time it reaches the destination = guaranteed minimum stops
- Ignores edge weights (time/fare) — treats every hop as equal

### Dijkstra (Fastest / Cheapest)
- Uses a **Priority Queue** to always process the lowest-cost station next
- Accepts a flexible `weightKey` parameter — `"time"` for fastest, `"fare"` for cheapest
- One algorithm, two use cases — no duplicate code

### Graph Auto-Repair
The raw data had a subtle issue: interchange stations (like Rajiv Chowk) listed self-loop edges to represent line switches, but didn't include travel edges for the new line. `Graph.js` scans every edge `A→B` at construction time and ensures `B→A` also exists, making the graph fully bidirectional.

---

## 🗺️ Metro Lines Covered

| Line | Color | Stations |
|------|-------|----------|
| L1 | 🔴 Red Line | Rithala ↔ Shaheed Sthal |
| L2 | 🟡 Yellow Line | Samaypur Badli ↔ HUDA City Centre |
| L3 | 🔵 Blue Line | Dwarka Sector 21 ↔ Noida Electronic City / Vaishali |
| L5 | 🟢 Green Line | Inderlok ↔ Brigadier Hoshiyar Singh |
| L6 | 🟣 Violet Line | Kashmere Gate ↔ Raja Nahar Singh |
| L7 | 🩷 Pink Line | Majlis Park ↔ Shiv Vihar |
| L8 | 🔴 Magenta Line | Botanical Garden ↔ Janakpuri West |
| L9 | ⚪ Grey Line | Dwarka ↔ Dhansa Bus Stand |
| AEL | 🟠 Airport Express | New Delhi ↔ Dwarka Sector 21 |
| RMG | 🔵 Rapid Metro | Sikanderpur ↔ Sector 55-56 |

---

## 📄 License

ISC

---

**Built with ❤️ using Node.js**
