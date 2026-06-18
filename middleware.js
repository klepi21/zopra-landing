import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Only protect admin routes — everything else stays public
const isAdminRoute = createRouteMatcher(['/supervise(.*)', '/api/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/supervise(.*)', '/api/admin(.*)'],
};
