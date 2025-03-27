const getToday = () => {
    const getNow = new Date();
    let today = getNow.getFullYear() + '-' + String(getNow.getMonth() + 1).padStart(2, '0') + '-' + String(getNow.getDate()).padStart(2, '0');
    return today;
}

module.exports = getToday;