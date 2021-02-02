export interface Result {
  readonly time: number;
  readonly grade: Grade;
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type GradeRange = [number, number];
