import { runDijkstra } from './dijkstra.js';
import { OBJECTIVE_MODES } from './Graph.js';

/**
 * Runs a repeatable multi-route Dijkstra benchmark suite over N iterations (with warm-up)
 * to measure average execution time, visited node counts, and edge relaxations.
 */
export function runDijkstraBenchmark(
  graph,
  routes,
  iterations = 25,
  objective = OBJECTIVE_MODES.DISTANCE
) {
  const results = [];

  for (const item of routes) {
    const { label, source, target } = item;

    // Warm up JIT
    runDijkstra(graph, source, target, { objective, recordSteps: false });

    let totalMs = 0;
    let lastResult = null;

    for (let i = 0; i < iterations; i++) {
      lastResult = runDijkstra(graph, source, target, { objective, recordSteps: false });
      totalMs += lastResult.executionTimeMs;
    }

    const avgMs = Math.round((totalMs / iterations) * 1000) / 1000;

    results.push({
      label: label || `${source} → ${target}`,
      source,
      target,
      found: lastResult.found,
      path: lastResult.path,
      totalCost: lastResult.totalCost,
      totalDistanceKm: lastResult.totalDistanceKm,
      stops: lastResult.stops,
      visitedCount: lastResult.visitedCount,
      relaxations: lastResult.relaxations,
      avgMs,
    });
  }

  return {
    algorithm: 'dijkstra',
    iterations,
    objective,
    graphStats: graph.getStats(),
    timestamp: new Date().toISOString(),
    results,
  };
}
