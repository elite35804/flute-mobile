import numeral from 'numeral';
import { defaultTo, isNil } from 'lodash';

function padZero(fmt, pad) {
    if (isNil(pad)) {
        return fmt;
    }
    let newfmt = defaultTo(fmt, '');
    for (let i = 0; i < pad || 0; i += 1) {
        newfmt += '0';
    }
    return newfmt;
}

function format(num, fmt, decimal) {
    return numeral(num).format(padZero(fmt, decimal));
}

export const formatCurrencyUnd = function (price, format = '00') {
    const decimals = format.length;
    const dec = Math.floor(price);
    const und = (Number(Math.round(price + 'e' + decimals) + 'e-' + decimals) - dec) * 100;
    return numeral(und).format(format);
};

export const floor = function (value, place) {
    const pow = Math.pow(10, place || 0); // eslint-disable-line
    const val = Math.floor(value * pow) / pow;
    return val.toFixed(place);
};

export const formatCurrencyDec = function (price, format = '$0,0') {
    const nprice = numeral(floor(price, 0));
    return nprice.format(format);
};

export const pad = (num, size) => {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

export { format };
