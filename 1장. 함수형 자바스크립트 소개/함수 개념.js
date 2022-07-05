/* 
    * 일급 함수 *

    '일급' : 값으로 다룰 수 있다.
    조건
    1. 변수에 담을 수 있다.
    2. 함수나 메서드의 인자로 넘길 수 잇다.
    3. 함수나 메서드에서 리턴할 수 있다.

    자바스크립트 상 모든 객체 = 일급 객체, 함수 = 객체, 함수 = 일급 객체

    일급 함수
    조건
    1. 아무 때나(런타임에서도) 선언이 가능하다.
    2. 익명으로 선언할 수 있다.
    3. 익명으로 선언한 함수도 함수나 메서드의 인자로 넘길 수 있다.

    * 클로저 , 스코프 *
    스코프 : 변수를 어디에서 어떻게 찾을지를 정한 규칙. 함수 단위의 변수 참조에 대한 것
    함수는 변수 참조 범위를 결정하는 중요한 기준이 된다. 함수가 중첩되어 있다면 스코프들 역시 중첩되어 생겨난다.
    
    클로저는 자신이 생성될 때의 환경을 기억하는 함수이다. 
    => 클로저는 자신이 생성될 때의 스코프에서 알 수 있었던 변수를 기억하는 함수다.

    * 고차 함수 *
    고차함수 : 함수를 다루는 함수를 말한다.
    함수를 다룬다 === 
    1. 함수를 인자로 받아 대신 실행하는 함수
    2. 함수를 리턴하는 함수
    3. 함수를 인자로 받아서 또 다른 함수를 리턴하는 함수

    
*/

// 고차 함수
function callWith(val1) {
    return function (val2, func) {
        return func(val1, val2);
    };
}
const _ = {};
_.map = function (list, iteratee) {
    const new_list = [];
    for (let i = 0, len = list.length; i < len; i++) {
        new_list.push(iteratee(list[i], i, list));
    }
    return new_list;
};
_.find = function (list, predicate) {
    for (let i = 0, len = list.length; i < len; i++) {
        if (predicate(list[i], i, list)) return list[i];
    }
    return null;
};
_.findIndex = function (list, predicate) {
    for (let i = 0, len = list.length; i < len; i++) {
        if (predicate(list[i], i, list)) return i;
    }
    return -1;
};
_.identity = (a) => a;
const not = (v) => !v;
const beq = (a) => (b) => a === b;
_.some = function (list, predi) {
    return not(not(_.find(list, predi)));
};
_.every = function (list, predi) {
    return not(beq(-1)(_.findIndex(list, predi)));
};
_.filter = function (list, predicate) {
    const new_list = [];
    for (let i = 0, len = list.length; i < len; i++) {
        if (predicate(list[i], i, list)) new_list.push(list[i]);
    }
    return new_list;
};
console.log(callWith([1, 2, 3])((v) => v * 10, _.map));

/* 
    function callWith([1,2,3]) {
        return function (v => v * 10, _.map) {
            return _.map([1,2,3],v=> v * 10)
        }
    }
*/
_.get = function (list, idx) {
    return list[idx];
};

const callWithUsers = callWith([
    { id: 2, name: 'HA', age: 25 },
    { id: 4, name: 'PJ', age: 28 },
    { id: 6, name: 'JE', age: 27 },
]);

console.log(callWithUsers(2, _.get));
console.log(callWithUsers((user) => user.age > 25, _.find));
console.log(callWithUsers((user) => user.age > 25, _.filter));
console.log(callWithUsers((user) => user.age > 30, _.some));
console.log(callWithUsers(_.identity, _.some));
console.log(callWithUsers((user) => user.age > 30, _.every));
console.log(callWithUsers((user) => user.age > 20, _.every));
/*
    function callWith([1,2,3]) {
        return function (user => user.age > 25,_.some) {
            return _.some([1,2,3],user.age > 25)
        } 
    }
*/

// ========= 부분 적용 ==========
Function.prototype.partial = function () {
    const fn = this,
        _args = arguments;
    return function () {
        let args = Array.prototype.slice.call(_args); // 리턴된 함수가 실행될 때마다 복사하여 원본 지키기
        let arg = 0;
        for (let i = 0; i < args.length && arg < arguments.length; i++) {
            if (args[i] === undefined) args[i] = arguments[arg++];
        }
        return fn.apply(this, args);
    };
};

function abc(a, b, c) {
    console.log(a, b, c);
}
const ac = abc.partial(undefined, 'b', undefined);
ac('a', 'c');

function add() {
    let result = 0;
    for (let i = 0; i < arguments.length; i++) {
        result += arguments[i];
    }
    return result;
}

const add3 = add.partial(undefined, undefined, 3, undefined, undefined);
console.log(add3(1, 2, 4, 5));
console.log(add3(50, 50, 50, 50));
console.log(add3(10, 20, 30, 40));
llll;
