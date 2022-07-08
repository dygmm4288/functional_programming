const add5 = function (a) {
    // 새로운 공간
    return a + 5;
};
const call = function (f) {
    // 새로운 공간
    return f();
};

/* 함수를 실행하는 괄호 */
console.log(add5(5));
console.log(
    call(function () {
        return 10;
    }),
);

console.log(1);

setTimeout(function () {
    console.log(3);
}, 1000);

console.log(2);

const add = function (a, b, callback) {
    setTimeout(function () {
        callback(a + b);
    }, 1000);
};
add(10, 5, function (r) {
    console.log(r);
});

const start = (f) => f(f);
const each = (arr, iter, i = 0) =>
    start((f) => iter(arr[i]) || (++i < arr.length && f(f)));

each([5, 2, 4, 1], function (v) {
    console.log(v);
});
