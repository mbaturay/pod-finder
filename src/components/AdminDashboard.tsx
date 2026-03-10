import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import type { SubmissionRecord, Region } from '../types';
import { loadSubmissions, deleteSubmission } from '../utils/storage';
import { loadSeedData, clearAllSubmissions } from '../utils/seedData';
import { PODS, POD_IDS } from '../config/pods';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(loadSubmissions);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region | ''>('');
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const nameMatch = `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const regionMatch = !regionFilter || s.region === regionFilter;
      return nameMatch && regionMatch;
    });
  }, [submissions, search, regionFilter]);

  const viewing = viewingId ? submissions.find((s) => s.id === viewingId) : null;

  const handleDelete = (id: string) => {
    deleteSubmission(id);
    setSubmissions(loadSubmissions());
    setDeletingId(null);
    if (viewingId === id) setViewingId(null);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Region', 'Primary Pod', 'Score', 'Date'];
    const rows = filtered.map((s) => [
      `${s.firstName} ${s.lastName}`,
      s.region,
      s.computed.winningPodName,
      s.computed.finalScore.toFixed(2),
      new Date(s.createdAt).toLocaleString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pod-finder-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {submissions.length} total submission{submissions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {submissions.length === 0 && (
              <Button
                variant="secondary"
                onClick={() => {
                  const count = loadSeedData();
                  if (count > 0) setSubmissions(loadSubmissions());
                }}
              >
                Load Demo Data
              </Button>
            )}
            {submissions.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (confirm('Clear all submissions? This cannot be undone.')) {
                    clearAllSubmissions();
                    setSubmissions([]);
                  }
                }}
              >
                Clear All
              </Button>
            )}
            <Button variant="secondary" onClick={() => { window.location.href = '/admin/analytics'; }}>
              Analytics
            </Button>
            <Button variant="secondary" onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                sessionStorage.removeItem('podFinder_isAdmin');
                onLogout();
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="flex-1 px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value as Region | '')}
            className="px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">All Regions</option>
            <option value="East">East</option>
            <option value="Central">Central</option>
            <option value="West">West</option>
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-muted-foreground">
              {submissions.length === 0
                ? 'No submissions yet.'
                : 'No submissions match your filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Region</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Primary Pod</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => (
                  <tr key={sub.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {sub.firstName} {sub.lastName}
                    </td>
                    <td className="px-4 py-3 text-foreground">{sub.region}</td>
                    <td className="px-4 py-3 text-foreground">{sub.computed.winningPodName}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {sub.computed.finalScore.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setViewingId(sub.id)}
                        className="text-primary hover:underline text-xs font-medium mr-3"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(sub.id)}
                        className="text-destructive hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {deletingId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-4"
              onClick={() => setDeletingId(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="card max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-foreground mb-2">Confirm Delete</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  This will permanently remove this submission. This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setDeletingId(null)}>
                    Cancel
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(deletingId)}
                    className="btn bg-destructive text-primary-foreground hover:opacity-90 active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Detail Modal */}
        <AnimatePresence>
          {viewing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-4 overflow-y-auto"
              onClick={() => setViewingId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground">
                    {viewing.firstName} {viewing.lastName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setViewingId(null)}
                    className="text-muted-foreground hover:text-foreground text-xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-5 text-sm">
                  {/* Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Region</span>
                      <p className="font-medium text-foreground">{viewing.region}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted</span>
                      <p className="font-medium text-foreground">
                        {new Date(viewing.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Match */}
                  <div className="bg-primary-soft border border-primary-border rounded-lg p-4">
                    <div className="text-muted-foreground text-xs mb-1">Primary Match</div>
                    <div className="font-bold text-foreground text-lg">{viewing.computed.winningPodName}</div>
                    <div className="text-muted-foreground">{viewing.computed.winningAreaName}</div>
                    {viewing.computed.secondaryPodName && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Secondary: </span>
                        <span className="font-medium text-foreground">{viewing.computed.secondaryPodName}</span>
                      </div>
                    )}
                  </div>

                  {/* Interest Ratings */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Interest Ratings</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {POD_IDS.map((podId) => (
                        <div key={podId} className="flex justify-between bg-muted rounded px-3 py-2">
                          <span>{PODS[podId].areaName}</span>
                          <span className="font-bold">{viewing.answers.topLevelInterest[podId] ?? '—'}/5</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priorities */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Priorities</h4>
                    <div className="flex gap-3">
                      <span className="bg-primary-soft border border-primary-border rounded px-3 py-1">
                        1st: {viewing.answers.firstChoice ? PODS[viewing.answers.firstChoice].areaName : '—'}
                      </span>
                      <span className="bg-muted border border-border rounded px-3 py-1">
                        2nd: {viewing.answers.secondChoice ? PODS[viewing.answers.secondChoice].areaName : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Growth */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Growth Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {viewing.answers.growth.focusAreas.map((a) => (
                        <span key={a} className="bg-primary-soft text-foreground text-xs px-2 py-1 rounded-md">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Full Score Breakdown */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Score Breakdown</h4>
                    <div className="space-y-2">
                      {[...viewing.computed.areaScores]
                        .sort((a, b) => b.finalScore - a.finalScore)
                        .map((score) => {
                          const isWinner = score.podId === viewing.computed.winningAreaId;
                          return (
                            <div
                              key={score.podId}
                              className={`p-3 rounded-lg border ${
                                isWinner ? 'border-primary bg-primary-soft' : 'border-border bg-muted'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-foreground">
                                  {score.areaName}
                                  {isWinner && (
                                    <span className="ml-2 text-xs bg-cta text-primary-foreground px-2 py-0.5 rounded-full">
                                      Winner
                                    </span>
                                  )}
                                </span>
                                <span className="font-bold text-foreground">{score.finalScore.toFixed(2)}</span>
                              </div>
                              <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                                <span>Base: {score.baseScore.toFixed(1)}</span>
                                <span>Detail: {score.detailScore.toFixed(1)}</span>
                                <span>Priority: +{score.priorityBonus.toFixed(1)}</span>
                                <span>Growth: +{score.growthBonus.toFixed(2)}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-right">
                  <Button variant="secondary" onClick={() => setViewingId(null)}>
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
