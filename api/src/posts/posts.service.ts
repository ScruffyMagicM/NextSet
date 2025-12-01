import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PostsService {
  constructor(private supabaseService: SupabaseService) {}

  async getUserPosts(userId: string, userJwt: string) {
    // Use user's JWT to respect RLS policies
    const supabase = this.supabaseService.getClientForUser(userJwt);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
}