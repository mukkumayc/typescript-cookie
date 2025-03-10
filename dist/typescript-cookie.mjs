/*! typescript-cookie v1.0.4 | MIT */
var index = /*#__PURE__*/Object.freeze({
    __proto__: null
});

const encodeName = (name) => encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape);
const encodeValue = (value) => {
    return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
};
const decodeName = decodeURIComponent;
const decodeValue = (value) => {
    if (value[0] === '"') {
        value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
};

function stringifyAttributes(attributes) {
    // Copy incoming attributes as to not alter the original object..
    attributes = Object.assign({}, attributes);
    if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires != null) {
        attributes.expires = attributes.expires.toUTCString();
    }
    return (Object.entries(attributes)
        .filter(([key, value]) => value != null && value !== false)
        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        .map(([key, value]) => value === true ? `; ${key}` : `; ${key}=${value.split(';')[0]}`)
        .join(''));
}
function get(name, decodeValue, decodeName) {
    const scan = /(?:^|; )([^=]*)=([^;]*)/g;
    const jar = {};
    let match;
    while ((match = scan.exec(document.cookie)) != null) {
        try {
            const found = decodeName(match[1]);
            jar[found] = decodeValue(match[2], found);
            if (name === found) {
                break;
            }
        }
        catch (e) { }
    }
    return name != null ? jar[name] : jar;
}
const DEFAULT_CODEC = Object.freeze({
    decodeName: decodeName,
    decodeValue: decodeValue,
    encodeName: encodeName,
    encodeValue: encodeValue
});
const DEFAULT_ATTRIBUTES = Object.freeze({
    path: '/'
});
function setCookie(name, value, attributes = DEFAULT_ATTRIBUTES, { encodeValue: encodeValue$1 = encodeValue, encodeName: encodeName$1 = encodeName } = {}) {
    return (document.cookie = `${encodeName$1(name)}=${encodeValue$1(value, name)}${stringifyAttributes(attributes)}`);
}
function getCookie(name, { decodeValue: decodeValue$1 = decodeValue, decodeName: decodeName$1 = decodeName } = {}) {
    return get(name, decodeValue$1, decodeName$1);
}
function getCookies({ decodeValue: decodeValue$1 = decodeValue, decodeName: decodeName$1 = decodeName } = {}) {
    return get(undefined, decodeValue$1, decodeName$1);
}
function removeCookie(name, attributes = DEFAULT_ATTRIBUTES) {
    setCookie(name, '', Object.assign({}, attributes, {
        expires: -1
    }));
}

function init(converter, defaultAttributes) {
    const api = {
        set: function (name, value, attributes) {
            return setCookie(name, value, Object.assign({}, this.attributes, attributes), {
                encodeValue: this.converter.write
            });
        },
        get: function (name) {
            if (arguments.length === 0) {
                return getCookies(this.converter.read);
            }
            if (name == null) {
                return;
            }
            return getCookie(name, this.converter.read);
        },
        remove: function (name, attributes) {
            removeCookie(name, Object.assign({}, this.attributes, attributes));
        },
        withAttributes: function (attributes) {
            return init(this.converter, Object.assign({}, this.attributes, attributes));
        },
        withConverter: function (converter) {
            return init(Object.assign({}, this.converter, converter), this.attributes);
        }
    };
    const config = {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
    };
    return Object.create(api, config);
}
var compat = init({ read: DEFAULT_CODEC.decodeValue, write: DEFAULT_CODEC.encodeValue }, DEFAULT_ATTRIBUTES);

export { compat as Cookies, DEFAULT_ATTRIBUTES, DEFAULT_CODEC, index as Types, getCookie, getCookies, removeCookie, setCookie };
