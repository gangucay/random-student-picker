
export enum RandomMode {
  MULTIPLE = 'MULTIPLE',
  GROUPS = 'GROUPS',
}

export interface StudentGroup {
  id: number;
  students: string[];
}
