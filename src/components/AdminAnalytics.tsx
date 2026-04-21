import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer,
} from 'recharts';
import { Button } from './Button';
import type { SubmissionRecord, Region } from '../types';
import { loadSubmissions } from '../utils/storage';
import { PODS, POD_IDS } from '../config/pods';
import { GROWTH_FOCUS_OPTIONS } from '../config/pods';
import {
  groupCounts, timeSeriesCounts, median, average,
  filterByDateRange, filterByRegion,
} from '../utils/analytics';

interface AdminAnalyticsProps {
  onLogout: () => void;
}

const POD_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];
const DATE_RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
];

export function AdminAnalytics({ onLogout }: AdminAnalyticsProps) {
  const [allSubmissions, setAllSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [regionFilter, setRegionFilter] = useState<Region | ''>('');
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await loadSubmissions();
        if (!cancelled) setAllSubmissions(rows);
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let subs = filterByRegion(allSubmissions, regionFilter);
    subs = filterByDateRange(subs, dateRange);
    return subs;
  }, [allSubmissions, regionFilter, dateRange]);

  // --- Stat cards ---
  const totalCount = filtered.length;
  const multiFitCount = filtered.filter((s) => s.computed.isMultiFit).length;
  const multiFitRate = totalCount > 0 ? (multiFitCount / totalCount) * 100 : 0;

  const durations = filtered
    .map((s) => s.computed.durationMinutes)
    .filter((d): d is number => d != null && d > 0);
  const avgDuration = average(durations);
  const medDuration = median(durations);

  // --- Chart A: Assignments by Pod ---
  const podCounts = groupCounts(filtered, (s) => s.computed.winningPodName);
  const podChartData = POD_IDS.map((id, i) => ({
    name: PODS[id].podName,
    count: podCounts[PODS[id].podName] || 0,
    fill: POD_COLORS[i],
  }));

  // --- Chart B: Assignments by Region (stacked) ---
  const regionPodData = useMemo(() => {
    const regions: Region[] = ['East', 'Central', 'West'];
    return regions.map((region) => {
      const regionSubs = filtered.filter((s) => s.region === region);
      const entry: Record<string, string | number> = { region };
      for (const id of POD_IDS) {
        const podName = PODS[id].podName;
        entry[podName] = regionSubs.filter((s) => s.computed.winningPodName === podName).length;
      }
      return entry;
    });
  }, [filtered]);

  // --- Chart C: Submissions over time ---
  const timeData = useMemo(
    () => timeSeriesCounts(filtered, dateRange),
    [filtered, dateRange]
  );

  // --- Chart D: Growth Focus Popularity ---
  const growthCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of filtered) {
      for (const area of s.answers.growth.focusAreas) {
        counts[area] = (counts[area] || 0) + 1;
      }
    }
    return GROWTH_FOCUS_OPTIONS.map((area) => ({
      name: area,
      count: counts[area] || 0,
    })).sort((a, b) => b.count - a.count);
  }, [filtered]);

  // --- Chart E: Priority Picks Distribution ---
  const priorityData = useMemo(() => {
    const first: Record<string, number> = {};
    const second: Record<string, number> = {};
    for (const s of filtered) {
      if (s.answers.firstChoice) {
        const name = PODS[s.answers.firstChoice].podName;
        first[name] = (first[name] || 0) + 1;
      }
      if (s.answers.secondChoice) {
        const name = PODS[s.answers.secondChoice].podName;
        second[name] = (second[name] || 0) + 1;
      }
    }
    return POD_IDS.map((id) => {
      const name = PODS[id].podName;
      return { name, '1st Choice': first[name] || 0, '2nd Choice': second[name] || 0 };
    });
  }, [filtered]);

  // Loading / error / empty states
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <TopBar onLogout={onLogout} />
          <div className="card text-center py-16">
            <p className="text-muted-foreground text-lg">Loading analytics…</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <TopBar onLogout={onLogout} />
          <div className="card text-center py-16">
            <p className="text-destructive font-medium">
              Couldn't load analytics. Please refresh the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (allSubmissions.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <TopBar onLogout={onLogout} />
          <div className="card text-center py-16">
            <p className="text-muted-foreground text-lg">
              No submissions yet. Once people complete the survey, analytics will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <TopBar onLogout={onLogout} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

          <div className="flex gap-2">
            {DATE_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDateRange(opt.value)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  dateRange === opt.value
                    ? 'border-primary bg-primary-soft text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Submissions" value={String(totalCount)} />
          <StatCard label="Multi-fit Rate" value={`${multiFitRate.toFixed(1)}%`} />
          <StatCard
            label="Avg Completion"
            value={durations.length > 0 ? `${avgDuration.toFixed(1)} min` : '—'}
          />
          <StatCard
            label="Median Completion"
            value={durations.length > 0 ? `${medDuration.toFixed(1)} min` : '—'}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A: Assignments by Pod */}
          <ChartCard title="Assignments by Pod">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={podChartData} margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* B: Assignments by Region */}
          <ChartCard title="Assignments by Region">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={regionPodData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="region" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {POD_IDS.map((id, i) => (
                  <Bar key={id} dataKey={PODS[id].podName} stackId="a" fill={POD_COLORS[i]} radius={i === POD_IDS.length - 1 ? [4, 4, 0, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* C: Submissions Over Time */}
          <ChartCard title={`Submissions — Last ${dateRange} Days`}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={timeData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  interval={dateRange <= 14 ? 0 : 'preserveStartEnd'}
                />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* D: Growth Focus Popularity */}
          <ChartCard title="Growth Focus Popularity">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={growthCounts} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  width={95}
                />
                <Tooltip
                  contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* E: Priority Picks Distribution */}
          <ChartCard title="Priority Picks Distribution" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={priorityData} margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="1st Choice" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2nd Choice" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of submissions and trends
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => { window.location.href = '/admin'; }}>
          Dashboard
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
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card ${className}`}>
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}
