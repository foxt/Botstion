/**
 * @name Ganymede Argument Parser
 * @author theLMGN
 * @license GPL-3.0
 */
/**
 * ==       TYPES       ==
 * word - A single word, i.e. 'Hello'
 * string - Shorthand of `word[]`
 * int - A whole number, i.e 56
 * float - A float, i.e. 3.141
 * bool - A true/false, I.E. YES
 * == SYNTAX & EXAMPLES ==
 *
 * Argument (basic):
 *  GRAMMAR: word name
 *  EXAMPLE: Ganymede
 *  PARSED : {name: "Ganymede"}
 *
 * Argument (enumeration)
 *  GRAMMAR: enum{red,green,blue} colour
 *  EXAMPLE: red
 *  PARSED : {colour: "red"}
 *
* Argument (fixed length array)
*  GRAMMAR: word[5] names
*  EXAMPLE: Taylor Bob Jane Tom Emma
*  PARSED : {names: ["Taylor", "Bob", "Jane", "Tom", "Emma"]}
*
* Argument (unlimited length array)
*  GRAMMAR: int[] numbers
*  EXAMPLE: 5 3 7 2
*  PARSED : {numbers: [5,3,7,2]}
 *
 * Arguments
 *  GRAMMAR: word firstName, word lastName, int age, word pronoun, string description
 *  EXAMPLE: John Doe 27 he Lorem ipsum sit amet.
 *  PARSED : {firstName: "John", lastName: "Doe", age: 27, pronoun: "he", description: "Lorem Ipsum Sit Amet."}
 * Optional Arguments
 *
 * Optional Arguments
 * GRAMMAR: int optional xkcdComic
 * EXAMPLE:
 * PARSED : {}
 *
 * Default Values
 * GRAMMAR: word gitBranch="master"
 *
 */

let seperator = " ";
let argSeperator = ",";

let truthy = ["true", "yes", "y", "correct", "sure"];
let falsey = ["false", "no", "n", "wrong", "nope"];

let types = {
    word: (input) => [true, input, "if you're reading this, something went wrong"],
    int: (input) => [!isNaN(parseInt(input, 10)), parseInt(input, 10), "Not a whole number!"],
    float: (input) => [!isNaN(parseFloat(input)), parseFloat(input), "Not a floating point number!"],
    bool: (input) => [truthy.includes(input.toLowerCase()) || falsey.includes(input.toLowerCase()), truthy.includes(input.toLowerCase()), "Not one of " + truthy.join(", ") + " or " + falsey.join(", ")],
    enum: (input, type) => [type.allowedValues.includes(input), input, "Not one of " + type.allowedValues.join(", ")],
    user: async (input) => {
        try {
            let id = input.replace(/\D/g, "");
            let user = await global.client.users.fetch(id);
            return [!!user, user, "User is " + user];
        } catch (e) {
            return [false, undefined, e.toString()];
        }
    }
};

function parseWord(enumeration, sep) {
    let values = [];
    let cstring = "";
    let quoted = false;
    let escaped = false;
    for (let c of enumeration) {
        if (escaped) {
            cstring += c;
            escaped = false;
            continue;
        }
        if (c == "\\") { escaped = true; continue; }

        if (c == "\"") { quoted = !quoted; continue; }
        if (quoted) { cstring += c; continue; }
        if (c == sep) {
            values.push(cstring.trim());
            cstring = "";
            continue;
        }
        cstring += c;
    }
    if (cstring.trim().length > 0) {
        values.push(cstring.trim());
    }
    return values;
}

/**
 * Parse a grammar
 * @param {String} grammar The grammar to split out
 */
