import Parse from '../lib/parseClient';

export interface IUserPreference {
  objectId?: string;
  userId?: string;
  needs: string[];
  features: Record<string, boolean>;
}

export const UserPreference = Parse.Object.extend('UserPreference');