import { Button } from '@/components/ui/button'
import { GoogleIcon, GitHubIcon } from '@/components/signin/oauth-icons'

const startOAuth = (provider: 'google' | 'github') => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}/start`
}

export const OAuthButtons = () => {
  return (
    <>
      <Button
        variant='outline'
        type='button'
        onClick={() => startOAuth('google')}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <Button
        variant='outline'
        type='button'
        onClick={() => startOAuth('github')}
      >
        <GitHubIcon />
        Continue with GitHub
      </Button>
    </>
  )
}
