export type Profile = {
  id: string
  username: string
  pfp_url: string | null
  email: string
}

export type UserSet = {
  user_id: string,
  set_id: number,
  rank: number
}