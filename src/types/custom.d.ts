declare module 'express' {
  const exp: any;
  export function Router(...args: any[]): any;
  export interface Request {}
  export interface Response {}
  export default exp;
}

declare module '@supabase/supabase-js' {
  export const createClient: any;
  export type SupabaseClient = any;
}

declare var process: {
  env: { [key: string]: string | undefined };
};

declare module 'dotenv' {
  const dotenv: { config: () => void };
  export default dotenv;
}
