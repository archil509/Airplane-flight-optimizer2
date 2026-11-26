import React from 'react';
import { BarChart3, AlertTriangle, CheckCircle2, Clock, Route } from 'lucide-react';
import { OBJECTIVE_MODES } from '../engine/Graph.js';

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins}m`;
}

export function RouteMetrics({
  result,
  sourceId,
  targetId,
  objective,
  airportsById,
  totalAirports,
}) {
  if (!result) return null;

  if (!result.found) {
    return (
      <div className="panel">
        <div className="alert-banner error">
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>No Reachable Route Found:</strong>{' '}
            {result.error || 'Origin and destination are disconnected in the active graph.'}
          </div>
        </div>
      </div>
    );
  }

  const graphSize = Math.max(1, totalAirports || result.visitedCount);
  const exploredPct = Math.min(100, Math.round((result.visitedCount / graphSize) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">
            <BarChart3 size={16} color="#7c3aed" />
            Dijkstra Shortest-Path Summary ({sourceId} &rarr; {targetId})
          </h2>
          <span className="pill-badge" style={{ color: '#047857', borderColor: 'rgba(5, 150, 105, 0.35)' }}>
            <CheckCircle2 size={13} />
            Global Optimum Guaranteed (Cost: {result.totalCost.toLocaleString()})
          </span>
        </div>

        <div className="metrics-grid">
          {/* Dijkstra Execution Card */}
          <div className="algo-card dijkstra">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#6d28d9', fontSize: '0.9rem' }}>Dijkstra&apos;s Algorithm</strong>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Priority: min d(v)
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Settled Nodes</span>
              <span className="stat-value">{result.visitedCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Edge Relaxations</span>
              <span className="stat-value">{result.relaxations}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total Distance</span>
              <span className="stat-value">{result.totalDistanceKm.toLocaleString()} km</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Modeled Cost</span>
              <span className="stat-value">{result.totalCost.toLocaleString()}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Execution Time</span>
              <span className="stat-value">{result.executionTimeMs.toFixed(3)} ms</span>
            </div>
            <div style={{ marginTop: '0.55rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                <span>Network Coverage</span>
                <span className="mono">
                  {result.visitedCount}/{graphSize} nodes ({exploredPct}%)
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${exploredPct}%`, background: 'var(--accent-violet)' }}
                />
              </div>
            </div>
          </div>

          {/* Optimal Route Summary Card */}
          <div className="algo-card winner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#047857', fontSize: '0.9rem' }}>Optimal Flight Route</strong>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {result.stops} {result.stops === 1 ? 'stop' : 'stops'}
              </span>
            </div>
            <div
              className="mono"
              style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                padding: '0.45rem 0.55rem',
                borderRadius: 7,
                background: '#ffffff',
                border: '1px solid var(--border-soft)',
                marginBottom: '0.55rem',
                wordBreak: 'break-word',
              }}
            >
              {result.path.join(' → ')}
            </div>
            <div className="stat-row">
              <span className="stat-label">Est. Flight + Delay</span>
              <span className="stat-value">
                <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {formatDuration(result.totalFlightTimeMin)}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Active Delays</span>
              <span className="stat-value" style={{ color: result.totalDelayMin > 0 ? '#b45309' : 'inherit' }}>
                {result.totalDelayMin} min
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Active Objective</span>
              <span className="stat-value mono">{objective}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leg-by-leg Breakdown */}
      {result.legs.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Route size={15} color="#059669" />
              Leg-by-Leg Route Breakdown
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Objective: <strong className="mono">{objective}</strong>
            </span>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Leg</th>
                  <th>Segment</th>
                  <th>Origin &rarr; Destination</th>
                  <th>Distance</th>
                  <th>Flight Time</th>
                  <th>Delay</th>
                  <th>Freq/day</th>
                  <th>Edge Weight</th>
                </tr>
              </thead>
              <tbody>
                {result.legs.map((leg, idx) => {
                  const fromAirport = airportsById.get(leg.from);
                  const toAirport = airportsById.get(leg.to);
                  return (
                    <tr key={`${leg.from}-${leg.to}-${idx}`}>
                      <td className="mono">#{idx + 1}</td>
                      <td className="mono" style={{ fontWeight: 600, color: '#6d28d9' }}>
                        {leg.from} &rarr; {leg.to}
                      </td>
                      <td>
                        {fromAirport?.city || leg.from} &rarr; {toAirport?.city || leg.to}
                      </td>
                      <td className="mono">{leg.distanceKm.toLocaleString()} km</td>
                      <td className="mono">{formatDuration(leg.flightTimeMin)}</td>
                      <td className="mono" style={{ color: leg.delayMin > 0 ? '#b45309' : 'var(--text-secondary)' }}>
                        {leg.delayMin > 0 ? `+${leg.delayMin} min` : '0 min'}
                      </td>
                      <td className="mono">{leg.frequencyPerDay}/day</td>
                      <td className="mono" style={{ fontWeight: 600 }}>
                        {leg.weight.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interpretability Note */}
      <div className="alert-banner info">
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Dijkstra Optimality Guarantee:</strong> Because all corridor weights in{' '}
          <span className="mono">{objective}</span> mode (
          {objective === OBJECTIVE_MODES.STOPS
            ? '1 per flight leg'
            : objective === OBJECTIVE_MODES.PENALTY
            ? 'distance + delay & frequency penalties'
            : 'corridor distance in km'}
          ) are non-negative, Dijkstra&apos;s greedy settlement order guarantees the exact minimum-cost path without requiring any heuristic estimate.
        </div>
      </div>
    </div>
  );
}
