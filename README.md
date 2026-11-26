# Airplane Flight Optimizer — Dijkstra Shortest-Path Aviation Network Explorer

An end-to-end **Dijkstra-based Flight Route Optimization** system built with a **React + Vite** interactive network visualizer, a **JavaScript Graph Engine** (`MinHeap.js`, `haversine.js`, `Graph.js`, `dijkstra.js`), a **Node.js / Express REST API**, and a portable **C++17 / CMake** performance layer.

## Architecture Overview

- **React Frontend (`src/App.jsx`, `src/components/`)**
  - **Interactive Network Canvas (`VisualizerCanvas.jsx`)**: Renders curved flight corridors, distance tags, step-by-step Dijkstra node settlement playback, airport closure toggles, custom waypoint creation, corridor connection drawing, and edge delay/distance editing.
  - **Route Metrics & Leg Breakdown (`RouteMetrics.jsx`)**: Displays Dijkstra visited/settled nodes, edge relaxations, total distance, modeled objective cost, execution time, and leg-by-leg route details.
  - **Haversine & Trace Inspector (`DijkstraExplainer.jsx`)**: Live $\Delta\phi, \Delta\lambda, a, c, d$ great-circle breakdown ($R = 6,371\text{ km}$) and step-by-step Dijkstra priority-queue trace (`d(v)` cost, relaxed neighbors, and frontier).
  - **Benchmark Suite (`BenchmarkRunner.jsx`)**: Repeatable multi-route Dijkstra benchmark runner across selectable objective modes.
- **JavaScript Graph Engine (`src/engine/`)**
  - `MinHeap.js`, `haversine.js`, `Graph.js`, `dijkstra.js`, `benchmark.js`, `runBenchmarkCli.js`
- **Express REST API (`server/index.js`)**
  - `/api/health`, `/api/network`, `/api/optimize`, `/api/benchmark`, `/api/haversine`, `/api/airports`, `/api/routes`, `/api/reset`
- **C++17 Performance Layer (`cpp/`)**
  - `CMakeLists.txt`, `include/Haversine.hpp`, `include/Graph.hpp`, `src/Graph.cpp`, `src/Dijkstra.cpp`, `src/main.cpp`, `tests/test_engine.cpp`

## Datasets Included

1. **Interactive Visualizer Network (`visualizer`)**: 18-airport, 35-corridor layout for clear step-by-step Dijkstra exploration playback and graph editing.
2. **Global Airport Network (`global`)**: 92 real-world airports with WGS84 coordinates modeled on OpenFlights and 358 undirected flight corridors (716 directed edges).
3. **Academic Sample Graph (`academic`)**: 4-node network (`A, B, C, D`) demonstrating why `A → C → B → D` (500 km, 2 stops) beats `A → B → D` (550 km, 1 stop).

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run automated unit & API integration tests
npm test

# 3. Run the CLI benchmark
npm run benchmark

# 4. Build the React frontend
npm run build

# 5. Start the Express server (serves both API and built frontend on http://localhost:3001)
npm start
```

For development hot-reload with Vite (`http://localhost:5173` proxied to Express on `:3001`):

```bash
npm run server
# in another terminal:
npm run dev
```

## C++17 Build (Requires C++17 compiler & CMake)

```bash
cmake -S cpp -B cpp/build
cmake --build cpp/build
ctest --test-dir cpp/build --output-on-failure
```
