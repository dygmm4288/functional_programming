// 자바스크립트에서는 기본 객체의 메서드나 프로퍼티도 지울 수 잇다.
const obj = { a: 1, b: 2, c: 3 };
delete obj.a;
delete obj['b'];
delete obj['C'.toLowerCase()];

console.log(obj);

delete Array.prototype.push;
const arr1 = [1, 2, 3];
// arr1.push(4); -> array.push is not a function
