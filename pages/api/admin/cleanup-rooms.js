import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// A room stuck in 'active' status past this age was never really finished
const STUCK_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

// POST /api/admin/cleanup-rooms
// Marks long-stuck 'active' rooms as 'finished' so they stop skewing live-activity stats.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Auth check
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
  if (email !== 'kolepidas@gmail.com') return res.status(403).json({ error: 'Forbidden' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

  const cutoff = new Date(Date.now() - STUCK_THRESHOLD_MS).toISOString();
  const now = new Date().toISOString();

  const { data: stuckRooms, error: findError } = await supabase
    .from('rooms')
    .select('id')
    .eq('status', 'active')
    .lt('created_at', cutoff);

  if (findError) return res.status(500).json({ error: findError.message });
  if (!stuckRooms || stuckRooms.length === 0) {
    return res.status(200).json({ message: 'No stuck games found.', cleaned: 0 });
  }

  const { error: updateError } = await supabase
    .from('rooms')
    .update({ status: 'finished', finished_at: now })
    .in('id', stuckRooms.map(r => r.id));

  if (updateError) return res.status(500).json({ error: updateError.message });

  return res.status(200).json({
    message: `Cleaned up ${stuckRooms.length} stuck game${stuckRooms.length !== 1 ? 's' : ''}.`,
    cleaned: stuckRooms.length,
  });
}
