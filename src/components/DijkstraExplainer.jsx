import React, { useMemo } from 'react';
import { Compass, Cpu } from 'lucide-react';
import { haversineDetailed } from '../engine/haversine.js';

export function DijkstraExplainer({
  airportsById,
  sourceId,
  targetId,
  result,
  playbackStep,
}) {
  const sourceAirport = airportsById.get(sourceId);
  const targetAirport = airportsById.get(targetId);

  const haversineInfo = useMemo(() => {
    if (!sourceAirport || !targetAirport) return null;
    try {
      return haversineDetailed(
        sourceAirport.lat,
        sourceAirport.lon,
        targetAirport.lat,
        targetAirport.lon
      );
    } catch {
      return null;
    }
  }, [sourceAirport, targetAirport]);

  const steps = result?.steps || [];
  const visibleLimit =
    typeof playbackStep === 'number' && playbackStep >= 0
      ? playbackStep
      : steps.length;

  return (
    <div className="metrics-grid">
      {/* Great-Circle Reference */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Compass size={15} color="#0284c7" />
            Haversine Great-Circle Reference ({sourceId} &rarr; {targetId})
          </h3>
        </div>
        {haversineInfo ? (
          <div className="formula-box">
            <div>a = sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)</div>
            <div>c = 2 · atan2(√a, √(1 − a))</div>
            <div>d = R · c &nbsp;&nbsp;(R = {haversineInfo.radiusKm} km)</div>
            <hr style={{ borderColor: 'rgba(148,163,184,0.16)', margin: '0.5rem 0' }} />
            <div>φ₁ = {haversineInfo.phi1.toFixed(5)} rad &nbsp;|&nbsp; φ₂ = {haversineInfo.phi2.toFixed(5)} rad</div>
            <div>Δφ = {haversineInfo.deltaPhi.toFixed(5)} rad &nbsp;|&nbsp; Δλ = {haversineInfo.deltaLambda.toFixed(5)} rad</div>
            <div>a  = {haversineInfo.a.toFixed(6)} &nbsp;|&nbsp; c = {haversineInfo.c.toFixed(6)} rad</div>
            <div style={{ color: '#0369a1', fontWeight: 700, marginTop: '0.35rem' }}>
              Direct Great-Circle Span = {haversineInfo.distanceKm.toFixed(2)} km
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            Select valid airports to inspect the Haversine great-circle reference.
          </p>
        )}
      </div>

      {/* Step-by-Step Dijkstra Priority Queue Trace */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Cpu size={15} color="#7c3aed" />
            Dijkstra Settlement Trace (min d(v))
          </h3>
        </div>
        <div className="data-table-wrap" style={{ maxHeight: 245, overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Settled</th>
                <th>d(v) Cost</th>
                <th>Relaxed Neighbors</th>
                <th>Frontier</th>
              </tr>
            </thead>
            <tbody>
              {steps.slice(0, Math.max(1, visibleLimit)).map((st) => (
                <tr key={st.step}>
                  <td className="mono">{st.step}</td>
                  <td className="mono" style={{ fontWeight: 700, color: '#6d28d9' }}>
                    {st.current}
                  </td>
                  <td className="mono" style={{ color: '#047857', fontWeight: 600 }}>
                    {st.cost.toLocaleString()}
                  </td>
                  <td className="mono" style={{ fontSize: '0.72rem' }}>
                    {st.updatedNeighbors && st.updatedNeighbors.length > 0
                      ? st.updatedNeighbors.map((n) => `${n.to}:${n.newCost}`).join(', ')
                      : '—'}
                  </td>
                  <td className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {st.frontier ? st.frontier.length : 0}
                  </td>
                </tr>
              ))}
              {steps.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: 'var(--text-secondary)' }}>
                    Select an origin and destination to inspect Dijkstra settlement steps.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
