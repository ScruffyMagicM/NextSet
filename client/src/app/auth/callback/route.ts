import { createClient } from '../../supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error.message);
      return NextResponse.redirect(`/?error=${error.message}`);
    }
  }
  // Redirect to dashboard after successful authentication
  return NextResponse.redirect(`${origin}/`);
}