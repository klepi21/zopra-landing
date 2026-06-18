import { useState, useMemo } from 'react';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Head from 'next/head';

// ─── Helpers ────────────────────────────────────────────────────────────────

// Parse ZOPRA avatar JSON or return a plain URL / fallback
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
  const base = {
    width: 32, height: 32, borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
  };
  if (av.type === 'emoji') return (
    <div style={{ ...base, backgroundColor: av.color + '33', border: `1.5px solid ${av.color}44` }}>
      {av.emoji}
    </div>
  );
  if (av.type === 'image') return (
    <img src={av.url} alt="" style={{ ...base, objectFit: 'cover' }} />
  );
  return (
    <div style={{ ...base, backgroundColor: '#1E233C', color: '#A0AEC0', fontSize: 13, fontWeight: 700 }}>
      {(username || '?')[0].toUpperCase()}
    </div>
  );
}

function StatCard({ label, value, color = '#00C2A8', icon }) {
  return (
    <div style={{
      backgroundColor: '#111422', border: '1.5px solid #1A1D2E', borderRadius: 16,
      padding: '20px 24px', flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize: 26, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 600, marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminDashboard({ users, stats }) {
  const router = useRouter();
  const { signOut } = useClerk();

  // Search & filter state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'push'

  // Notification state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [recipients, setRecipients] = useState('push'); // 'all' | 'push' | 'selected'
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null); // { ok, message }

  // Filtered user list
  const filtered = useMemo(() => {
    let list = users;
    if (filter === 'push') list = list.filter(u => u.notifications_enabled && u.push_token);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.username || '').toLowerCase().includes(q) ||
        (u.legacy_email || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, search, filter]);

  // Recipients preview count
  const recipientCount = useMemo(() => {
    if (recipients === 'selected') return selectedIds.size;
    if (recipients === 'push') return stats.pushEnabled;
    return stats.totalUsers;
  }, [recipients, selectedIds, stats]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSend = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) {
      setSendResult({ ok: false, message: 'Title and message are required.' });
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifTitle.trim(),
          body: notifBody.trim(),
          recipients,
          userIds: recipients === 'selected' ? Array.from(selectedIds) : null,
        }),
      });
      const data = await res.json();
      setSendResult({ ok: res.ok, message: data.message || (res.ok ? 'Sent!' : 'Error') });
      if (res.ok) { setNotifTitle(''); setNotifBody(''); setSelectedIds(new Set()); }
    } catch (e) {
      setSendResult({ ok: false, message: e.message });
    } finally {
      setSending(false);
    }
  };

  const handleSignOut = () => signOut(() => router.push('/'));

  return (
    <>
      <Head>
        <title>ZOPRA Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#0B0E17', color: '#FFFFFF', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{ borderBottom: '1.5px solid #1A1D2E', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0E111E' }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#FF4D4D', letterSpacing: 5 }}>ZOPRA</span>
            <span style={{ fontSize: 13, color: '#A0AEC0', fontWeight: 600, marginLeft: 14 }}>Admin Panel</span>
          </div>
          <button
            onClick={handleSignOut}
            style={{ background: 'transparent', border: '1.5px solid #1A1D2E', color: '#A0AEC0', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Sign Out
          </button>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

          {/* ── Stats ──────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
            <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="#FFFFFF" />
            <StatCard icon="📅" label="New Today" value={stats.newToday} color="#00C2A8" />
            <StatCard icon="📆" label="New This Week" value={stats.newWeek} color="#00C2A8" />
            <StatCard icon="🔔" label="Push Subscribers" value={stats.pushEnabled} color="#48BB78" />
          </div>

          {/* ── Users Table ────────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Users</h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Search */}
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by username or email…"
                  style={{ background: '#111422', border: '1.5px solid #1A1D2E', borderRadius: 10, padding: '8px 14px', color: '#FFFFFF', fontSize: 13, width: 240, outline: 'none' }}
                />
                {/* Filter tabs */}
                {['all', 'push'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    background: filter === f ? '#00C2A8' : '#111422',
                    color: filter === f ? '#0B0E17' : '#A0AEC0',
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
                    {filtered.length === 0 ? (
                      <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#A0AEC0' }}>No users found.</td></tr>
                    ) : filtered.map((u, i) => (
                      <tr key={u.id} onClick={() => recipients === 'selected' && toggleSelect(u.id)}
                        style={{ borderTop: '1px solid #1A1D2E', cursor: recipients === 'selected' ? 'pointer' : 'default', backgroundColor: selectedIds.has(u.id) ? 'rgba(0,194,168,0.06)' : 'transparent' }}>
                        {recipients === 'selected' && (
                          <td style={{ ...td, width: 36 }}>
                            <input type="checkbox" checked={selectedIds.has(u.id)} readOnly
                              style={{ width: 16, height: 16, accentColor: '#00C2A8', cursor: 'pointer' }} />
                          </td>
                        )}
                        <td style={{ ...td, color: '#55627E', fontWeight: 700 }}>{i + 1}</td>
                        <td style={td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <AvatarCell avatarUrl={u.avatar_url} username={u.username} />
                            <span style={{ fontWeight: 700 }}>{u.username || '—'}</span>
                          </div>
                        </td>
                        <td style={{ ...td, color: '#A0AEC0' }}>{u.legacy_email || '—'}</td>
                        <td style={{ ...td, textAlign: 'center' }}>{u.games_played ?? 0}</td>
                        <td style={{ ...td, textAlign: 'center' }}>{u.wins ?? 0}</td>
                        <td style={{ ...td, textAlign: 'center', color: '#00C2A8', fontWeight: 700 }}>
                          {(u.total_score ?? 0).toLocaleString()}
                        </td>
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
              {filtered.length > 0 && (
                <div style={{ padding: '12px 20px', borderTop: '1px solid #1A1D2E', color: '#55627E', fontSize: 12, fontWeight: 600 }}>
                  Showing {filtered.length} of {users.length} users
                </div>
              )}
            </div>
          </div>

          {/* ── Send Notification ──────────────────────────────────────── */}
          <div style={{ backgroundColor: '#111422', border: '1.5px solid #1A1D2E', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 22 }}>🔔</span>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Send Push Notification</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)}
                  placeholder="e.g. New feature available!"
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Recipients</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { key: 'push', label: `Push-Enabled (${stats.pushEnabled})` },
                    { key: 'all', label: `All Users (${stats.totalUsers})` },
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
              <textarea value={notifBody} onChange={e => setNotifBody(e.target.value)}
                placeholder="Write your notification message here…"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
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
              <button
                onClick={handleSend}
                disabled={sending || (recipients === 'selected' && selectedIds.size === 0)}
                style={{
                  backgroundColor: sending ? '#1A1D2E' : '#00C2A8',
                  color: sending ? '#A0AEC0' : '#0B0E17',
                  border: 'none', borderRadius: 12, padding: '12px 28px',
                  fontSize: 14, fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s',
                }}
              >
                {sending ? 'Sending…' : 'Send Notification →'}
              </button>
            </div>

            {sendResult && (
              <div style={{
                marginTop: 16, padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                backgroundColor: sendResult.ok ? 'rgba(72,187,120,0.1)' : 'rgba(255,77,77,0.1)',
                color: sendResult.ok ? '#48BB78' : '#FF4D4D',
                border: `1.5px solid ${sendResult.ok ? '#48BB78' : '#FF4D4D'}`,
              }}>
                {sendResult.ok ? '✓ ' : '✕ '}{sendResult.message}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Shared inline style constants ──────────────────────────────────────────

const th = { padding: '12px 16px', textAlign: 'left' };
const td = { padding: '13px 16px', color: '#FFFFFF' };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#A0AEC0', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 };
const inputStyle = { width: '100%', backgroundColor: '#0E111E', border: '1.5px solid #1A1D2E', borderRadius: 10, padding: '10px 14px', color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box' };

// ─── Server-side auth + data fetch ──────────────────────────────────────────

export async function getServerSideProps(context) {
  // 1. Verify Clerk session
  const { userId } = getAuth(context.req);
  if (!userId) {
    return { redirect: { destination: '/sign-in', permanent: false } };
  }

  // 2. Restrict to the single admin email
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
  if (email !== 'kolepidas@gmail.com') {
    return { redirect: { destination: '/', permanent: false } };
  }

  // 3. Fetch data from Supabase using the service-role key (bypasses RLS)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: users = [] } = await supabase
    .from('users')
    .select('id, clerk_id, username, avatar_url, legacy_email, games_played, wins, total_score, push_token, notifications_enabled, created_at')
    .order('created_at', { ascending: false });

  // 4. Compute stats
  const now = new Date();
  const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgoStr = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const stats = {
    totalUsers: users.length,
    newToday: users.filter(u => u.created_at >= todayStr).length,
    newWeek: users.filter(u => u.created_at >= weekAgoStr).length,
    pushEnabled: users.filter(u => u.notifications_enabled && u.push_token).length,
  };

  return {
    props: {
      users,
      stats,
    },
  };
}
