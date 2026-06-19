import { useState, useMemo } from 'react';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Head from 'next/head';

// ─── Small reusable components ───────────────────────────────────────────────

function parseAvatar(avatarUrl) {
  if (!avatarUrl) return { type: 'initial' };
  try {
    const p = JSON.parse(avatarUrl);
    if (p.emoji) return { type: 'emoji', emoji: p.emoji, color: p.colors?.[0] || '#1A2A3A' };
  } catch {}
  if (avatarUrl.startsWith('http')) return { type: 'image', url: avatarUrl };
  return { type: 'initial' };
}

function AvatarCell({ avatarUrl, username }) {
  const av = parseAvatar(avatarUrl);
  const base = { width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 };
  if (av.type === 'emoji') return <div style={{ ...base, backgroundColor: av.color + '33', border: `1.5px solid ${av.color}44` }}>{av.emoji}</div>;
  if (av.type === 'image') return <img src={av.url} alt="" style={{ ...base, objectFit: 'cover' }} />;
  return <div style={{ ...base, backgroundColor: '#1E233C', color: '#A0AEC0', fontSize: 13, fontWeight: 700 }}>{(username || '?')[0].toUpperCase()}</div>;
}

function StatCard({ label, value, color = '#00C2A8', icon, sub }) {
  return (
    <div style={{ backgroundColor: '#111422', border: '1.5px solid #1A1D2E', borderRadius: 16, padding: '20px 24px', flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 600, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#55627E', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// Simple SVG bar chart for daily activity
function ActivityChart({ data, color = '#00C2A8', unit = 'game' }) {
  const [hovered, setHovered] = useState(null);
  if (!data || data.length === 0) return <div style={{ color: '#55627E', fontSize: 13, padding: 16 }}>No data yet.</div>;
  const max = Math.max(...data.map(d => d.count), 1);
  // TT_H = space reserved above bars for the tooltip bubble
  const W = 560, H = 80, TT_H = 44, barW = Math.floor((W - data.length * 4) / data.length);
  const dimColor = color + '33';
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${TT_H + H + 24}`} style={{ width: '100%', maxWidth: W }}>
        {data.map((d, i) => {
          const barH = Math.max(4, Math.round((d.count / max) * H));
          const x = i * (barW + 4);
          const barY = TT_H + H - barH;
          const isToday = i === data.length - 1;
          const isHov = hovered === i;
          // Tooltip box: centered above bar, clamped to SVG edges
          const ttW = 86, ttH = 36, cx = x + barW / 2;
          const ttX = Math.max(0, Math.min(cx - ttW / 2, W - ttW));
          const ttY = TT_H - ttH - 4;
          const dateLabel = new Date(d.day + 'T12:00:00').toLocaleDateString('el-GR', { day: 'numeric', month: 'short' });
          return (
            <g key={d.day} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'default' }}>
              {/* Full-height invisible hit area so hover works on empty space above short bars */}
              <rect x={x} y={TT_H} width={barW} height={H} fill="transparent" />
              {/* The bar itself */}
              <rect x={x} y={barY} width={barW} height={barH} rx={3} fill={isHov || isToday ? color : dimColor} />
              {/* Tooltip — only rendered for the hovered bar */}
              {isHov && (
                <g>
                  <rect x={ttX} y={ttY} width={ttW} height={ttH} rx={6} fill="#1A1D2E" stroke={color} strokeWidth={1.2} />
                  <text x={ttX + ttW / 2} y={ttY + 14} textAnchor="middle" fontSize={12} fontWeight="800" fill={color}>
                    {d.count} {unit}{d.count !== 1 ? 's' : ''}
                  </text>
                  <text x={ttX + ttW / 2} y={ttY + 28} textAnchor="middle" fontSize={10} fill="#A0AEC0">
                    {dateLabel}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        {/* x-axis labels — first, middle, last */}
        {[0, Math.floor(data.length / 2), data.length - 1].map(i => {
          const d = data[i];
          if (!d) return null;
          const x = i * (barW + 4) + barW / 2;
          const label = new Date(d.day + 'T12:00:00').toLocaleDateString('el-GR', { day: 'numeric', month: 'short' });
          return <text key={i} x={x} y={TT_H + H + 18} textAnchor="middle" fontSize={10} fill="#55627E">{label}</text>;
        })}
      </svg>
    </div>
  );
}

// Horizontal progress bar row
function BarRow({ label, value, total, color = '#00C2A8' }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: '#A0AEC0', fontWeight: 600 }}>{label}</span>
        <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{value.toLocaleString()} <span style={{ color: '#55627E' }}>({pct}%)</span></span>
      </div>
      <div style={{ height: 6, backgroundColor: '#1A1D2E', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard({ users, stats, gameAnalytics }) {
  const router = useRouter();
  const { signOut } = useClerk();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [recipients, setRecipients] = useState('push');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const PAGE_SIZE = 20;

  const filtered = useMemo(() => {
    let list = users;
    if (filter === 'push') list = list.filter(u => u.notifications_enabled && u.push_token);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u => (u.username || '').toLowerCase().includes(q) || (u.legacy_email || '').toLowerCase().includes(q));
    }
    return list;
  }, [users, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  // Reset to page 0 when search or filter changes
  const handleSearch = (val) => { setSearch(val); setPage(0); };
  const handleFilter = (val) => { setFilter(val); setPage(0); };

  const recipientCount = useMemo(() => {
    if (recipients === 'selected') return selectedIds.size;
    return stats.pushEnabled;
  }, [recipients, selectedIds, stats]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleSend = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) { setSendResult({ ok: false, message: 'Title and message are required.' }); return; }
    setSending(true); setSendResult(null);
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: notifTitle.trim(), body: notifBody.trim(), recipients, userIds: recipients === 'selected' ? Array.from(selectedIds) : null }),
      });
      const data = await res.json();
      setSendResult({ ok: res.ok, message: data.message || (res.ok ? 'Sent!' : 'Error') });
      if (res.ok) { setNotifTitle(''); setNotifBody(''); setSelectedIds(new Set()); }
    } catch (e) { setSendResult({ ok: false, message: e.message }); }
    finally { setSending(false); }
  };

  const handleSignOut = () => signOut(() => router.push('/'));

  const ga = gameAnalytics;

  return (
    <>
      <Head>
        <title>ZOPRA Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#0B0E17', color: '#FFFFFF', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

        {/* Header */}
        <div style={{ borderBottom: '1.5px solid #1A1D2E', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0E111E' }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#FF4D4D', letterSpacing: 5 }}>ZOPRA</span>
            <span style={{ fontSize: 13, color: '#A0AEC0', fontWeight: 600, marginLeft: 14 }}>Admin Panel</span>
          </div>
          <button onClick={handleSignOut} style={{ background: 'transparent', border: '1.5px solid #1A1D2E', color: '#A0AEC0', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            Sign Out
          </button>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

          {/* ── User Stats ────────────────────────────────────────────── */}
          <div style={sectionLabel}>👥 Users</div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="#FFFFFF" />
            <StatCard icon="📅" label="New Today" value={stats.newToday} color="#00C2A8" />
            <StatCard icon="📆" label="New This Week" value={stats.newWeek} color="#00C2A8" />
            <StatCard icon="🔔" label="Push Subscribers" value={stats.pushEnabled} sub={`${Math.round(stats.pushEnabled / Math.max(stats.totalUsers, 1) * 100)}% opt-in rate`} color="#48BB78" />
          </div>
          <div style={{ ...card, marginBottom: 40 }}>
            <div style={cardTitle}>📈 New Registrations (last 14 days)</div>
            <ActivityChart data={stats.dailyUsers} color="#C084FC" unit="user" />
          </div>

          {/* ── Game Analytics ────────────────────────────────────────── */}
          <div style={sectionLabel}>🎮 Game Analytics</div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <StatCard icon="🎮" label="Games Finished" value={ga.totalGames.toLocaleString()} color="#FFFFFF" />
            <StatCard icon="🔄" label="Rounds Played" value={ga.totalRounds.toLocaleString()} color="#00C2A8" sub={`avg ${ga.avgRoundsPerGame} rounds/game`} />
            <StatCard icon="✍️" label="Total Answers" value={ga.totalAnswers.toLocaleString()} color="#F6AD55" />
            <StatCard icon="✅" label="Valid Words" value={ga.validAnswers.toLocaleString()} color="#48BB78" sub={`${ga.validRate}% acceptance rate`} />
            <StatCard icon="👤" label="Avg Players/Game" value={ga.avgPlayersPerGame} color="#C084FC" />
          </div>

          {/* Activity + Letters grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>

            {/* Daily activity chart */}
            <div style={card}>
              <div style={cardTitle}>📈 Games per Day (last 14 days)</div>
              <ActivityChart data={ga.dailyGames} color="#00C2A8" unit="game" />
            </div>

            {/* Letter popularity */}
            <div style={card}>
              <div style={cardTitle}>🔤 Most Used Letters</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {ga.topLetters.map(({ letter, count }, i) => (
                  <div key={letter} style={{
                    padding: '8px 14px', borderRadius: 10, fontWeight: 900, fontSize: 15,
                    backgroundColor: i === 0 ? '#00C2A820' : '#1A1D2E',
                    border: `1.5px solid ${i === 0 ? '#00C2A8' : '#2D3748'}`,
                    color: i === 0 ? '#00C2A8' : '#FFFFFF',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {letter}
                    <span style={{ fontSize: 10, color: '#A0AEC0', fontWeight: 600 }}>{count}</span>
                  </div>
                ))}
                {ga.topLetters.length === 0 && <span style={{ color: '#55627E', fontSize: 13 }}>No rounds yet.</span>}
              </div>
            </div>

            {/* User engagement breakdown */}
            <div style={card}>
              <div style={cardTitle}>📊 User Engagement</div>
              <div style={{ marginTop: 8 }}>
                <BarRow label="Never played" value={ga.engagement.neverPlayed} total={stats.totalUsers} color="#55627E" />
                <BarRow label="Casual (1–5 games)" value={ga.engagement.casual} total={stats.totalUsers} color="#4299E1" />
                <BarRow label="Regular (6–20 games)" value={ga.engagement.regular} total={stats.totalUsers} color="#00C2A8" />
                <BarRow label="Power users (20+ games)" value={ga.engagement.power} total={stats.totalUsers} color="#F6AD55" />
              </div>
            </div>

            {/* Top 5 players */}
            <div style={card}>
              <div style={cardTitle}>🏆 Top 5 Players by Score</div>
              <div style={{ marginTop: 8 }}>
                {ga.topPlayers.map((u, i) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 4 ? '1px solid #1A1D2E' : 'none' }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: i === 0 ? '#F6AD55' : i === 1 ? '#A0AEC0' : i === 2 ? '#CD7F32' : '#55627E', width: 20 }}>#{i + 1}</span>
                    <AvatarCell avatarUrl={u.avatar_url} username={u.username} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{u.username}</div>
                      <div style={{ fontSize: 11, color: '#55627E' }}>{u.games_played} games · {u.wins} wins</div>
                    </div>
                    <span style={{ color: '#00C2A8', fontWeight: 900, fontSize: 14 }}>{(u.total_score || 0).toLocaleString()} ✦</span>
                  </div>
                ))}
                {ga.topPlayers.length === 0 && <span style={{ color: '#55627E', fontSize: 13 }}>No players yet.</span>}
              </div>
            </div>

          </div>

          {/* ── Users Table ───────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>All Users</h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search by username or email…"
                  style={{ background: '#111422', border: '1.5px solid #1A1D2E', borderRadius: 10, padding: '8px 14px', color: '#FFFFFF', fontSize: 13, width: 240, outline: 'none' }} />
                {['all', 'push'].map(f => (
                  <button key={f} onClick={() => handleFilter(f)} style={{
                    background: filter === f ? '#00C2A8' : '#111422', color: filter === f ? '#0B0E17' : '#A0AEC0',
                    border: '1.5px solid ' + (filter === f ? '#00C2A8' : '#1A1D2E'),
                    borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
                  }}>
                    {f === 'all' ? `All (${stats.totalUsers})` : `Push (${stats.pushEnabled})`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#111422', border: '1.5px solid #1A1D2E', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0E111E', color: '#A0AEC0', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                      {recipients === 'selected' && <th style={th}></th>}
                      <th style={th}>#</th>
                      <th style={th}>User</th>
                      <th style={th}>Email</th>
                      <th style={{ ...th, textAlign: 'center' }}>Games</th>
                      <th style={{ ...th, textAlign: 'center' }}>Wins</th>
                      <th style={{ ...th, textAlign: 'center' }}>Score</th>
                      <th style={{ ...th, textAlign: 'center' }}>Push</th>
                      <th style={th}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0
                      ? <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#A0AEC0' }}>No users found.</td></tr>
                      : paginated.map((u, i) => (
                        <tr key={u.id} onClick={() => recipients === 'selected' && toggleSelect(u.id)}
                          style={{ borderTop: '1px solid #1A1D2E', cursor: recipients === 'selected' ? 'pointer' : 'default', backgroundColor: selectedIds.has(u.id) ? 'rgba(0,194,168,0.06)' : 'transparent' }}>
                          {recipients === 'selected' && (
                            <td style={{ ...td, width: 36 }}>
                              <input type="checkbox" checked={selectedIds.has(u.id)} readOnly style={{ width: 16, height: 16, accentColor: '#00C2A8', cursor: 'pointer' }} />
                            </td>
                          )}
                          <td style={{ ...td, color: '#55627E', fontWeight: 700 }}>{safePage * PAGE_SIZE + i + 1}</td>
                          <td style={td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <AvatarCell avatarUrl={u.avatar_url} username={u.username} />
                              <span style={{ fontWeight: 700 }}>{u.username || '—'}</span>
                            </div>
                          </td>
                          <td style={{ ...td, color: '#A0AEC0' }}>{u.legacy_email || '—'}</td>
                          <td style={{ ...td, textAlign: 'center' }}>{u.games_played ?? 0}</td>
                          <td style={{ ...td, textAlign: 'center' }}>{u.wins ?? 0}</td>
                          <td style={{ ...td, textAlign: 'center', color: '#00C2A8', fontWeight: 700 }}>{(u.total_score ?? 0).toLocaleString()}</td>
                          <td style={{ ...td, textAlign: 'center' }}>
                            {u.notifications_enabled && u.push_token
                              ? <span style={{ color: '#48BB78', fontSize: 16 }}>✓</span>
                              : <span style={{ color: '#2D3748', fontSize: 14 }}>—</span>}
                          </td>
                          <td style={{ ...td, color: '#55627E', whiteSpace: 'nowrap' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('el-GR') : '—'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '12px 20px', borderTop: '1px solid #1A1D2E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <span style={{ color: '#55627E', fontSize: 12, fontWeight: 600 }}>
                  {filtered.length === 0 ? 'No results' : `${safePage * PAGE_SIZE + 1}–${Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length} users`}
                </span>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0} style={pageBtn(safePage === 0)}>← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i).filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - safePage) <= 1).reduce((acc, i, idx, arr) => {
                      if (idx > 0 && i - arr[idx - 1] > 1) acc.push('…');
                      acc.push(i);
                      return acc;
                    }, []).map((item, idx) =>
                      item === '…'
                        ? <span key={`ellipsis-${idx}`} style={{ color: '#55627E', fontSize: 12, padding: '0 4px' }}>…</span>
                        : <button key={item} onClick={() => setPage(item)} style={pageBtn(false, item === safePage)}>{item + 1}</button>
                    )}
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage === totalPages - 1} style={pageBtn(safePage === totalPages - 1)}>Next →</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Send Notification ─────────────────────────────────────── */}
          <div style={{ ...card, marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 22 }}>🔔</span>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Send Push Notification</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="e.g. New feature available!" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Recipients</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { key: 'push', label: `All Push-Enabled (${stats.pushEnabled})` },
                    { key: 'selected', label: `Selected (${selectedIds.size})` },
                  ].map(r => (
                    <button key={r.key} onClick={() => setRecipients(r.key)} style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      backgroundColor: recipients === r.key ? '#00C2A8' : '#0E111E',
                      color: recipients === r.key ? '#0B0E17' : '#A0AEC0',
                      border: '1.5px solid ' + (recipients === r.key ? '#00C2A8' : '#1A1D2E'),
                    }}>{r.label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Message</label>
              <textarea value={notifBody} onChange={e => setNotifBody(e.target.value)} placeholder="Write your notification message here…"
                rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            {recipients === 'selected' && selectedIds.size === 0 && (
              <div style={{ fontSize: 12, color: '#F6AD55', fontWeight: 600, marginBottom: 16, padding: '10px 14px', backgroundColor: 'rgba(246,173,85,0.08)', borderRadius: 10, border: '1px solid rgba(246,173,85,0.2)' }}>
                Select users from the table above to send to specific people.
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 13, color: '#A0AEC0' }}>
                Will reach <strong style={{ color: '#FFFFFF' }}>{recipientCount}</strong> user{recipientCount !== 1 ? 's' : ''}
              </div>
              <button onClick={handleSend} disabled={sending || (recipients === 'selected' && selectedIds.size === 0)}
                style={{ backgroundColor: sending ? '#1A1D2E' : '#00C2A8', color: sending ? '#A0AEC0' : '#0B0E17', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer' }}>
                {sending ? 'Sending…' : 'Send Notification →'}
              </button>
            </div>

            {sendResult && (
              <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, backgroundColor: sendResult.ok ? 'rgba(72,187,120,0.1)' : 'rgba(255,77,77,0.1)', color: sendResult.ok ? '#48BB78' : '#FF4D4D', border: `1.5px solid ${sendResult.ok ? '#48BB78' : '#FF4D4D'}` }}>
                {sendResult.ok ? '✓ ' : '✕ '}{sendResult.message}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Style constants ─────────────────────────────────────────────────────────

const th = { padding: '12px 16px', textAlign: 'left' };
const td = { padding: '13px 16px', color: '#FFFFFF' };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#A0AEC0', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 };
const inputStyle = { width: '100%', backgroundColor: '#0E111E', border: '1.5px solid #1A1D2E', borderRadius: 10, padding: '10px 14px', color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box' };
const card = { backgroundColor: '#111422', border: '1.5px solid #1A1D2E', borderRadius: 20, padding: 24 };
const cardTitle = { fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 };
const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#55627E', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 };
const pageBtn = (disabled, active = false) => ({
  padding: '5px 11px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
  border: '1.5px solid ' + (active ? '#00C2A8' : '#1A1D2E'),
  backgroundColor: active ? '#00C2A8' : '#0E111E',
  color: active ? '#0B0E17' : disabled ? '#2D3748' : '#A0AEC0',
});

// ─── Server-side data fetch ───────────────────────────────────────────────────

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  if (!userId) return { redirect: { destination: '/sign-in', permanent: false } };

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
  if (email !== 'kolepidas@gmail.com') return { redirect: { destination: '/', permanent: false } };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const now = new Date();
  const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgoStr = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const twoWeeksAgoStr = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  // Run all queries in parallel for speed
  const [
    { data: users = [] },
    { count: totalGames },
    { count: totalRounds },
    { count: totalAnswers },
    { count: validAnswers },
    { data: recentRooms = [] },
    { data: allRounds = [] },
  ] = await Promise.all([
    supabase.from('users').select('id, clerk_id, username, avatar_url, legacy_email, games_played, wins, total_score, push_token, notifications_enabled, created_at').order('created_at', { ascending: false }),
    supabase.from('rooms').select('id', { count: 'exact', head: true }).eq('status', 'finished'),
    supabase.from('rounds').select('id', { count: 'exact', head: true }).eq('status', 'done'),
    supabase.from('answers').select('id', { count: 'exact', head: true }),
    supabase.from('answers').select('id', { count: 'exact', head: true }).eq('is_valid', true),
    // Recent rooms for the daily chart
    supabase.from('rooms').select('finished_at').eq('status', 'finished').gte('finished_at', twoWeeksAgoStr).order('finished_at', { ascending: true }),
    // All rounds for letter distribution
    supabase.from('rounds').select('letter').eq('status', 'done'),
  ]);

  // ── User stats ────────────────────────────────────────────────────────────
  // Build new-users-per-day from the already-fetched users array (no extra query)
  const userDayMap = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    userDayMap[d.toISOString().slice(0, 10)] = 0;
  }
  (users || []).forEach(u => {
    if (u.created_at) {
      const key = u.created_at.slice(0, 10);
      if (key in userDayMap) userDayMap[key]++;
    }
  });
  const dailyUsers = Object.entries(userDayMap).map(([day, count]) => ({ day, count }));

  const stats = {
    totalUsers: users.length,
    newToday: users.filter(u => u.created_at >= todayStr).length,
    newWeek: users.filter(u => u.created_at >= weekAgoStr).length,
    pushEnabled: users.filter(u => u.notifications_enabled && u.push_token).length,
    dailyUsers,
  };

  // ── Daily games chart (last 14 days) ──────────────────────────────────────
  const dayMap = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = 0;
  }
  (recentRooms || []).forEach(r => {
    if (r.finished_at) {
      const key = r.finished_at.slice(0, 10);
      if (key in dayMap) dayMap[key]++;
    }
  });
  const dailyGames = Object.entries(dayMap).map(([day, count]) => ({ day, count }));

  // ── Letter distribution (top 15) ─────────────────────────────────────────
  const letterCount = {};
  (allRounds || []).forEach(r => { if (r.letter) letterCount[r.letter] = (letterCount[r.letter] || 0) + 1; });
  const topLetters = Object.entries(letterCount).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([letter, count]) => ({ letter, count }));

  // ── Engagement breakdown ──────────────────────────────────────────────────
  const engagement = {
    neverPlayed: users.filter(u => (u.games_played ?? 0) === 0).length,
    casual: users.filter(u => (u.games_played ?? 0) >= 1 && (u.games_played ?? 0) <= 5).length,
    regular: users.filter(u => (u.games_played ?? 0) >= 6 && (u.games_played ?? 0) <= 20).length,
    power: users.filter(u => (u.games_played ?? 0) > 20).length,
  };

  // ── Avg players per game (sum of all games_played / total rooms) ───────────
  const totalParticipations = users.reduce((sum, u) => sum + (u.games_played ?? 0), 0);
  const avgPlayersPerGame = totalGames > 0 ? (totalParticipations / totalGames).toFixed(1) : '—';
  const avgRoundsPerGame = totalGames > 0 ? ((totalRounds || 0) / totalGames).toFixed(1) : '—';

  // ── Top 5 players ─────────────────────────────────────────────────────────
  const topPlayers = [...users].sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0)).slice(0, 5);

  const gameAnalytics = {
    totalGames: totalGames || 0,
    totalRounds: totalRounds || 0,
    totalAnswers: totalAnswers || 0,
    validAnswers: validAnswers || 0,
    validRate: totalAnswers > 0 ? Math.round((validAnswers / totalAnswers) * 100) : 0,
    avgPlayersPerGame,
    avgRoundsPerGame,
    dailyGames,
    topLetters,
    engagement,
    topPlayers,
  };

  return { props: { users, stats, gameAnalytics } };
}
