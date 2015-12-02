//// VECTORS AND MATRICES ///////////////////////////////////////////////

'use strict';

var Vec3 = function (x, y, z) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
    this.z = z === undefined ? 0 : z;
};

// Generate the zero vector.
Vec3.ZERO = new Vec3(0, 0, 0);

Vec3.up = function () {
    return new Vec3(0, 1.0, 0);
};

// Generate the dot product of two vectors.
Vec3.dot = function (a, b) {
    return (a.x * b.x + a.y * b.y + a.z * b.z);
};

// Generate the cross product of two vectors.
Vec3.cross = function (a, b) {
    return new Vec3(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    );
};

// Convert this vector to a string representation.
Vec3.prototype.toString = function () {
    return '[' + this.x + ', ' + this.y + ', ' + this.z + ']';
};

// Convert this vector to an array.
Vec3.prototype.toArray = function () {
    var array = [];
    array.push(this.x);
    array.push(this.y);
    array.push(this.z);
    return array;
};

// Calculate the length of this vector.
Vec3.prototype.getLength = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

// Create a new vector that is this vector, normalized.
Vec3.prototype.normalize = function () {
    var len, c;
    len = this.getLength();
    if (len === 0) {
        return this;
    }
    c = 1.0 / len;
    return new Vec3(this.x * c, this.y * c, this.z * c);
};

// Create a new vector that is the addition of this vector and the given vector.
Vec3.prototype.add = function (o) {
    return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z);
};

// Create a new vector that is the subtraction of this vector and the given vector.
Vec3.prototype.subtract = function (o) {
    return new Vec3(this.x - o.x, this.y - o.y, this.z - o.z);
};

// Transform the vector according to the matrix and return the result.
// A new vector is created, nothing is modified.
Vec3.prototype.transform = function (matrix4) {
    var x, y, z, w, matrix;

    matrix = matrix4;
    x = (this.x * matrix.m[0]) + (this.y * matrix.m[4]) + (this.z * matrix.m[8]) + matrix.m[12];
    y = (this.x * matrix.m[1]) + (this.y * matrix.m[5]) + (this.z * matrix.m[9]) + matrix.m[13];
    z = (this.x * matrix.m[2]) + (this.y * matrix.m[6]) + (this.z * matrix.m[10]) + matrix.m[14];
    w = (this.x * matrix.m[3]) + (this.y * matrix.m[7]) + (this.z * matrix.m[11]) + matrix.m[15];

    return new Vec3(x / w, y / w, z / w);
};

module.exports = Vec3;