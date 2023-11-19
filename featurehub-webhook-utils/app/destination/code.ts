export class DestinationCode {
  public readonly code: string;

  constructor(code: string) {
    this.code = code.toUpperCase();
  }

  public key(key: string): string | undefined {
    return process.env[`DESTINATION_${this.code}_${key.toUpperCase()}`];
  }
}
