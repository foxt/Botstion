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
 * GRAMMAR: word gitBranch=master
 * 
 */

var seperator = " "
var argSeperator = ","

/**
 * Parse a grammar 
 * @param {String} grammar The grammar to split out
 */
function parseGrammar(grammar) {
    // Split out grammar
    var chars = grammar.split("")
    var args = []
    var cstring = ""
    var quoted = false
    var escaped = false
    var arguments = false
    var carg = {}
    for (var c of chars) {
        if (escaped) {cstring += c;escaped = false;continue}
        if (c == "\\") {cstring += c;escaped = true; continue;}

        if (c == "\"") {cstring += c;quoted = !quoted; continue;}
        if (quoted) {cstring += c;continue}

        if (c == "{" && !arguments) {cstring += c;arguments = true; continue;}
        if (c == "}" && arguments) {cstring += c;arguments = false; continue;}
        if (arguments) {cstring += c;continue}

        if (c == argSeperator) {args.push(carg); carg ={};cstring = ""; continue;}
        cstring += c
    }
    if (cstring.trim().length > 1) { args.push(cstring.trim()) }
    return args
}

function parseInput() {

}

parseInput.parseGrammar = parseGrammar

module.exports = parseInput