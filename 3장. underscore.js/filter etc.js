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
