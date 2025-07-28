declare module 'node-cron' {
  interface CronJob {
    start(): void;
    stop(): void;
  }
  
  interface ScheduleOptions {
    scheduled?: boolean;
    timezone?: string;
  }
  
  function schedule(expression: string, func: () => void, options?: ScheduleOptions): CronJob;
  
  const cron: {
    schedule: typeof schedule;
  };
  
  export = cron;
} 