function parseGrammar(grammar) {
    // Split out grammar
    let args = [];
    let cstring = "";
    let quoted = false;
    let escaped = false;
    let parsingArguments = false;
    let canHaveArgs = true;
    let canHaveRequired = true;
    let carg = {};
    for (let c of grammar) {
        if (escaped) { escaped = false; continue; }
        if (c == "\\") { escaped = true; continue; }

        if (c == "\"") { quoted = !quoted; continue; }
        if (quoted) { cstring += c; continue; }

        if (c == "{" && !parsingArguments) {
            cstring += c;
            parsingArguments = true;
            continue;
        }
        if (c == "}" && parsingArguments) {
            cstring += c;
            parsingArguments = false;
            continue;
        }
        if (parsingArguments) { cstring += c; continue; }
        if (c == " " && cstring.trim().length > 0) {
            if (!carg.type) {
                if (!canHaveArgs) {
                    throw new Error("Cannot create any new arguments");
                }
                let t = cstring.trim();
                let type = { kind: t, raw: t };
                // regex for matching an array
                if ((t.match(/\w+\[\d+\]/g) || [])[0] == t) {
                    type.count = parseInt(t.split("[")[1].split("]")[0]);
                    type.kind = t.split("[")[0];
                }
                // regex for matching an unlimited length
                if ((t.match(/\w+\[\]/g) || [])[0] == t) {
                    type.kind = t.split("[")[0];
                    type.unlimitedLength = true;
                    canHaveArgs = false;
                }
                // regex for matching an enum
                if ((t.match(/\w+{.*}/g) || [])[0] == t) {
                    type.kind = t.split("{")[0];
                    type.allowedValues = parseWord(t.substr(type.kind.length + 1, t.length - (type.kind.length + 2)), argSeperator);
                }
                carg.type = type;
            }
            if (cstring.trim() == "optional") {
                carg.optional = true;
                canHaveRequired = false;
            } else if (!canHaveRequired) {
                throw Error("Required arguments cannot come after optional arguments");
            }
            cstring = "";
            continue;
        }
        if (c == "=") {
            carg.name = cstring.trim();
            cstring = "";
            continue;
        }
        if (c == argSeperator) {
            if (carg.name) {
                carg.default = cstring.trim();
            } else {
                carg.name = cstring.trim();
            }
            args.push(carg);
            carg = {}; cstring = ""; continue;
        }
        cstring += c;
    }
    if (cstring.trim().length > 1) {
        if (carg.name) {
            carg.default = cstring.trim();
        } else {
            carg.name = cstring.trim();
        }
        args.push(carg);
        carg = {}; cstring = "";
    }
    return args;
}

async function parseInput(input, against, context) {
    let grammar = [];
    for (let g of against) {
        if (g.type.count) {
            for (let i = 0; i < g.type.count; i++) {
                grammar.push(g);
            }
        } else {
            grammar.push(g);
        }
    }
    let words = parseWord(input, seperator);
    let retval = {};
    for (let g of grammar) {
        if (g.default) { retval[g.name] = (await types[g.type.kind](g.default, g.type, context))[1]; }
    }
    let word;
    let endType;
    while (word = words.shift()) {
        let g = grammar.shift();

        if (!g) { return ["Too many arguments"]; }
        if (!types[g.type.kind]) { throw new Error("Unknown type " + g.type.kind); }
        let valid = await types[g.type.kind](word, g.type, context);
        if (!valid[0]) { return ["Value for '" + g.name + "' (\"" + word + "\") is not a valid " + g.type.kind + ": " + valid[2]]; }
        if (g.type.count) {
            if (!retval[g.name]) { retval[g.name] = []; }
            retval[g.name].push(valid[1]);
            continue;
        }
        if (g.type.unlimitedLength) {
            endType = g;
            retval[g.name] = [valid[1]];
            break;
        }
        retval[g.name] = valid[1];
    }
    for (let g of grammar) {
        if (!g.optional) {
            return ["Too few arguments! Missing a value for required '" + g.name + "'"];
        }
    }
    if (words[0] && endType) {
        for (let wordd of words) {
            console.log(word);
            let valid = await types[word.type.kind](wordd, word.type);
            if (!valid[0]) { return ["Value for '" + word.name + "' (\"" + wordd + "\") is not a valid " + word.type.kind + ": " + valid[2]]; }
            retval[word.name].push(valid[1]);
        }
    }
    return [undefined, retval];
}

parseInput.parseGrammar = parseGrammar;

module.exports = parseInput;