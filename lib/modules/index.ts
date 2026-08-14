import { notFound } from 'next/navigation'
import { modules, type ModuleKey } from './config'

export function isEnabled(key: ModuleKey): boolean {
  return modules[key]
}

export function requireModule(key: ModuleKey) {
  if (!isEnabled(key)) notFound()
}
