// types/order.ts
export interface Order {
  id: number
  order: string
  method: string
  state: string
  currencyCode: string
  amount: number
  createdAt: string
  updatedAt: string
}
