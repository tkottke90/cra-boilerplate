export class MyProcess {

  constructor() {}

  getUptime() {
    return `${process.uptime().toFixed(2)} seconds`;
  }
}

export default new MyProcess();