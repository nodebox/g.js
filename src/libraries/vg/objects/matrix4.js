// 3-dimensional matrix

import Vec3 from "../objects/vec3";

// Construct a 4x4 matrix.
export default class Matrix4 {
  constructor(m) {
    if (m !== undefined) {
      // TODO Check for type and length
      this.m = m;
    } else {
      m = new Float32Array(16);
      m[0] = 1.0;
      m[1] = 0.0;
      m[2] = 0.0;
      m[3] = 0.0;
      m[4] = 0.0;
      m[5] = 1.0;
      m[6] = 0.0;
      m[7] = 0.0;
      m[8] = 0.0;
      m[9] = 0.0;
      m[10] = 1.0;
      m[11] = 0.0;
      m[12] = 0.0;
      m[13] = 0.0;
      m[14] = 0.0;
      m[15] = 1.0;
      this.m = m;
    }
  }
  // Create a perspective matrix transformation.
  static perspective(fov, aspect, zNear, zFar) {
    var m = new Float32Array(Matrix4.IDENTITY.m),
      tan = 1.0 / Math.tan(fov * 0.5);

    m[0] = tan / aspect;
    m[1] = m[2] = m[3] = 0.0;
    m[5] = tan;
    m[4] = m[6] = m[7] = 0.0;
    m[8] = m[9] = 0.0;
    m[10] = -zFar / (zNear - zFar);
    m[11] = 1.0;
    m[12] = m[13] = m[15] = 0.0;
    m[14] = (zNear * zFar) / (zNear - zFar);

    return new Matrix4(m);
  }
  static lookAt(eye, target, up) {
    var m, zAxis, xAxis, yAxis, ex, ey, ez;
    m = new Float32Array(16);
    zAxis = target.subtract(eye).normalize();
    xAxis = Vec3.cross(up, zAxis).normalize();
    yAxis = Vec3.cross(zAxis, xAxis).normalize();

    ex = -Vec3.dot(xAxis, eye);
    ey = -Vec3.dot(yAxis, eye);
    ez = -Vec3.dot(zAxis, eye);

    m[0] = xAxis.x;
    m[1] = yAxis.x;
    m[2] = zAxis.x;
    m[3] = 0;
    m[4] = xAxis.y;
    m[5] = yAxis.y;
    m[6] = zAxis.y;
    m[7] = 0;
    m[8] = xAxis.z;
    m[9] = yAxis.z;
    m[10] = zAxis.z;
    m[11] = 0;
    m[12] = ex;
    m[13] = ey;
    m[14] = ez;
    m[15] = 1;

    return new Matrix4(m);
  }
  // Return a new matrix with the inversion of this matrix.
  invert() {
    var l1,
      l2,
      l3,
      l4,
      l5,
      l6,
      l7,
      l8,
      l9,
      l10,
      l11,
      l12,
      l13,
      l14,
      l15,
      l16,
      l17,
      l18,
      l19,
      l20,
      l21,
      l22,
      l23,
      l24,
      l25,
      l26,
      l27,
      l28,
      l29,
      l30,
      l31,
      l32,
      l33,
      l34,
      l35,
      l36,
      l37,
      l38,
      l39,
      m;
    l1 = this.m[0];
    l2 = this.m[1];
    l3 = this.m[2];
    l4 = this.m[3];
    l5 = this.m[4];
    l6 = this.m[5];
    l7 = this.m[6];
    l8 = this.m[7];
    l9 = this.m[8];
    l10 = this.m[9];
    l11 = this.m[10];
    l12 = this.m[11];
    l13 = this.m[12];
    l14 = this.m[13];
    l15 = this.m[14];
    l16 = this.m[15];
    l17 = l11 * l16 - l12 * l15;
    l18 = l10 * l16 - l12 * l14;
    l19 = l10 * l15 - l11 * l14;
    l20 = l9 * l16 - l12 * l13;
    l21 = l9 * l15 - l11 * l13;
    l22 = l9 * l14 - l10 * l13;
    l23 = l6 * l17 - l7 * l18 + l8 * l19;
    l24 = -(l5 * l17 - l7 * l20 + l8 * l21);
    l25 = l5 * l18 - l6 * l20 + l8 * l22;
    l26 = -(l5 * l19 - l6 * l21 + l7 * l22);
    l27 = 1.0 / (l1 * l23 + l2 * l24 + l3 * l25 + l4 * l26);
    l28 = l7 * l16 - l8 * l15;
    l29 = l6 * l16 - l8 * l14;
    l30 = l6 * l15 - l7 * l14;
    l31 = l5 * l16 - l8 * l13;
    l32 = l5 * l15 - l7 * l13;
    l33 = l5 * l14 - l6 * l13;
    l34 = l7 * l12 - l8 * l11;
    l35 = l6 * l12 - l8 * l10;
    l36 = l6 * l11 - l7 * l10;
    l37 = l5 * l12 - l8 * l9;
    l38 = l5 * l11 - l7 * l9;
    l39 = l5 * l10 - l6 * l9;

    m = new Float32Array(16);
    m[0] = l23 * l27;
    m[4] = l24 * l27;
    m[8] = l25 * l27;
    m[12] = l26 * l27;
    m[1] = -(l2 * l17 - l3 * l18 + l4 * l19) * l27;
    m[5] = (l1 * l17 - l3 * l20 + l4 * l21) * l27;
    m[9] = -(l1 * l18 - l2 * l20 + l4 * l22) * l27;
    m[13] = (l1 * l19 - l2 * l21 + l3 * l22) * l27;
    m[2] = (l2 * l28 - l3 * l29 + l4 * l30) * l27;
    m[6] = -(l1 * l28 - l3 * l31 + l4 * l32) * l27;
    m[10] = (l1 * l29 - l2 * l31 + l4 * l33) * l27;
    m[14] = -(l1 * l30 - l2 * l32 + l3 * l33) * l27;
    m[3] = -(l2 * l34 - l3 * l35 + l4 * l36) * l27;
    m[7] = (l1 * l34 - l3 * l37 + l4 * l38) * l27;
    m[11] = -(l1 * l35 - l2 * l37 + l4 * l39) * l27;
    m[15] = (l1 * l36 - l2 * l38 + l3 * l39) * l27;
    return new Matrix4(m);
  }
  multiply(other) {
    var m = new Float32Array(16);

    m[0] =
      this.m[0] * other.m[0] +
      this.m[1] * other.m[4] +
      this.m[2] * other.m[8] +
      this.m[3] * other.m[12];
    m[1] =
      this.m[0] * other.m[1] +
      this.m[1] * other.m[5] +
      this.m[2] * other.m[9] +
      this.m[3] * other.m[13];
    m[2] =
      this.m[0] * other.m[2] +
      this.m[1] * other.m[6] +
      this.m[2] * other.m[10] +
      this.m[3] * other.m[14];
    m[3] =
      this.m[0] * other.m[3] +
      this.m[1] * other.m[7] +
      this.m[2] * other.m[11] +
      this.m[3] * other.m[15];

    m[4] =
      this.m[4] * other.m[0] +
      this.m[5] * other.m[4] +
      this.m[6] * other.m[8] +
      this.m[7] * other.m[12];
    m[5] =
      this.m[4] * other.m[1] +
      this.m[5] * other.m[5] +
      this.m[6] * other.m[9] +
      this.m[7] * other.m[13];
    m[6] =
      this.m[4] * other.m[2] +
      this.m[5] * other.m[6] +
      this.m[6] * other.m[10] +
      this.m[7] * other.m[14];
    m[7] =
      this.m[4] * other.m[3] +
      this.m[5] * other.m[7] +
      this.m[6] * other.m[11] +
      this.m[7] * other.m[15];

    m[8] =
      this.m[8] * other.m[0] +
      this.m[9] * other.m[4] +
      this.m[10] * other.m[8] +
      this.m[11] * other.m[12];
    m[9] =
      this.m[8] * other.m[1] +
      this.m[9] * other.m[5] +
      this.m[10] * other.m[9] +
      this.m[11] * other.m[13];
    m[10] =
      this.m[8] * other.m[2] +
      this.m[9] * other.m[6] +
      this.m[10] * other.m[10] +
      this.m[11] * other.m[14];
    m[11] =
      this.m[8] * other.m[3] +
      this.m[9] * other.m[7] +
      this.m[10] * other.m[11] +
      this.m[11] * other.m[15];

    m[12] =
      this.m[12] * other.m[0] +
      this.m[13] * other.m[4] +
      this.m[14] * other.m[8] +
      this.m[15] * other.m[12];
    m[13] =
      this.m[12] * other.m[1] +
      this.m[13] * other.m[5] +
      this.m[14] * other.m[9] +
      this.m[15] * other.m[13];
    m[14] =
      this.m[12] * other.m[2] +
      this.m[13] * other.m[6] +
      this.m[14] * other.m[10] +
      this.m[15] * other.m[14];
    m[15] =
      this.m[12] * other.m[3] +
      this.m[13] * other.m[7] +
      this.m[14] * other.m[11] +
      this.m[15] * other.m[15];

    return new Matrix4(m);
  }
  translate(tx, ty, tz) {
    var m = new Float32Array(this.m);
    m[12] += tx;
    m[13] += ty;
    m[14] += tz;
    return new Matrix4(m);
  }
}

Matrix4.IDENTITY = new Matrix4();
