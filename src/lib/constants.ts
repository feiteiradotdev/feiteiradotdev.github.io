// Site configuration constants
export const SITE_CONFIG = {
  github: "https://github.com/feiteira-dev",
} as const

// Contact form constants
export const CONTACT_FORM = {
  maxMessageLength: 1000,
  minMessageLength: 10,
  minNameLength: 2,
  maxNameLength: 100,
  rateLimitWindow: 30000, // 30 seconds
} as const

// GitHub API constants
export const GITHUB = {
  username: "feiteira-dev",
  reposPerPage: 6,
  staleTime: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 2,
} as const
