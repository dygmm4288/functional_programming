const users = [
    { id: 1, name: 'ID', age: 32 },
    { id: 2, name: 'HA', age: 25 },
    { id: 3, name: 'BJ', age: 32 },
    { id: 4, name: 'PJ', age: 28 },
    { id: 5, name: 'JE', age: 27 },
    { id: 6, name: 'JM', age: 32 },
    { id: 7, name: 'HI', age: 24 },
];

function find(key, list, value) {
    for (let i = 0, len = list.length; i < len; i++) {
        if (list[i][key] === value) return list[i];
    }
    return null;
}
// ========================
function User(id, name, age) {
    this.getId = function () {
        return id;
    };
    this.getName = function () {
        return name;
    };
    this.getAge = function () {
        return age;
    };
}
const users2 = users.map(({ id, name, age }) => {
    return new User(id, name, age);
});

function find(list, predicate) {
    for (let i = 0, len = list.length; i < len; i++) {
        if (predicate(list[i])) return list[i];
    }
    return null;
}

console.log(find(users2, (u) => u.getAge() == 25).getName());
console.log(find(users, (u) => u.name.indexOf('P')));
console.log(find(users2, (u) => u.age === 32 && u.name === 'JM'));
console.log(find(users2, (u) => u.getAge() < 30).getName());

// ========================

function bmatch1(key, val) {
    return function (obj) {
        return obj[key] === val;
    };
}

console.log(find(users, bmatch1('id', 1)));
console.log(find(users, bmatch1('name', 'HI')));
console.log(find(users, bmatch1('age', 27)));

function object(key, val) {
    const obj = {};
    obj[key] = val;
    return obj;
}
function match(obj, obj2) {
    for (const key in obj2) {
        if (obj[key] !== obj2[key]) return false;
    }
    return true;
}
function bmatch(obj2, val) {
    if (arguments.length == 2) obj2 = object(obj2, val);
    return function (obj) {
        return match(obj, obj2);
    };
}

console.log(
    match(find(users, bmatch('id', 3), find(users, bmatch('name', 'BJ')))),
);
console.log(find(users, (u) => u.age === 32 && u.name === 'JM'));
console.log(find(users, bmatch({ age: 32, name: 'JM' })));

function findIndex(list, predicate) {
    for (let i = 0, len = list.length; i < len; i++) {
        if (predicate(list[i])) return i;
    }
    return -1;
}

console.log(findIndex(users, bmatch({ name: 'JM', age: 32 })));
console.log(findIndex(users, bmatch({ age: 36 })));

// ========= 고차 함수 ===============

const _ = {};
_.map = function (list, iteratee) {
    const new_list = [];
    for (let i = 0, len = list.length; i < len; i++) {
        new_list.push(iteratee(list[i], i, list));
    }
    return new_list;
};
_.filter = function (list, predicate) {
    const new_list = [];
    for (let i = 0, len = list.length; i < len; i++) {
        if (predicate(list[i], i, list)) new_list.push(list[i]);
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

console.log(_.filter([1, 2, 3, 4], (val, idx) => idx > 1));
console.log(_.filter([1, 2, 3, 4], (val, idx) => idx % 2 === 0));

// ========= function identity(v) {return v;} ==========

_.identity = function (v) {
    return v;
};
let a = 10;
console.log(_.identity(a));

console.log(_.filter([true, 0, 10, 'a', false, null, 'false'], _.identity));

// ========= some, every ==========
_.some = (list) => !!_.find(list, _.identity); // 하나라도 긍정적인 답이 있으면 true or false
_.every = (list) => _.filter(list, _.identity).length === list.length; // 모두 긍정적인 값이어야 true

// ========= 연산자 대신 함수로 ==========

function not(v) {
    return !v;
}
function beq(a) {
    return function (b) {
        return a === b;
    };
}
_.every = function (list) {
    return beq(-1)(_.findIndex(list, not));
};
console.log(_.some([0, null, 2]));
console.log(_.some([0, null, false]));
console.log(_.every([0, null, 2]));
console.log(_.every([{}, true, 2]));

function positive(list) {
    return _.find(list, _.identity);
} // 하나라도 긍정이면 list중 하나 아니면 null
function negativeIndex(list) {
    return _.findIndex(list, not);
} // 부정이 하나라도 있으면 i 반환, 아니면 -1 반환

_.some = (list) => not(not(positive(list))); // 하나라도 긍정적인 답이 있으면 True 아니면 false
_.every = (list) => beq(-1)(negativeIndex(list)); // 부정이 하나라도 있으면 i반환 후 -1과 비교 없으면 -1 반환 후 -1과 비교

// ========= 함수 합성 ==========
// _.compose는 오른쪽의 함수의 결과를 왼쪽 함수에게 전달한다.
_.compose = function () {
    const args = arguments;
    const start = arguments.length - 1;
    return function () {
        let i = start;
        let result = args[start].apply(this, arguments);
        while (i--) result = args[i].call(this, result);
        return result;
    };
};

const greet = function (name) {
    return 'hi:' + name;
};
const exclaim = function (statement) {
    return statement.toUpperCase() + '!';
};
const welcome = _.compose(greet, exclaim);
console.log(welcome('moe'));

_.some = _.compose(not, not, positive);
_.every = _.compose(beq(-1), negativeIndex);
