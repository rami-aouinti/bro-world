// types/Blog.ts
export interface Blog {
  id: number
  title: string
  description?: string
  slug: string
  createdAt: string
  updatedAt: string
  author: {
    id: number
    name: string
  }
}
