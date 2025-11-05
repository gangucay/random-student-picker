
export enum RandomizeMode {
  SELECT = 'select',
  GROUP = 'group',
}

export interface Settings {
  mode: RandomizeMode;
  selectCount: number;
  removeAfterSelect: boolean;
  groupCount: number;
}
