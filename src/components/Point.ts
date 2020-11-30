export default class Point {

  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(p: Point) {
    this.x = p.x;
    this.y = p.y;
    return this;
  }

  add(p: Point) {
    this.x += p.x;
    this.y += p.y;
    return this;
  }

  addValues(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }

  addScalar(val: number) {
    this.x += val;
    this.y += val;
    return this;
  }

  subtract(p: Point) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  }

  subtractValues(x: number, y: number) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  subtractScalar(val: number) {
    this.x -= val;
    this.y -= val;
    return this;
  }

  multiply(p: Point) {
    this.x *= p.x;
    this.y *= p.y;
    return this;
  }

  multiplyValues(x: number, y: number) {
    this.x *= x;
    this.y *= y;
    return this;
  }

  multiplyScalar(val: number) {
    this.x *= val;
    this.y *= val;
    return this;
  }

  divide(p: Point) {
    this.x /= p.x;
    this.y /= p.y;
    return this;
  }

  divideValues(x: number, y: number) {
    this.x /= x;
    this.y /= y;
    return this;
  }

  divideScalar(val: number) {
    this.x /= val;
    this.y /= val;
    return this;
  }

  clone() { return new Point(this.x, this.y); }

  angle() { return Math.atan2(this.y, this.x); }

  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return this.set(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  angleTo(p: Point) { return Math.atan2(p.y - this.y, p.x - this.x); }

  rotateAround(point, angle) {
    return this.subtract(point)
      .rotate(angle)
      .add(point);
  }

  mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }

  mag2() { return this.x * this.x + this.y * this.y; }

  distanceTo(p: Point) { return Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y)); }

  squareDistanceTo(p: Point) { return(p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y); }

  dot(p: Point) { return this.x * p.x + this.y * p.y; }

  cross(p: Point) { return this.x * p.y - this.y * p.x; }

  normalize() {
    const m = this.mag();
    this.x /= m;
    this.y /= m;
    return this;
  }

  equals(p: Point) { return p.x === this.x && p.y === this.y; }

  toString() { return "x:" + this.x + ", y:" + this.y; }

  toObject() { return { x: this.x, y: this.y }; }

  toArray() { return [this.x, this.y]; }

  static zero() { return new Point(0, 0); }

  static distance(p1: Point, p2: Point) { return p1.distanceTo(p2); }

  static random() { return new Point(Math.random(), Math.random()); }

  static fromArray(array: Array<number>) { return new Point(array[0], array[1]); }

  static fromObject(obj: Object) { return new Point(obj.x, obj.y); }
  
  static angleBetween(p1: Point, p2: Point) { return p2.angle() - p1.angle(); }
  
  static lerp(p1: Point, p2: Point, f: number) { return new Point((p2.x - p1.x) * f + p1.x, (p2.y - p1.y) * f + p1.y); }
};
