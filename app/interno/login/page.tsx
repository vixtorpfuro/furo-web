import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Ingresar — Interno FURŌ',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginForm />
}
