/**
 * This is used to sanitize input object from post and put
 * So no unwanted data can be stored in the database
 * @param type
 * @param input
 */
export function clean<T>(type: { new (...args: any[]): any }, input: T): T {
  // TODO: To be implemented
  return input;
}
