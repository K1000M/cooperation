import defaultSettings from '@/settings'

const title = defaultSettings.title || '数字化健康监测管理平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
