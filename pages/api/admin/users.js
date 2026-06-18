import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/admin/users — returns all users for client-side refresh
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // Auth check
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
  if (email !== 'kolepidas@gmail.com') return res.status(403).json({ error: 'Forbidden' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase
    .from('users')
    .select('id, clerk_id, username, avatar_url, legacy_email, games_played, wins, total_score, push_token, notifications_enabled, created_at')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(data);
}
