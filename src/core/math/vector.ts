export class Vector {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  multiplyScalar(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  multiplyVector(): Vector {
    throw console.error('Vector.multiplyVector not yet implemented');
    return new Vector(0, 0);
  }

  divideScalar(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalised(): Vector {
    if (this.x === 0 && this.y === 0) return this;

    const magnitude: number = this.magnitude();
    const normalX = this.x / magnitude;
    const normalY = this.y / magnitude;

    return new Vector(normalX, normalY);
  }

  distance(v: Vector): number {
    // sqr((A.x - B.x)^2 + (A.y - B.y)^2)
    const partA = Math.pow(this.x - v.x, 2);
    const partB = Math.pow(this.y - v.y, 2);
    const distance = Math.sqrt(partA + partB);
    return distance;
  }

  perpendicularClockwise(): Vector {
    return new Vector(this.y, -this.x);
  }

  perpendicularAnticlockwise(): Vector {
    return new Vector(-this.y, this.x);
  }

  log(): void {
    console.log('x: ' + this.x + ', y: ' + this.y);
  }
}
