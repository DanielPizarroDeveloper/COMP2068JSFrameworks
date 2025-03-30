const normalize_identifier = (ID) => {
    const formatID = ID.replace(':', '').replace('_', ''); 
    return formatID;
}

module.exports = {
    normalize_identifier
}