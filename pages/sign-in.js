import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0B0E17',
      flexDirection: 'column',
      gap: 24,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#FF4D4D', letterSpacing: 6 }}>Z O P R A</div>
        <div style={{ fontSize: 11, color: '#00C2A8', fontWeight: 600, letterSpacing: 2, marginTop: 4 }}>
          ♦ ADMIN PANEL ♦
        </div>
      </div>
      <SignIn afterSignInUrl="/supervise" redirectUrl="/supervise" />
    </div>
  );
}
