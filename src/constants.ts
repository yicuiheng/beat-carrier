export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 600;

export class Color {
  str: string;
  constructor(str: string) {
    this.str = str;
  }
  toString(): string {
    return "#" + this.str;
  }
  toNumber(): number {
    return parseInt(this.str, 16);
  }
}

export const COLORS = [
  "000020",
  "191940",
  "323260",
  "4b4b80",
  "6464a0",
  "7d7dc0",
  "9696e0",
  "afafff",
].map((str) => new Color(str));

export const ACTIVE_COLOR = new Color("3cb371");
// export const INACTIVE_COLOR = new Color("696969");
export const INACTIVE_COLOR = COLORS[2];
