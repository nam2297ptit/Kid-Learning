Array.prototype.sortBy = function(p) {
    return this.slice(0).sort(function(a, b) {
        return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0;
    });
};

Array.prototype.sortBy = function(p) {
    return this.slice(0).sort(function(a, b) {
        return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0;
    });
};

const moment = require("moment");

function generateCountDownDate(type) {
    let today = moment();
    if (type === "keno") {
        let today_finish = moment();
        today_finish.set("hour", 22);
        today_finish.set("minute", 0);
        today_finish.set("second", 0);
        if (today.diff(today_finish) > 0) {
            let tommorow_start = moment();
            tommorow_start.add(1, "days");
            tommorow_start.set("hour", 6);
            tommorow_start.set("minute", 0);
            tommorow_start.set("second", 0);
            return tommorow_start;
        } else if (today.hours() < 6) {
            let tommorow_start = moment();
            tommorow_start.set("hour", 6);
            tommorow_start.set("minute", 0);
            tommorow_start.set("second", 0);
            return tommorow_start;
        } else {
            let minute = today.minutes();
            let second = today.seconds();
            if (minute % 10 === 0 && second === 0) {
                return today;
            } else {
                do {
                    minute++;
                } while (minute % 10 !== 0);
                today.add(minute - today.minutes(), "minutes");
                today.subtract(second, "seconds");
                return today;
            }
        }
    }

    if (today.get("hour") > 18) {
        today.add(1, "days");
    } else if (today.get("hour") === 18) {
        if (today.get("minute") > 0) {
            today.add(1, "days");
        } else {
            if (today.get("second") > 0) {
                today.add(1, "days");
            }
        }
    }
    let day = today.day();
    today.set("hour", 18);
    today.set("minute", 0);
    today.set("second", 0);
    if (type === "mega645") {
        if (![3, 5, 7].includes(day)) {
            // 4, 6, CN
            if (day < 3) today = today.add(3 - day, "days");
            else if (day < 5) today = today.add(5 - day, "days");
            else if (day < 7) today = today.add(7 - day, "days");
            return today;
        }
        return today;
    } else if (type === "power655") {
        if (![2, 4, 6].includes(day)) {
            // 3, 5, 7
            if (day > 6) today = today.add(3, "days");
            else if (day < 4) today = today.add(4 - day, "days");
            else if (day < 6) today = today.add(6 - day, "days");
            return today;
        }
        return today;
    } else if (type === "max3d") {
        if (![1, 3, 5].includes(day)) {
            // 2, 4, 6
            if (day > 5) today = today.add(8 - day, "days");
            else if (day < 3) today = today.add(3 - day, "days");
            else if (day < 5) today = today.add(5 - day, "days");
            return today;
        }
        return today;
    } else if (type === "max4d") {
        if (![2, 4, 6].includes(day)) {
            // 3, 5, 7
            if (day > 6) today = today.add(3, "days");
            else if (day < 4) today = today.add(4 - day, "days");
            else if (day < 6) today = today.add(6 - day, "days");
            return today;
        }
        return today;
    }
}

Array.prototype.numEmpty = function() {
    let empty = 0;
    this.forEach(value => {
        if (isEmpty(value)) empty++;
    });
    return empty;
};

String.prototype.toUpperFisrtChacracter = function() {
    return this.charAt(0).toUpperCase() + this.substring(1);
};

Number.prototype.getMoneyFormat = function(n, x) {
    var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&.");
};

Number.prototype.getResultFormat = function() {
    return this > 9 ? this : "0" + this;
};

String.prototype.getDateFormat = function() {
    return moment(new Date(this)).format("DD/MM/YYYY");
};

function getResultFormat(result, type) {
    if (type === "max3d" || type === "max4d") return result;
    if (typeof result === "string") return result;
    return result > 9 ? result : "0" + result;
}

function getDateFormat(dateString, formatStringInput, formatStringOutput) {
    if (formatStringInput)
        return moment(dateString, formatStringInput).format(
            formatStringOutput ? formatStringOutput : "DD-MM-YYYY",
        );
    return moment(dateString).format(formatStringOutput ? formatStringOutput : "DD-MM-YYYY");
}

function randomString(length) {
    if (length === undefined) length = 20;
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function isEmpty(data) {
    if (data === "" || data === null || data === undefined) return true;
    if (Array.isArray(data)) {
        if (data.length === 0) return true;
    }
    if (typeof data === "object") {
        for (let key in data) {
            if (data.hasOwnProperty(key)) return false;
        }
        return true;
    }
    return false;
}

function copyState(state) {
    return JSON.parse(JSON.stringify(state));
}

function getHashSafe() {
    let hash = window.location.hash;
    try {
        hash = parseInt(hash.replace("#", ""));
        if (isNaN(hash)) hash = 1;
        if (hash < 0) hash = 1;
    } catch (e) {
        hash = 1;
    }
    return hash;
}

function returnWhenThisNull(data, dataWhenNull) {
    return isEmpty(data) ? dataWhenNull : data;
}

function getCartDataSafe() {
    try {
        let cartData = JSON.parse(localStorage.getItem("cart"));
        if (isEmpty(cartData)) return [];
        return cartData;
    } catch (e) {
        return [];
    }
}

function setCartDataSafe(data) {
    try {
        localStorage.setItem("cart", JSON.stringify(data));
        return true;
    } catch (e) {
        return false;
    }
}

function pushCartDataSafe(data) {
    try {
        let cartData = getCartDataSafe();
        cartData.push(data);
        setCartDataSafe(cartData);
        return true;
    } catch (e) {
        return false;
    }
}

function popCartDataSafe(index) {
    try {
        let cartData = getCartDataSafe();
        cartData.splice(index, 1);
        setCartDataSafe(cartData);
        return true;
    } catch (e) {
        return false;
    }
}

function resetCartData() {
    localStorage.setItem("cart", JSON.stringify([]));
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function getTokenSafe() {
    try {
        let token = JSON.parse(localStorage.getItem("userInfo")).authToken;
        return token;
    } catch (e) {
        return "";
    }
}

module.exports = {
    validateEmail: validateEmail,
    generateCountDownDate: generateCountDownDate,
    copyState: copyState,
    randomString: randomString,
    getDateFormat: getDateFormat,
    isEmpty: isEmpty,
    getHashSafe: getHashSafe,
    getCartDataSafe: getCartDataSafe,
    pushCartDataSafe: pushCartDataSafe,
    popCartDataSafe: popCartDataSafe,
    resetCartData: resetCartData,
    returnWhenThisNull: returnWhenThisNull,
    getResultFormat: getResultFormat,

    alert: alert,

    getTokenSafe: getTokenSafe,
};
