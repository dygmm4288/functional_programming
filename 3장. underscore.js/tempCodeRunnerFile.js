_.filter = function (list, predicate) {
    const result = [];
    _.each(list, (val, idx, data) => {
        if (predicate(val, idx, data)) result.push(val);
    });
    return result;
};
console.log(_.filter(obj, (val) => val > 2));