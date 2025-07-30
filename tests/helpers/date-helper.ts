export class DateHelper {
  static formatForRequest(date: Date): string {
    return date.toISOString().split('T')[0];
  }
} 