import { randomBytes } from "node:crypto";

const bitStream = 'the quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dog'

console.log(`bitStream: ${bitStream}\n`)

const WINDOW_SIZE = 10

console.log('windowSize', WINDOW_SIZE)

const streamLength = bitStream.length

console.log('streamLength:', streamLength)

let cursor = 0
let searchLength = 1

console.log(`starting cursor: ${cursor}\n`)

function getWindow(inStream: string, index: number, windowSize: number) {
    if (index < windowSize) {
        windowSize = index
    }
    const window = inStream.substring(index - windowSize, index +1)

    return window
    
}

/**
 * What position does the search string first occur at?
 * @param {string} searchString 
 * @param {string} searchWindow 
 * @returns 
 */
function getMatchIndex(searchString: string, searchWindow: string) {

    return searchWindow.indexOf(searchString)
    
}

/**
 * 
 * @param {string} searchString 
 * @param {number} startIndex 
 * @param {number} searchWindow 
 * @param {number} windowSize
 * @returns {number}
 */
function getMatchLength(searchString: string, startIndex: number, searchWindow: string, windowSize: number ) {
    console.log('In getMatchLength()')
    console.log(searchString, startIndex, searchWindow)
    let matchLength = 1
    let count = 0
    do {
        // If we have searched past the windows edge, break
        if (count >= windowSize) {
            break
        }
        console.log(`[${searchString.substring(0, startIndex + matchLength)}] === [${searchWindow.substring(startIndex, startIndex + matchLength)}]`, startIndex, matchLength, searchWindow.substring(startIndex, matchLength).startsWith(searchString.substring(startIndex, matchLength)))
        count = count + 1

        matchLength = matchLength + 1  

    } while (searchWindow.substring(startIndex, startIndex + matchLength).startsWith(searchString.substring(0, startIndex + matchLength)) === true);
    // Last loop failed, back up by one
    const match = searchWindow.substring(startIndex, matchLength - 1)
    console.log(`Final match: [${match}]`)
    return match.length
}

do {
    let matchLength = 0
    // Emergency break if needed
    let count = 1
    const inputByte = bitStream.substring(cursor, cursor + searchLength)

    console.log('cursor:', cursor)
    console.log('current byte:', inputByte)
    console.log('searchLength:', searchLength)

    const window = getWindow(bitStream, cursor, WINDOW_SIZE)

    console.log(`search window: /${window}/`)

    let found = false
    
    const positionInWindow = getMatchIndex(inputByte, window)

    if (positionInWindow >= 0) {
        // A match was found
        found = true

        console.log('!!!!!!!!!! match found in window at position:', positionInWindow)

        const matchStart = cursor + positionInWindow
        console.log(`starting search length check at absolute position: ${matchStart}`)

        // How long does the match extend?
        const matchLength = getMatchLength(inputByte, matchStart, bitStream, WINDOW_SIZE)

        console.log(`match was n characters long: ${matchLength}\n`)
        searchLength = matchStart + matchLength
        cursor = cursor + matchLength
    } else {
        console.log(`==No Match found==: ${cursor}\n`)
        cursor = cursor  + 1
        matchLength = 0
        searchLength = 1
    }
    count = count + 1
    if (count > streamLength) {
        break
    }
} while (cursor < streamLength) 
