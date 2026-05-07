import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

const DISCORD_OAUTH_URL =
  'https://discord.com/oauth2/authorize?client_id=434432973362954241'

export const Route = createFileRoute('/discord')({
  component: DiscordRedirectPage,
})

function DiscordRedirectPage() {
  useEffect(() => {
    window.location.replace(DISCORD_OAUTH_URL)
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#10151f',
        color: '#f5efe6',
        fontFamily: 'Space Grotesk, sans-serif',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <p>
        Redirecting to Discord… If nothing happens,{' '}
        <a href={DISCORD_OAUTH_URL} target="_self" rel="noreferrer">
          continue here
        </a>
        .
      </p>
    </main>
  )
}
