import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

// Split an array into chunks of `size`
function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

// POST /api/admin/notify
// Body: { title, body, recipients: 'all'|'push'|'selected', userIds?: string[] }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Auth check
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
  if (email !== 'kolepidas@gmail.com') return res.status(403).json({ error: 'Forbidden' });

  const { title, body, recipients, userIds } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body are required' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Build the Supabase query based on recipient mode
  let query = supabase.from('users').select('id, push_token, notifications_enabled');

  if (recipients === 'selected' && Array.isArray(userIds) && userIds.length > 0) {
    // Specific users — still require they have a valid push token
    query = query.in('id', userIds);
  } else {
    // Both 'push' and 'all' modes only send to users who have notifications enabled
    query = query.eq('notifications_enabled', true);
  }

  const { data: targetUsers, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  // Filter to users with a valid Expo push token
  const tokens = (targetUsers || [])
    .map(u => u.push_token)
    .filter(t => t && t.startsWith('ExponentPushToken['));

  if (tokens.length === 0) {
    return res.status(200).json({ message: 'No users with a valid push token in the selected group.' });
  }

  // Send in chunks of 100 (Expo API limit per request)
  const messages = tokens.map(to => ({
    to,
    title,
    body,
    sound: 'default',
    channelId: 'default',
  }));

  let totalSent = 0;
  let errors = 0;

  for (const batch of chunk(messages, 100)) {
    try {
      const expoRes = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(batch),
      });
      const json = await expoRes.json();
      const batchErrors = (json.data || []).filter(r => r.status === 'error').length;
      totalSent += batch.length - batchErrors;
      errors += batchErrors;
    } catch (e) {
      errors += batch.length;
    }
  }

  return res.status(200).json({
    message: `Sent to ${totalSent} user${totalSent !== 1 ? 's' : ''}${errors > 0 ? ` (${errors} failed)` : ''}.`,
    sent: totalSent,
    failed: errors,
  });
}
