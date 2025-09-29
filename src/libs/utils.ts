import { User } from '@/types/api'
import { v4 as uuidv4 } from 'uuid'

export function generateApiKey(): string {
  return `fk_${uuidv4().replace(/-/g, '')}`
}

// Fake data generator for users
export const fakeUsers = (): User[] => Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  username: `user${i + 1}`,
  phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
  website: `user${i + 1}.example.com`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
  address: {
    street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
    suite: `Apt. ${Math.floor(Math.random() * 999) + 1}`,
    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
    zipcode: String(Math.floor(Math.random() * 90000) + 10000),
  },
  company: {
    name: `Company ${i + 1}`,
    catchPhrase: 'Innovative solutions for modern problems',
    bs: 'synergistic solutions'
  }
}))