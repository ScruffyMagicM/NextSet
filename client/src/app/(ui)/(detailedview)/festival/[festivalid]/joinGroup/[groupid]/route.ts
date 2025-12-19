// app/api/perform-action/route.ts
import joinGroup from '@/supabase/actions/server/groups/joinGroup'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { groupId: string, festivalId: string } }) {
  
  //If user is logged in, join group. If not logged in, throw them to login page

  await joinGroup(params.groupId);
  
  // Redirect to another page
  return NextResponse.redirect(new URL(`/festival/${params.festivalId}/${params.groupId}`, request.url))
}