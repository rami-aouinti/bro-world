// types/Statistics.ts
export interface Statistics {
  postsPerMonth: Record<string, number> // ex: { "2025-07": 31 }
  blogsPerMonth: Record<string, number>
  likesPerMonth: Record<string, number>
  commentsPerMonth: Record<string, number>
}
