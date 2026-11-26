import React, { useState } from 'react';
import { Gauge, Play } from 'lucide-react';

export function BenchmarkRunner({ onRunBenchmark, benchmarkReport, loading }) {
  const [iterations, setIterations] = useState(50);

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">
            <Gauge size={16} color="#7c3aed" />
            Reproducible Dijkstra Benchmark Suite
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Measures settled nodes, edge relaxations, and averaged runtime over repeated iterations on the active network.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="field-label" htmlFor="bench-iters" style={{ margin: 0 }}>
            Iterations
          </label>
          <input
            id="bench-iters"
            type="number"
            min={5}
            max={200}
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value) || 25)}
            className="text-input mono"
            style={{ width: 78 }}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onRunBenchmark(iterations)}
            disabled={loading}
          >
            <Play size={13} />
            {loading ? 'Running...' : 'Run Benchmark'}
          </button>
        </div>
      </div>

      {benchmarkReport ? (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Optimal Distance</th>
                <th>Stops</th>
                <th>Settled Nodes</th>
                <th>Relaxations</th>
                <th>Avg Runtime</th>
                <th>Optimal Path</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkReport.results.map((row) => (
                <tr key={row.label}>
                  <td style={{ fontWeight: 600 }}>{row.label}</td>
                  <td className="mono">{row.totalDistanceKm.toLocaleString()} km</td>
                  <td className="mono">{row.stops}</td>
                  <td className="mono" style={{ color: '#6d28d9', fontWeight: 600 }}>{row.visitedCount}</td>
                  <td className="mono">{row.relaxations}</td>
                  <td className="mono">{row.avgMs.toFixed(3)} ms</td>
                  <td className="mono" style={{ fontSize: '0.72rem' }}>
                    {row.path ? row.path.join(' → ') : '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert-banner info">
          <span>
            Click <strong>Run Benchmark</strong> to execute live Dijkstra measurements across preset routes on the active graph.
          </span>
        </div>
      )}
    </div>
  );
}
