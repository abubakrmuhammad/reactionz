class App {
  constructor() {
    this.view = new AppView();
    this.results = [];
    this.timer = new Timer();

    this.totalTurns = 5;
    this.currentTurnNumber = 0;

    this.startTest = this.startTest.bind(this);
    this.doTurn = this.doTurn.bind(this);
    this.startTurn = this.startTurn.bind(this);
    this.recordTurn = this.recordTurn.bind(this);
    this.endTurn = this.endTurn.bind(this);
  }

  get averageResult() {
    const totalTime = this.results.reduce(
      (totalTime, { time }) => totalTime + time,
      0
    );

    const turnsDone = this.currentTurnNumber + 1;
    const time = (totalTime / turnsDone).toFixed(0);
    const grade = this.calculateGrade(time);

    return { time, grade };
  }

  init() {
    this.view.resizeTargetBox();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.view.startButton.addEventListener('click', this.startTest);

    window.addEventListener('resize', this.view.resizeTargetBox);
  }

  async startTest() {
    this.view.clearResults();
    this.results = [];

    this.view.readyButton();

    await this.waitForStart();

    do {
      await this.doTurn();

      this.view.displayResults(this.results);
      this.view.displayAverageResult(this.averageResult);

      this.currentTurnNumber++;
    } while (this.currentTurnNumber < this.totalTurns);

    this.view.unreadyButton();
  }

  async doTurn() {
    const randomTime = Math.floor(Math.random() * 4000 + 1000); // 1 to 5 secs

    await new Promise((resolve) => {
      window.setTimeout(() => {
        this.startTurn();
        resolve();
      }, randomTime);
    });

    const promise = new Promise((resolve) => {
      this.view.targetBox.addEventListener('click', resolve);
    });

    return promise;
  }

  startTurn() {
    this.view.readyTarget();
    this.view.targetBox.addEventListener('click', this.recordTurn);

    this.timer.startTimer();
  }

  recordTurn() {
    this.timer.stopTimer();

    // const time = this.view.isTargetReady ? this.timer.getTime() : 'null';

    const time = this.timer.getTime();

    this.results.push({
      time,
      grade: this.calculateGrade(time),
    });

    this.endTurn();
  }

  endTurn() {
    this.view.unreadyTarget();
    this.view.targetBox.removeEventListener('click', this.recordTurn);

    this.timer.resetTimer();
  }

  async waitForStart(seconds = 3) {
    let count = seconds;
    let timeout = 0;

    const promises = [];

    do {
      const timeoutPromise = new Promise((resolve) => {
        window.setTimeout(
          (count) => {
            this.view.countdownNumber(count);

            resolve();
          },
          timeout,
          count
        );

        timeout += 1000;
        count--;
      });

      promises.push(timeoutPromise);
    } while (count >= 0);

    return Promise.all(promises);
  }

  calculateGrade(time) {
    const gradeRanges = {
      s: [1, 200],
      a: [201, 250],
      b: [251, 350],
      c: [351, 450],
      d: [451, 550],
      e: [551, 700],
      f: [700, 60 * 60 * 24],
    };

    time = parseInt(time);

    if (isNaN(time)) return 'fZ';

    const grades = Object.keys(gradeRanges);

    const currentGrade = grades.find((grade) => {
      const [min, max] = gradeRanges[grade];

      return time >= min && time <= max;
    });

    return currentGrade;
  }
}

class AppView {
  constructor() {
    this.startButton = document.querySelector('#startButton');
    this.targetBox = document.querySelector('#targetBox');
    this.resultTable = document.querySelector('#resultTable');

    this.readyButton = this.readyButton.bind(this);
    this.unreadyButton = this.unreadyButton.bind(this);
    this.readyTarget = this.readyTarget.bind(this);
    this.unreadyTarget = this.unreadyTarget.bind(this);
    this.countdownNumber = this.countdownNumber.bind(this);
    this.displayResults = this.displayResults.bind(this);
    this.clearResults = this.clearResults.bind(this);
    this.resizeTargetBox = this.resizeTargetBox.bind(this);
  }

  get isTargetReady() {
    return this.targetBox.classList.contains('app__arget--ready');
  }

  readyButton() {
    this.startButton.setAttribute('disabled', true);
    this.startButton.textContent = 'Test Started';
  }

  unreadyButton() {
    this.startButton.removeAttribute('disabled');

    this.startButton.textContent = 'Start Test Again';
  }

  readyTarget() {
    this.targetBox.classList.add('app__target--ready');
  }

  unreadyTarget() {
    this.targetBox.classList.remove('app__target--ready');
  }

  countdownNumber(number) {
    this.targetBox.textContent = number || '';
  }

  displayResults(results) {
    const resultRows = this.resultTable.querySelectorAll('tbody tr');

    results.forEach((result, i) => {
      const [, timeCell, gradeCell] = resultRows[i].children;
      const { time, grade } = result;

      timeCell.textContent = time + ' ms';
      gradeCell.textContent = grade;

      gradeCell.className = 'grade grade--' + grade;
    });
  }

  displayAverageResult(result) {
    const avgRow = this.resultTable.querySelector('tfoot tr');

    const [, timeCell, gradeCell] = avgRow.children;
    const { time, grade } = result;

    timeCell.textContent = time + ' ms';
    gradeCell.textContent = grade;

    gradeCell.className = 'grade grade--' + grade;
  }

  clearResults() {
    const resultRows = this.resultTable.querySelectorAll('tbody tr, tfoot tr');

    resultRows.forEach((row) => {
      const [, timeCell, gradeCell] = row.children;

      timeCell.textContent = '';
      gradeCell.textContent = '';
    });
  }

  resizeTargetBox(ratio = 4 / 3) {
    const targetWidth = targetBox.clientWidth;
    const targetHeight = targetWidth / ratio;

    targetBox.style.setProperty('height', `${targetHeight}px`);
  }
}

class Timer {
  constructor() {
    this._initialTime = 0;
    this._time = 0;
  }

  startTimer() {
    this._initialTime = new Date().getTime();
    this._time = this._initialTime;
  }

  stopTimer() {
    this._time = new Date().getTime() - this._initialTime;
  }

  resetTimer() {
    this._initialTime = 0;
    this._time = 0;
  }

  getTime() {
    return this._time;
  }
}

new App().init();
