// types/Post.ts
import type {Blog} from "~/types/blog/blog";

export interface Post {
  id: number
  title: string
  content: string
  slug: string
  blog: string | Blog
  author: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
  likesCount?: number
  commentsCount?: number
}
