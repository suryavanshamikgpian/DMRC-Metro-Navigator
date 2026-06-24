# DMRC Metro Navigator

A **command-line route planner** for the Delhi Metro network, built with **C++17**. Finds the optimal route between any two stations using graph traversal algorithms — BFS for fewest stops, and Dijkstra's algorithm for fastest or cheapest travel.

> **223 stations** · **11 metro lines** · **3 routing modes**

---

## Features

| Mode | Algorithm | What it optimizes |
|------|-----------|-------------------|
| **Fewest Stops** | BFS (Breadth-First Search) | Minimum number of stations |
| **Fastest Route** | Dijkstra's Algorithm | Minimum travel time (minutes) |
| **Cheapest Route** | Dijkstra's Algorithm | Minimum fare (Rs) |

- **Real DMRC data** — All 11 lines including Red, Yellow, Blue, Green, Violet, Pink, Magenta, Grey, Airport Express & Rapid Metro Gurgaon
- **Interchange handling** — Automatically navigates through interchange stations (Rajiv Chowk, Kashmere Gate, etc.)
- **Auto-repair** — Graph constructor ensures all bidirectional edges exist even when missing from raw data
- **Input validation** — Rejects invalid station names with helpful error messages
- **Interactive CLI** — Loops for multiple searches, asks to search again after each result

---

## Demo

```
  DELHI METRO ROUTE PLANNER
  -----------------------------------
  Total stations: 223

  Enter SOURCE station: Rajiv Chowk
  Enter DESTINATION station: HUDA City Centre

  How do you want to travel?
    1. Fastest Route    (minimum time)
    2. Cheapest Route   (minimum fare)
    3. Fewest Stops     (minimum stops)
  Enter choice (1/2/3): 1

  Route Found -- 42 min (21 stops)
  ---------------------------------------------
  [START] 1. Rajiv Chowk
  |       2. Patel Chowk
  |       3. Central Secretariat
  ...
  |       21. IFFCO Chowk
  [END]   22. HUDA City Centre
  ---------------------------------------------
  Total: 21 stops | 42 min

  Search another route? (y/n):
```

---

## Tech Stack

- **Language:** C++17
- **Compiler:** clang++ / g++ (Apple Clang 17+ recommended)
- **Algorithms:** BFS, Dijkstra's Algorithm
- **Data Structure:** Weighted Adjacency List Graph, STL min-heap Priority Queue
- **Build:** `build.sh` (no dependencies — pure standard library)

---

## Build & Run

```bash
# Clone the repository
git clone https://github.com/suryavanshamikgpian/DMRC-Metro-Navigator.git
cd DMRC-Metro-Navigator

# Build (requires C++17 compiler)
bash build.sh

# Run
./metro
```

### With CMake (optional, requires cmake 3.16+)
```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
./build/metro
```

---

## Project Architecture

```
DMRC-Metro-Navigator/
├── build.sh                        # Build script (no dependencies)
├── CMakeLists.txt                  # Optional CMake build
└── src/
    ├── main.cpp                    # Entry point + interactive CLI loop
    ├── data/
    │   ├── dmrc_data.h             # Edge struct, AdjList type
    │   └── dmrc_data.cpp           # 223 stations, 11 lines (raw data)
    ├── graph/
    │   ├── Graph.h / Graph.cpp     # Graph class with auto-repair
    │   └── PriorityQueue.h         # STL min-heap PQ for Dijkstra
    ├── algorithms/
    │   ├── bfs.h / bfs.cpp         # BFS — fewest stops
    │   └── dijkstra.h / dijkstra.cpp  # Dijkstra — fastest/cheapest
    ├── services/
    │   └── RouteService.h/.cpp     # Service layer — algorithms to CLI
    └── utils/
        └── Printer.h / Printer.cpp # Terminal output formatter
```

### How it flows

```
User Input (stdin)
      |
      v
   main.cpp         <- collects source, destination, route type
      |
      v
 RouteService       <- calls the right algorithm, returns RouteResult
      |
   +--+--+
   v     v
 bfs   dijkstra     <- algorithms operate on the Graph
   |     |
   +--+--+
      v
  Graph.cpp         <- wraps raw data, fixes missing reverse edges
      |
      v
 dmrc_data.cpp      <- raw adjacency list (223 stations)
      |
      v
  Printer.cpp       <- formats and displays the result
```

---

## Algorithm Details

### BFS (Fewest Stops)
- Explores stations **level-by-level** (1 stop away, then 2, then 3...)
- First time it reaches the destination = guaranteed minimum stops
- Ignores edge weights (time/fare) — treats every hop as equal

### Dijkstra (Fastest / Cheapest)
- Uses a **min-heap Priority Queue** (STL `std::priority_queue` with `greater<>`)
- Accepts a `WeightKey` enum — `TIME` for fastest, `FARE` for cheapest
- One function, two use cases — no duplicate code

### Graph Auto-Repair
The raw data has interchange stations that list self-loop edges to represent line switches, but may lack travel edges for the adjacent line. `Graph.cpp` scans every edge `A→B` at construction time and ensures `B→A` also exists on the same line, making the graph fully bidirectional.

---

## Metro Lines Covered

| Line | Color | Stations |
|------|-------|----------|
| L1 | Red Line | Rithala ↔ Shaheed Sthal |
| L2 | Yellow Line | Samaypur Badli ↔ HUDA City Centre |
| L3 | Blue Line | Dwarka Sector 21 ↔ Vaishali |
| L3B | Blue Line Branch | Yamuna Bank ↔ Noida Electronic City |
| L5 | Green Line | Inderlok ↔ Brigadier Hoshiyar Singh |
| L6 | Violet Line | Kashmere Gate ↔ Raja Nahar Singh |
| L7 | Pink Line | Majlis Park ↔ Shiv Vihar |
| L8 | Magenta Line | Janakpuri West ↔ Botanical Garden |
| L9 | Grey Line | Dwarka ↔ Dhansa Bus Stand |
| AEL | Airport Express | New Delhi ↔ Dwarka Sector 21 |
| RMG | Rapid Metro Gurgaon | Sikanderpur ↔ Phase 1 |

---

## License

ISC

---

**Built with C++17**
