export class TimeTrackerService {
  private readonly startTime: number;
  private endTime: number;

  constructor(startTime = 0) {
    this.startTime = startTime;
    this.endTime = startTime;
  }

  start = () => new TimeTrackerService(Date.now());

  stop = () => {
    this.endTime = Date.now();
    return this.getTime();
  };

  getTime = () => this.endTime - this.startTime;
  getSeconds = () => this.getTime() / 1000;
  getMinutes = () => this.getTime() / 1000 / 60;
}

const timeTrackerService = new TimeTrackerService();
export default timeTrackerService;
