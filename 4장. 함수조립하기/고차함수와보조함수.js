const _ = {};
// 한 번만 실행하는 함수
_.once = function (func) {
    let flag, result;
    return function () {
        if (flag) return result;
        flag = true;
        return (result = func.apply(this, arguments));
    };
};

const a = _.once(function () {
    console.log('A');
    return 'B';
});
console.log(a());
console.log(a());

// 다시 물어 보지 않는 함수
function skip(body) {
    let yes;
    return function () {
        return yes || (yes = body.apply(null, arguments));
    };
}
// 앞서 받은 인자 혹은 상황을 변경해 나가는 경우
function idMaker(start) {
    return function () {
        return ++start;
    };
}

const messageCid = idMaker(0);

console.log(messageCid(), messageCid());
const postCid = idMaker(11);
console.log(postCid(), postCid(), postCid(), postCid());
