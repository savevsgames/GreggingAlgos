import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Topic, topics as initialTopics } from '../../../public/data/topics'

interface TopicsState {
  // Store the topics
  topics: Topic[]
  // Keep track of read/unread status
  readTopics: Record<string, boolean>
  // Keep track of favorites
  favorites: string[]
  // Actions
  markAsRead: (slug: string) => void
  toggleFavorite: (slug: string) => void
  // Getters
  getTopicsByCategory: (category: Topic['category']) => Topic[]
  getFavoritedTopics: () => Topic[]
  isTopicRead: (slug: string) => boolean
  isTopicFavorited: (slug: string) => boolean
}

export const useTopicsStore = create<TopicsState>()(
  persist(
    (set, get) => ({
      topics: initialTopics,
      readTopics: {},
      favorites: [],

      markAsRead: (slug: string) =>
        set((state) => ({
          readTopics: { ...state.readTopics, [slug]: true }
        })),

      toggleFavorite: (slug: string) =>
        set((state) => ({
          favorites: state.favorites.includes(slug)
            ? state.favorites.filter((id) => id !== slug)
            : [...state.favorites, slug]
        })),

      getTopicsByCategory: (category: Topic['category']) =>
        get().topics.filter((topic) => topic.category === category),

      getFavoritedTopics: () =>
        get().topics.filter((topic) => get().favorites.includes(topic.slug)),

      isTopicRead: (slug: string) => get().readTopics[slug] || false,

      isTopicFavorited: (slug: string) => get().favorites.includes(slug),
    }),
    {
      name: 'topics-storage',
      // Only persist read status and favorites
      partialize: (state) => ({
        readTopics: state.readTopics,
        favorites: state.favorites,
      }),
    }
  )
)
