import AuthForm from '@/components/auth-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const error = typeof params.error === 'string' ? params.error : null
  const registered = params.registered === 'true'

  return <AuthForm error={error} registered={registered} />
}
