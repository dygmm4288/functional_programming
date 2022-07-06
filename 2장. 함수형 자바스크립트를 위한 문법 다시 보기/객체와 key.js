// 다양한 key/ value 정의 방법
const obj = { a: 1, b: 2 };
obj.c = 3;
obj['d'] = 4;
const e = 'e';
obj[e] = 5;
function f() {
    return 'f';
}
obj[f()] = 6;
console.log(obj);

// 띄어쓰기, 특수 문자, 숫자
// 띄어쓰기
const obj2 = { ' a a a': 1 };
obj2['b b b'] = 2;
console.log(obj2);
// 특수문자
const obj3 = { 'margin-top': 1 };
obj3['padding-bottom'] = 20;
console.log(obj3);

//숫자
const obj4 = { 1: 10 };
obj4[2] = 20;
console.log(obj4);

// 오류 -> const obj5 = {(true ? "a" : "b") : 1};
// {}안쪽의 key 영역에서는 코드를 실행할 수 없다
const obj6 = {};
obj6[true ? 'a' : 'b'] = 1;
console.log(obj6);
// []에서는 코드를 실행할 수 있다.
const obj5 = { [true ? 'a' : 'b']: 1 };
