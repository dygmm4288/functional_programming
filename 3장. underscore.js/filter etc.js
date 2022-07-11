_ = {};
_.getLength = function (list) {
    return list == null ? void 0 : list.length;
};
_.isArrayLike = function (list) {
    const length = _.getLength(list);
    const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    return (
        typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
    );
};
_.isObject = function (obj) {
    const type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
};
_.keys = function (obj) {
    return _.isObject(obj) ? Object.keys(obj) : [];
};
function bloop(new_data, body) {
    return function (data, iter_predi) {
        const result = new_data(data);
        if (_.isArrayLike(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                body(iter_predi(data[i], i, data), result, data[i]);
            }
        } else {
            for (
                let i = 0, key = _.keys(data), len = key.length;
                i < len;
                i++
            ) {
                body(
                    iter_predi(data[key[i]], key[i], data),
                    result,
                    data[key[i]],
                );
            }
        }
        return result;
    };
}
_.identity = (v) => v;
_.idtt = _.identity;
_.array = () => [];
_.push_to = (val, obj) => {
    obj.push(val);
    return val;
};
_.noop = function () {};

_.map = bloop(_.array, _.push_to);
_.each = bloop(_.idtt, _.noop);

_.each({ id: 4, name: 'JH', age: 26 }, console.log);

const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
};

_.filter = function (list, predicate) {
    const result = [];
    _.each(list, (val, idx, data) => {
        if (predicate(val, idx, data)) result.push(val);
    });
    return result;
};
console.log(_.filter(obj, (val) => val > 2));
_.filter = bloop(_.array, function (bool, result, val) {
    if (bool) result.push(val);
});
console.log(_.filter(obj, (val) => val > 2));
console.log(_.filter([1, 2, 3, 4], (val) => val < 3));

_.values = function (list) {
    return _.map(list, _.idtt);
};
_.toArray = function (list) {
    return Array.isArray(list) ? list : _.values(list);
};
_.rest = function (list, num) {
    return _.toArray(list).slice(num || 1);
};
console.log('to Array test :', _.toArray(obj));
console.log('rest test:', _.rest([1, 2, 3]));
console.log(_.rest(obj));

_.reverse = function (list) {
    return _.toArray(list).reverse();
};

console.log(
    _.reverse([1, 2, 3]),
    _.reverse({}),
    _.reverse(null),
    _.rest(_.reverse({ 0: 1, 1: 10, 2: 100, 3: 1000, length: 4 })),
);

_.rester = function (func, num) {
    return function () {
        return func.apply(null, _.rest(arguments, num));
    };
};
function sum(a, b, c, d) {
    return (a || 0) + (b || 0) + (c || 0) + (d || 0);
}

console.log(
    _.rester(sum)(1, 2, 3, 4),
    _.rester(sum, 2)(1, 2, 3, 4),
    _.rester(sum, 3)(1, 2, 3, 4),
);

_.if = function (validator, func, alter) {
    return function () {
        return validator.apply(null, arguments)
            ? func.apply(null, arguments)
            : alter && alter.apply(null, arguments);
    };
};

function sub(a, b) {
    return a - b;
}
const sub2 = _.if(
    function (a, b) {
        return a >= b;
    },
    sub,
    function () {
        return new Error('a가 b보다 작습니다.');
    },
);

console.log(sub2(10, 5));
console.log(sub2(2, 5));

const diff = _.if(
    function (a, b) {
        return a >= b;
    },
    sub,
    function (a, b) {
        return sub(b, a);
    },
);

_.safety = _.with_validator = _.if;
console.log(diff(10, 5), diff(5, 10));

_.toArray2 = _.if(Array.isArray, _.idtt, _.values);
console.log(
    _.toArray2([1, 2, 3]),
    _.toArray2({ 0: 1, 1: 10, 2: 100, 3: 1000, length: 4 }),
);

_.constant = function (v) {
    return function () {
        return v;
    };
};

let square = _.safety(
    function (a) {
        return toString.call(a) == '[object Number]';
    },
    function (a) {
        return a * a;
    },
    _.constant(0),
);

console.log(square(5));
console.log(square('가나다'));

_.isNumber = function (a) {
    return toString.call(a) == '[object Number]';
};
square = _.safety(_.isNumber, (a) => a * a, _.constant(0));

console.log(square(5), square('가나다'));

_.push = function (obj, val) {
    obj.push(val);
    return obj;
};
_.filter = bloop(_.array, _.if(_.idtt, _.rester(_.push)));
console.log(
    _.filter([1, 2, 3, 4], function (val) {
        return val > 2;
    }),
);
console.log(
    _.filter([1, 2, 3, 4], function (val) {
        return val < 3;
    }),
);

_.reject = bloop(_.array, _.if(_.idtt, _.noop, _.rester(_.push)));

console.log(_.reject([1, 2, 3, 4], (val) => val > 2));

_.negate = function (func) {
    return function () {
        return !func.apply(null, arguments);
    };
};

_.reject = bloop(_.array, _.if(_.negate(_.idtt), _.rester(_.push)));

console.log(_.reject([1, 2, 3, 4], (val) => val < 3));

_.not = function (v) {
    return !v;
};
_.reject = bloop(_.array, _.if(_.not, _.rester(_.push)));
console.log(_.reject([1, 2, 3, 4], (val) => val < 3));

function bloop(new_data, body, stopper) {
    return function (data, iter_predi) {
        const result = new_data(data);
        let memo;
        if (_.isArrayLike(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                memo = iter_predi(data[i], i, data);
                if (!stopper) body(memo, result, data[i], i);
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

_.each = bloop(_.idtt, _.noop);
_.map = bloop(_.array, _.push_to);
_.filter = bloop(_.array, _.if(_.idtt, _.rester(_.push)));
_.reject = bloop(_.array, _.if(_.not, _.rester(_.push)));
console.log('insert stopper in bloop');
_.log = (v) => {
    console.log(v);
    return v;
};
_.each([1, 2, 3], (v) => console.log(v));
_.log(_.map([1, 2, 3], (v) => v * 2));
_.log(_.filter([1, 2, 3, 4], (val) => val < 3));
_.log(_.reject([1, 2, 3, 4], (val) => val < 3));

_.noop = function () {};
_.idtt = (v) => v;

_.find = bloop(
    _.noop, // new_data - 하나도 못 찾은 경우 undefined를 리턴하기 위해,
    function (bool, result, val) {
        return val;
    }, // body - stooper 조건에 부합한 경우 리턴할 값,
    _.idtt, // stopper - 참일 때 나가기 위해 memo의 값을 그대로 반환
);

_.log(_.find([1, 10, 100, 1000], (v) => v > 50));

const users = [
    { id: 2, name: 'ha', age: 25 },
    { id: 3, name: 'pj', age: 28 },
    { id: 4, name: 'je', age: 27 },
];
