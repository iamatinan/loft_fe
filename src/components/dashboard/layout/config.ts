import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  // { key: 'inventory', title: 'คลังสินค้า', href: paths.dashboard.inventory, icon: 'TreasureChest' },
  // { key: 'staft', title: 'จัดการพนักงาน', href: paths.dashboard.staft, icon: 'user' },
  { key: 'customers', title: 'จัดการลูกค้า', href: paths.dashboard.customers, icon: 'users' },
  { key: 'tags', title: 'จัดการ Tags', href: paths.dashboard.tags, icon: 'tag' },
  { key: 'integrations', title: 'จัดการไลน์', href: paths.dashboard.listLine, icon: 'plugs-connected' },
  { key: 'reports-messages', title: 'รายงานข้อความ', href: paths.dashboard.reports.messages, icon: 'chart-line' },
  { key: 'reports-customer-appointment', title: 'รายงานการนัดหมายลูกค้า', href: paths.dashboard.reports.customerAppointment, icon: 'calendar' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' }
] satisfies NavItemConfig[];
