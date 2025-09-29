export interface ApiKeyResponse {
  success: boolean
  data?: {
    apiKey: string
    createdAt: string
  }
  error?: string
}

export interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
  website: string
  avatar: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export type UsersResponse = ApiResponse<User[]>
export type UserResponse = ApiResponse<User>