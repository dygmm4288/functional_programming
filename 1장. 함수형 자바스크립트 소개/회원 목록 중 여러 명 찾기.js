/* 절차지향적으로 작성된 코드 */

const users = [
    { id: 1, name: 'ID', age: 32 },
    { id: 2, name: 'HA', age: 25 },
    { id: 3, name: 'BJ', age: 32 },
    { id: 4, name: 'PJ', age: 28 },
    { id: 5, name: 'JE', age: 27 },
    { id: 6, name: 'JM', age: 32 },
    { id: 7, name: 'HI', age: 24 },
];

let temp_users = [];

for (let i = 0, len = users.length; i < len; i++) {
    if (users[i].age < 30) temp_users.push(users[i]);
}

console.log(temp_users);

let ages = [];
for (let i = 0, len = temp_users.length; i < len; i++) {
    ages.push(temp_users[i].age);
}
console.log(ages);

temp_users = [];
for (let i = 0, len = users.length; i < len; i++) {
    if (users[i].age >= 30) temp_users.push(users[i]);
}

let names = [];
for (let i = 0, len = temp_users.length; i < len; i++) {
    names.push(temp_users[i].name);
}
console.log({ names });

/* 
    함수형으로 리팩터링 

    filter함수는 항상 동일하게 동작하는 함수이다.  === 한 가지 로직을 가졌다.
*/
function filter(list, predicate) {
    const new_list = [];
    for (let i = 0, len = list.length; i < len; i++) {
        if (predicate(list[i])) new_list.push(list[i]);
    }
    return new_list;
}

const users_under_30 = filter(users, (user) => user.age < 30);
const users_over_30 = filter(users, (user) => user.age >= 30);

console.log(users_under_30, users_over_30);
function map(list, iteratee) {
    const new_list = [];
    for (let i = 0, len = list.length; i < len; i++) {
        new_list.push(iteratee(list[i]));
    }
    return new_list;
}

ages = map(users_under_30, (user) => user.age);
names = map(users_over_30, (user) => user.name);
console.log({ ages, names });
/* 
    한 함수의 결과 값을 다른 함수의 인자값으로 넘긴다
    (함수 중첩)
*/

ages = map(
    filter(users, (user) => user.age < 30),
    (user) => user.age,
);
names = map(
    filter(users, (user) => user.age >= 30),
    (user) => user.name,
);
console.log({ ages, names });

function log_length(value) {
    console.log(value.length);
    return value;
}

console.log(
    log_length(
        map(
            filter(users, (user) => user.age < 30),
            (user) => user.age,
        ),
    ),
);
console.log(
    log_length(
        map(
            filter(users, (user) => user.age >= 30),
            (user) => user.name,
        ),
    ),
);

/* b(binding)value */
function bvalue(key) {
    return function (obj) {
        return obj[key];
    };
}

console.log(bvalue('a')({ a: 'hi', b: 'hello' }));

console.log(
    log_length(
        map(
            filter(users, (user) => user.age < 30),
            bvalue('age'),
        ),
    ),
);
console.log(
    log_length(
        map(
            filter(users, (user) => user.age >= 30),
            bvalue('name'),
        ),
    ),
);

const bvalues = (key) => (list) => map(list, (v) => v[key]);
ages = bvalues('age');
names = bvalues('name');

const under_30 = (u) => u.age < 30;
const over_30 = (u) => u.age >= 30;

console.log(
    log_length(ages(filter(users, under_30))),
    log_length(names(filter(users, over_30))),
);

function bvalues(key) {
    const value = bvalue(key);
    return function (list) {
        return map(list, value);
    };
}
