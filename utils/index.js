const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

function getShortenUrl(shortedUrl) {
    return `/${shortedUrl}`;
}

const generateNewURLStub = (length = 6) => {
    const seedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

    return Array(length)
        .fill(0)
        .map(() => seedCharacters[getRandomArbitrary(0, seedCharacters.length)])
        .join('');
}

module.exports = {
    generateNewURLStub,
    getShortenUrl
}