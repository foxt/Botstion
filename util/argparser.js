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
 *  GRAMMAR: enum{"red","green","blue"} colour
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
 */

 var seperator = " "

 /**
  * Parse a grammar into its constituent parts
  * @param {String} grammar The grammar to split out
  */
 function parseGrammar(grammar) {
     // Split out grammar
     var arguments = grammar.split(",").map((arg) => arg.trim())
     var gram = {}
     
     for (var argument of arguments) {

     }
 }
