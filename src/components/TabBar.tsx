export type Tab = 'days' | 'map' | 'house' | 'money'

const icons: Record<Tab, JSX.Element> = {
  days: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  house: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M3 11l9-7 9 7" />
      <path d="M5.5 9.6V20h13V9.6" />
    </svg>
  ),
  money: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 2v20" />
      <path d="M17 6.5c0-2-2.2-3-5-3s-5 .9-5 3 2.2 2.8 5 3.4 5 1.3 5 3.6-2.2 3-5 3-5-1-5-3" />
    </svg>
  ),
}

const labels: Record<Tab, string> = {
  days: 'Days',
  map: 'Map',
  house: 'House',
  money: 'Money',
}

const order: Tab[] = ['days', 'map', 'house', 'money']

interface TabBarProps {
  tab: Tab
  onTab: (tab: Tab) => void
}

export const TabBar = ({ tab, onTab }: TabBarProps) => (
  <nav className="tabbar">
    {order.map((key) => (
      <button
        key={key}
        className={key === tab ? 'active' : undefined}
        onClick={() => onTab(key)}
        aria-current={key === tab}
      >
        {icons[key]}
        {labels[key]}
      </button>
    ))}
  </nav>
)
