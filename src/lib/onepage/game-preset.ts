import type {GamePage,PageTemplate} from './model';
/** Built-in editorial data is separate from browser-local user drafts. */
export type GamePreset={
 template:PageTemplate;
 page:Partial<Omit<GamePage,'schema'|'id'|'templateId'|'isTemplate'|'campaignId'|'updatedAt'|'sections'>>;
};
