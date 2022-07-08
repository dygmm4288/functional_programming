// 1. {}
const d1 = { name: 'PJ', age: 25 };
// 2. []
const d2 = [1, 2, 3];
// 3. arguments -> 사실 arguments도 유사배열
const d3 = (function () {
    return arguments;
})(1, 2, 3);
// 4. ArrayLike
const d4 = { length: 3 };
(d4[0] = 1), (d4[1] = 2), (d4[2] = 3);
const d5 = 'hi';

/* ArrayLike */
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
function getLength(list) {
    return list == null ? void 0 : list.length; // void 0의 결과는 undefined;
}
const isArrayLike = function (list) {
    const length = getLength(list);
    return (
        typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
    );
};

const _ = {};

_.map = function (data, iteratee) {
    const new_list = [];
    if (isArrayLike(data)) {
        // ArrayLike일 경우
        for (let i = 0, len = data.length; i < len; i++) {
            new_list.push(iteratee(data[i], i, data));
        }
    } else {
        for (const key in data) {
            // 객체일 경우
            if (data.hasOwnProperty(key))
                new_list.push(iteratee(data[key], key, data));
        }
    }
    return new_list;
};

console.log(
    _.map([1, 2, 3], function (v) {
        return v * 2;
    }),
);

console.log(
    _.map({ a: 3, b: 2, c: 1 }, function (v) {
        return v * 2;
    }),
);

console.log(
    _.map(
        [1, 2, 3],
        function (v) {
            return v * this;
        }.bind(5),
    ),
);

_.identity = function (v) {
    return v;
};
_.idtt = _.identity;
_.values = function (list) {
    return _.map(list, _.identity);
};
_.args0 = _.identity;
_.args1 = function (a, b) {
    return b;
};
_.keys = function (list) {
    return _.map(list, _.args1);
};
console.log(_.values({ id: 5, name: 'JE', age: 27 }));
console.log(_.keys({ id: 6, name: 'JH', age: 26 }));
console.log(_.keys([3, 2, 1]));

_.each = function (data, iteratee) {
    if (isArrayLike(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
            iteratee(data[i], i, data);
        }
    } else {
        for (const key in data) {
            if (data.hasOwnProperty(key)) iteratee(data[key], key, data);
        }
    }
    return data;
};

_.each([1, 2, 3], console.log);
_.each({ id: 5, name: 'JE', age: 27 }, console.log);

function bloop(new_data, body) {
    return function (data, iteratee) {
        const result = new_data(data);
        if (isArrayLike(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                body(iteratee(data[i], i, data), result);
            }
        } else {
            for (const key in data) {
                if (data.hasOwnProperty(key))
                    body(iteratee(data[key], key, data), result);
            }
        }
        return result;
    };
}

_.map = bloop(
    function () {
        return [];
    },
    function (val, obj) {
        return obj.push(val);
    },
);
_.each = bloop(
    function (v) {
        return v;
    },
    function () {},
);

bloop(
    function (v) {
        return v;
    },
    function () {},
)([5, 6, 7], function (v) {
    console.log(v);
});

_.array = function () {
    return [];
};
_.push_to = function (val, obj) {
    obj.push(val);
    return val;
};
_.noop = function () {};
_.map = bloop(_.array, _.push_to);
_.each = bloop(_.identity, _noop);
