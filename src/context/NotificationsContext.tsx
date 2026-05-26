import { createContext, useContext, useState, type ReactNode } from 'react';

export type NotifItem = {
  id: string;
  title: string;
  body: string;
  dateLabel: string;
  icon: string;
  read: boolean;
  actionLabel?: string;
};

const INITIAL_NOTIFICATIONS: NotifItem[] = [
  {
    id: '1',
    title: 'Earn yield on your crypto',
    body: 'Your BORG tokens are sitting idle. Start earning up to 5.4% APY in the Invest account. T&Cs apply.',
    dateLabel: 'Yesterday',
    icon: 'trending-up-outline',
    read: false,
  },
  {
    id: '2',
    title: 'Swap faster with 0% fees',
    body: 'Enjoy zero-fee swaps on BTC, ETH and SOL pairs this week only. T&Cs apply.',
    dateLabel: 'Yesterday',
    icon: 'swap-horizontal-outline',
    read: false,
    actionLabel: 'Swap now',
  },
  {
    id: '3',
    title: 'Activate your crypto card',
    body: 'Spend crypto anywhere Mastercard is accepted and leave exchange fees behind. T&Cs apply.',
    dateLabel: '2 April',
    icon: 'card-outline',
    read: false,
    actionLabel: 'Activate card',
  },
  {
    id: '4',
    title: 'Invite friends, earn rewards',
    body: 'Get €40 for every eligible friend who joins SwissBorg by 21 April. T&Cs apply.',
    dateLabel: '1 April',
    icon: 'people-outline',
    read: true,
  },
  {
    id: '5',
    title: 'New token listed: BORG',
    body: 'SwissBorg (BORG) is now available for trading. Add it to your portfolio today.',
    dateLabel: '29 March',
    icon: 'star-outline',
    read: true,
  },
];

type NotificationsContextValue = {
  notifications: NotifItem[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotifItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead, markRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used inside NotificationsProvider');
  return ctx;
}
