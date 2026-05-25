import { SettingsPage } from '@/components/settings/SettingsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '设置 — Peel',
  description: '配置你的番茄钟与数据备份。',
}

export default function Page() {
  return <SettingsPage />
}
