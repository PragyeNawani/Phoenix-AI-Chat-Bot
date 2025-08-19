// Generates a unique ID by combing the current timestamp anda random num. 
// This function creates an identifier using the current time in milliseconds.
// (convert to base-36 string) concatenated with a random number,
// also converted to a base-36 string and sliced to remove unnecessary characters.

const generatedID = () => { 
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
 }

export default generatedID;