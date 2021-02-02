import State from './Model';
import UI from './View';

class App {
  private ui: UI;
  private state: State;

  constructor() {
    this.ui = new UI();
    this.state = new State();

    this.endTurn = this.endTurn.bind(this);
  }

  public init(): void {
    this.ui.resizeTargetBox();
    this.setupInitialEventListeners();
  }

  private setupInitialEventListeners(): void {
    this.ui.startButton.addEventListener('click', () => this.startTest());

    window.addEventListener('resize', () => this.ui.resizeTargetBox());
  }

  private async startTest(): Promise<void> {
    this.clearLastTest();

    this.ui.readyButton();

    await this.ui.targetCountdown(3);

    do {
      await this.doTurn();
    } while (this.state.currentTurnIndex < this.state.totalTurns);

    this.ui.unreadyButton();
    this.ui.doneTarget();
  }

  private clearLastTest(): void {
    this.ui.reset();
    this.state.reset();
  }

  private async doTurn(): Promise<void> {
    const randomTime: number = Math.floor(Math.random() * 4000 + 1000); // 1 to 5 secs

    await this.startTurn(randomTime);

    await this.ui.waitForTargetClick();

    this.ui.displayResults(this.state.results);
    this.ui.displayAverageResult(this.state.averageResult);
  }

  private async startTurn(time: number): Promise<void> {
    this.ui.unreadyTarget();

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.ui.readyTarget();
        this.ui.targetBox.addEventListener('click', this.endTurn);

        this.state.timer.startTimer();

        resolve();
      }, time);
    });
  }

  private endTurn(): void {
    this.ui.unreadyTarget();
    this.ui.targetBox.removeEventListener('click', this.endTurn);

    this.state.recordResult();
  }
}

export default App;
