const _ = {};
_.getLength = (list) => {
    return list === null ? void 0 : list.length;
};
_.isArrayLike = (list) => {
    const length = _.getLength(list);
    const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    return (
        typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
    );
};
_.isObject = (obj) => {
    const type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
};
_.keys = (obj) => {
    return _.isObject(obj) ? Object.keys(obj) : [];
};

function bloop(new_data, body, stopper) {
    return function (data, iter_predi) {
        const result = new_data(data);
        iter_predi = iter_predi || _.idtt;
        let memo;
        if (_.isArrayLike(data)) {
            // 배열 혹은 유사배열일 경우
            for (let i = 0, len = data.length; i < len; i++) {
                memo = iter_predi(data[i], i, data);
                if (!stopper) body(memo, result, data[i], i);
                // 결과를 재료로 사용하기 위해 변수에 담기
                else if (stopper(memo)) return body(memo, result, data[i], i);
            }
        } else {
            for (
                let i = 0, keys = _.keys(data), len = keys.length;
                i < len;
                i++
            ) {
                memo = iter_predi(data[keys[i]], keys[i], data);
                if (!stopper) body(memo, result, data[keys[i]], keys[i]);
                else if (stopper(memo))
                    return body(memo, result, data[keys[i]], keys[i]);
            }
        }
        return result;
    };
}

_.array = () => [];
_.push_to = (val, obj) => {
    // bloop 상 body(memo,result,data[i],i) 자리에 들어가는 함수
    obj.push(val);
    return val;
};
_.map = bloop(_.array, _.push_to);
//console.log(_.map([1, 2, 3, 4], (v) => v * 2));

_.noop = () => {};
_.identity = (v) => {
    return v;
};
_.idtt = _.identity;
_.each = bloop(_.identity, _.noop);
/* console.log(_.each({ 1: 'a', 2: 'b', 3: 'c', length: 4 }, console.log));
console.log(_.each([1, 2, 3, 4], console.log));
console.log(_.each({ id: 1, name: 'jh', age: 26 }, console.log)); */
_.values = (list) => _.map(list, _.idtt);
_.toArray = (list) => (Array.isArray(list) ? list : _.values(list));
_.rest = function (list, num) {
    return _.toArray(list).slice(num || 1);
};
// 리턴된 함수가 실행되면 _.rest를 이용해 num만큼 앞에서부터 받은 인자를 제거한 후, 받아두었던 func에게 전달
_.rester = function (func, num) {
    return function () {
        return func.apply(null, _.rest(arguments, num));
    };
};
// 인자를 validator로 넘긴 후 참이 나오면 func 실행 아니면 alter 실행
_.if = (validator, func, alter) => {
    return function () {
        return validator.apply(null, arguments)
            ? func.apply(null, arguments)
            : alter && alter.apply(null, arguments);
    };
};
_.push = (obj, val) => {
    obj.push(val);
    return val;
};
_.filter = bloop(_.array, _.if(_.idtt, _.rester(_.push)));
console.log(_.filter([1, 2, 3, 4], (val) => val > 2));

//_.if 는 bloop 상 body에 들어가는 함수
// body(memo,result,data[i],i)
// filter는 결과가 참이면 앞에 결과 잘라먹어야됨
// _.if의 인자로는 memo,result,data[i],i가 들어오기때문에
// validator(memo,result,data[i],i) -> memo의 값이 참이면
// func(memo,result,data[i],i) ->를 실행하는데
// func는 지금 _.rester함수
// _.rester함수에 의해서 _.push(result,data[i])가 들어가는 상황

_.find = bloop(
    _.noop,
    function (bool, result, val) {
        // body - stopper 조건에 부합한 경우 리턴할 값
        return val;
    },
    _.idtt,
);
// _.find(data,iter_predi)
// memo <- iter_predi(data[i],i,i) === v => v > 10
// if stopper(memo) => true 일경우 return body(memo,result,data[i],i) 실행
console.log(_.find([1, 10, 100, 1000], (v) => v > 10));

const users = [
    { id: 2, name: 'ha', age: 25 },
    { id: 3, name: 'pj', age: 28 },
    { id: 4, name: 'je', age: 27 },
];
// 처음으로 조건에 부합하는 사람 찾기
console.log(_.find(users, (user) => user.age > 26));
// 조건에 없는 사람이 있을 경우 undefined 리턴 -> _.noop
console.log(_.find(users, (user) => user.age < 18));

_.find = bloop(_.noop, _.rester(_.idtt, 2), _.idtt);

console.log(_.find(users, (user) => user.age > 26));
console.log(_.find(users, (user) => user.age < 18));
_.constant = (v) => () => v;
_.findIndex = bloop(_.constant(-1), _.rester(_.idtt, 3), _.idtt);
console.log(_.findIndex(users, (user) => user.age > 2));
console.log(_.findIndex(users, (user) => user.age > 25));
console.log(_.findIndex(users, (user) => user.id === 4));
console.log(
    _.findIndex(
        { id: 4, name: 'pj', age: 28 },
        (val) => typeof val === 'function',
    ),
);

// body(memo,result,data[i],i)
// _.some => predicate가 한번이라도 참을 리턴하면 true를 모두 거짓이라면 false
_.some = bloop(_.constant(false), _.constant(true), _.idtt);
// _.every-> 한번이라도 거짓을 만나면 false 모두 참이라면 true
_.not = (v) => !v;
_.every = bloop(_.constant(true), _.constant(false), _.not);
console.log(_.every([false, null, true, undefined], _.not));
console.log(_.every([function () {}, {}, [], {}], _.isObject));

_.reduce = function (data, iteratee, memo) {
    _.each(data, function (val, idx, data) {
        memo = iteratee(memo, val, idx, data);
    });
    return memo;
};

function bloop(new_data, body, stopper, is_reduce) {
    return function (data, iter_predi, opt1) {
        const result = new_data(data);
        let memo = is_reduce ? opt1 : undefined;
        iter_predi = iter_predi || _.idtt;
        if (_.isArrayLike(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                memo = is_reduce
                    ? iter_predi(memo, data[i], i, data)
                    : iter_predi(data[i], i, data);
                if (!stopper) body(memo, result, data[i], i);
                else if (stopper(memo)) return body(memo, result, data[i], i);
            }
        } else {
            for (
                let i = 0, keys = _.keys(data), len = keys.length;
                i < len;
                i++
            ) {
                memo = is_reduce
                    ? iter_predi(memo, data[keys[i]], keys[i], i)
                    : iter_predi(data[keys[i]], keys[i], i);
                if (!stopper) body(memo, result, data[i], i);
                else if (stopper(memo)) return body(memo, result, data[i], i);
            }
        }
        return is_reduce ? memo : result;
    };
}

_.reduce = bloop(_.noop, _.noop, undefined, true);

console.log(
    _.reduce(
        [1, 2, 3],
        function (memo, val) {
            return memo + val;
        },
        0,
    ),
);

console.log(
    _.reduce(
        users,
        function (names, user) {
            if (user.age > 20) names.push(user.name);
            return names;
        },
        [],
    ),
);
