export default class Environment {
  static isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  static getName() {
    return process.env.NODE_ENV;
  }
}
