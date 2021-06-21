/* eslint-disable no-undef */
module.exports = {
    name: "Strict Garbage Collection",
    author: "theLMGN",
    disable: typeof gc == "undefined",
    version: 1,
    description: "Makes sure the grabage collector runs at least every time timer() is run.",
    timer: [async (c) => {
        gc(true);
    }]
};

