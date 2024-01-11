import { useUserStore } from '@/stores/userStore';
import { useActivityStore } from '@/stores/activityStore';
import { useSessionEventStore } from '@/stores/sessionEventStore';
import { useSessionStore } from '@/stores/sessionStore';

export function resetPiniaStores() {
  const userStore = useUserStore();
  userStore.$reset();
  const activityStore = useActivityStore();
  activityStore.$reset();
  const sessionEventStore = useSessionEventStore();
  sessionEventStore.$reset();
  const sessionStore = useSessionStore();
  sessionStore.$reset();
}
