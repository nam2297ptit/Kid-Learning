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

function returnThisWhenNull(data, dataWhenNull) {
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

function getTokenSafe() {
    try {
        let token = JSON.parse(localStorage.getItem("userInfo")).authToken;
        return token;
    } catch (e) {
        return "";
    }
}

module.exports = {
    copyState: copyState,
    randomString: randomString,
    isEmpty: isEmpty,
    getHashSafe: getHashSafe,
    getCartDataSafe: getCartDataSafe,
    pushCartDataSafe: pushCartDataSafe,
    popCartDataSafe: popCartDataSafe,
    resetCartData: resetCartData,
    returnThisWhenNull: returnThisWhenNull,

    alert: alert,

    getTokenSafe: getTokenSafe,
};
