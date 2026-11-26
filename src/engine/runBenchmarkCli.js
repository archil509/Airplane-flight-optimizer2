import { createDefaultGraph, BENCHMARK_PRESETS } from '../data/airports.js';
import { runDijkstraBenchmark } from './benchmark.js';

const graph = createDefaultGraph('global');
const report = runDijkstraBenchmark(graph, BENCHMARK_PRESETS, 50, 'distance');

console.log("=== Dijkstra Flight Route Optimizer — Reproducible JS Benchmark ===");
console.log(
  `Network: ${report.graphStats.airportCount} airports, ${report.graphStats.routeCount} undirected corridors (${report.graphStats.directedEdgeCount} directed edges)`
);
console.log(`Iterations per route: ${report.iterations}\n`);

console.table(
  report.results.map((r) => ({
    Route: r.label,
    'Distance (km)': r.totalDistanceKm,
    Stops: r.stops,
    'Settled Nodes': r.visitedCount,
    Relaxations: r.relaxations,
    'Avg Runtime (ms)': r.avgMs,
    Path: r.path.join(' -> '),
  }))
);
