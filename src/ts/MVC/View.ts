import { Result } from '../types';
import {
  buttonReadyText,
  buttonStartText,
  targetCountdownClass,
  targetDoneText,
  targetReadyClass,
  targetReadyText,
  targetWaitText,
} from '../utils/consts';

class UI {
  public startButton: HTMLButtonElement;
  public targetBox: HTMLDivElement;
  public resultTable: HTMLTableElement;

  constructor() {
    this.startButton = document.querySelector('#startButton');
    this.targetBox = document.querySelector('#targetBox');
    this.resultTable = document.querySelector('#resultTable');
  }

  get isTargetReady(): boolean {
    return this.targetBox?.classList.contains(targetReadyClass);
  }

  public displayResults(results: Result[]): void {
    const resultRows = this.resultTable.querySelectorAll('tbody tr');

    results.forEach((result, i) => {
      const [, timeCell, gradeCell] = resultRows[i].children;

      const { time, grade } = result;

      timeCell.textContent = time + ' ms';
      gradeCell.textContent = grade;

      gradeCell.className = 'grade grade--' + grade;
    });
  }

  public displayAverageResult(result: Result): void {
    const resultRow = this.resultTable.querySelector('tfoot tr');

    const [, timeCell, gradeCell] = resultRow.children;

    const { time, grade } = result;

    timeCell.textContent = time + ' ms';
    gradeCell.textContent = grade;

    gradeCell.className = 'grade grade--' + grade;
  }

  public reset(): void {
    this.targetBox.classList.remove(targetReadyClass);
    this.targetBox.textContent = '';

    const resultRows = this.resultTable.querySelectorAll('tbody tr, tfoot tr');

    resultRows.forEach((row) => {
      const [, timeCell, gradeCell] = row.children;

      timeCell.textContent = '';
      gradeCell.textContent = '';

      gradeCell.className = 'grade';
    });
  }

  public readyButton(): void {
    this.startButton.setAttribute('disabled', '');
    this.startButton.textContent = buttonReadyText;
  }

  public unreadyButton(): void {
    this.startButton.removeAttribute('disabled');
    this.startButton.textContent = buttonStartText;
  }

  public readyTarget(): void {
    this.targetBox.classList.add(targetReadyClass);
    this.targetBox.textContent = targetReadyText;
  }

  public unreadyTarget(): void {
    this.targetBox.classList.remove(targetReadyClass);
    this.targetBox.textContent = targetWaitText;
  }

  public doneTarget(): void {
    this.targetBox.classList.add(targetReadyClass);
    this.targetBox.textContent = targetDoneText;
  }

  public resizeTargetBox(ratio: number = 4 / 3): void {
    const targetWidth: number = this.targetBox?.clientWidth;
    const targetHeight: number = targetWidth / ratio;

    this.targetBox.style.setProperty('height', `${targetHeight}px`);
  }

  public async waitForTargetClick(): Promise<void> {
    return new Promise<void>((resolve) => {
      const reslovePromise = () => {
        resolve();
        this.targetBox.removeEventListener('click', reslovePromise);
      };

      this.targetBox.addEventListener('click', reslovePromise);
    });
  }

  public async targetCountdown(seconds: number = 3): Promise<void> {
    this.targetBox.classList.add(targetCountdownClass);

    const promises: Promise<void>[] = [];
    let timeout: number = 0;

    while (seconds >= 0) {
      const promiseExecutor = (resolve: () => void) => {
        setTimeout(
          (currentCount: number): void => {
            this.targetBox.textContent = currentCount
              ? currentCount.toString()
              : '';

            resolve();
          },
          timeout,
          seconds
        );
      };

      promises.push(new Promise(promiseExecutor));

      timeout += 1000;
      seconds--;
    }

    await Promise.all(promises);

    this.targetBox.classList.remove(targetCountdownClass);
  }
}

export default UI;
