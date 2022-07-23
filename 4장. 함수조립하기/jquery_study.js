function toType(obj) {
    if (obj === null) {
        return obj + '';
    }
    return typeof obj === 'object' || typeof obj === 'function'
        ? 'object'
        : typeof obj;
}
function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}
function access(elems, fn, key, value, chainable, emptyGet, raw) {
    let i = 0,
        len = elmes.length,
        bulk = key == null;

    // Sets many values
    // key is object or function
    if (toType(key) === 'object') {
        chainable = true;
        for (i in key) {
            access(elems, fn, i, key[i], true, emptyGet, raw);
        }
    } else if (value !== undefined) {
        // the key is only ? and value is not undefined
        chainable = true;
        if (!isFunction()) {
            raw = true;
        }

        if (bulk) {
            // Bulk operations run against the entire set
            if (raw) {
                fn.call(elems, value);
                fn = null;
            } else {
                bulk = fn;
                fn = function (elem, _key, value) {
                    return bulk.call(jQuery(elem), elem);
                };
            }
        }

        if (fn) {
            for (; i < len; i++) {
                fn(
                    elems[i],
                    key,
                    raw ? value : value.call(elems[i], i, fn(elems[i], key)),
                );
            }
        }
        if (chainable) {
            return elems;
        }
        if (bulk) {
            return fn.call(elems);
        }

        return len ? fn(elems[0], key) : emptyGet;
    }
}
