import { GradeRange } from '../types';

export const targetWaitText = 'Wait for Green...';
export const targetReadyText = 'Click Now!';
export const targetDoneText = 'Test Complete';

export const buttonReadyText = 'Test Started';
export const buttonStartText = 'Start Test';

export const targetReadyClass = 'app__target--ready';
export const targetCountdownClass = 'app__target--countdown';

export const gradeRanges: { [key: string]: GradeRange } = {
  s: [1, 200],
  a: [201, 250],
  b: [251, 350],
  c: [351, 450],
  d: [451, 550],
  e: [551, 700],
  f: [700, 1000 * 60 * 60 * 24],
};
