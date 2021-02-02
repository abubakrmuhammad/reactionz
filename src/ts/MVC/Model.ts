import { Grade, Result } from '../types';
import { gradeRanges } from '../utils/consts';
import Timer from '../utils/Timer';

class State {
  public timer: Timer;
  public readonly results: Result[];
  public readonly totalTurns: number;
  public currentTurnIndex: number;

  constructor() {
    this.timer = new Timer();
    this.results = [];
    this.totalTurns = 5;
    this.currentTurnIndex = 0;
  }

  get averageResult(): Result {
    const totalTime = this.results.reduce(
      (totalTime, result) => (totalTime += result.time),
      0
    );
    const time = parseInt((totalTime / this.currentTurnIndex).toFixed(0));
    const grade = this.findGrade(time);

    return { time, grade };
  }

  public reset() {
    this.timer.resetTimer();
    this.results.length = 0;
    this.currentTurnIndex = 0;
  }

  public recordResult(): void {
    this.timer.stopTimer();

    const time = this.timer.getTime();
    const grade = this.findGrade(time);

    this.results.push({ time, grade });

    this.currentTurnIndex++;
  }

  private findGrade(time: number): Grade {
    const grades = Object.keys(gradeRanges) as Array<Grade>;

    const currentGrade = grades.find((grade: string) => {
      const [min, max] = gradeRanges[grade];

      return time >= min && time <= max;
    });

    return currentGrade;
  }
}

export default State;
