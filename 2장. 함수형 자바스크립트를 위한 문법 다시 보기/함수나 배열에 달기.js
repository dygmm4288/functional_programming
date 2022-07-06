// 함수 = 객체 , 함수를 객체로 사용
function obj8() {}
obj8.a = 1;
obj8.b = 2;
console.log(obj8.a, obj8.b);

obj9.a = 1;
obj9.b = 2;
console.log(obj9.a + obj9.b);
function obj9() {}

// 배열에 숫자가 아닌 key 사용하기
const obj10 = [];
obj10.a = 1;
console.log(obj10, obj10.length);

// 배열에 숫자로 key 사용하기
const obj11 = [];
obj11[0] = 1;
obj11[1] = 2;
console.log(obj11, obj11.length);

const obj12 = [];
obj12.length = 5;
console.log(obj12);
const obj13 = [1, 2];
obj13[5] = 1;
console.log(obj13);
obj13[6] = 1;
obj13[7] = 1;
console.log(obj13.length, obj13);

console.log(obj13['len' + 'gth']);
obj13[9] = 1;
obj13.push(14);
console.log(obj13);
