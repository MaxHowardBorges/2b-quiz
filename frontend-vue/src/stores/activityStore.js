import { defineStore } from 'pinia';

export const useActivityStore = defineStore({
  id: 'activity',
  state: () => ({
    lastActivityTime: Date.now(),
  }),
  getters: {
    isInactiveAndClosed() {
      const currentTime = Date.now();
      const timeDifference = currentTime - this.lastActivityTime;
      return timeDifference > 1000 * 1000;
    },
    isInactive() {
      const currentTime = Date.now();
      const timeDifference = currentTime - this.lastActivityTime;
      return timeDifference > (1000 - 300) * 1000 && timeDifference < 1000;
    },
    wasActive() {
      const currentTime = Date.now();
      const timeDifference = currentTime - this.lastActivityTime;
      return timeDifference < 60 * 1000;
    },
  },
  actions: {
    updateActivityTime() {
      this.lastActivityTime = Date.now();
    },
  },
});
