class Timer {
  private initialTime: number;
  private currentTime: number;

  constructor() {
    this.initialTime = 0;
    this.currentTime = 0;
  }

  startTimer(): void {
    this.initialTime = new Date().getTime();
    this.currentTime = this.initialTime;
  }

  stopTimer(): void {
    this.currentTime = new Date().getTime() - this.initialTime;
  }

  resetTimer(): void {
    this.initialTime = 0;
    this.currentTime = 0;
  }

  getTime(): number {
    return this.currentTime;
  }
}

export default Timer;
