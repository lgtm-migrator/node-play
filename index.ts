import { randomBytes } from "node:crypto";

const bitStream = 'the quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dog'

console.log('bitStream:', bitStream)

const windowSize = 10

console.log('windowSize', windowSize)

const streamLength = bitStream.length

console.log('streamLength:', streamLength)

let cursor = 0
let searchLength = 1
let matchLength = 0

console.log('starting cursor:', cursor)

function getWindow(inStream: string, index: number, windowSize: number) {
    if (index < windowSize) {
        windowSize = index
    }
    const window = inStream.substring(index - windowSize, index)

    return window
    
}

function getMatchIndex(searchString: string, searchWindow: string) {

    return searchWindow.indexOf(searchString)
    
}

function getMatchLength(searchString: string, startIndex: number, searchWindow: string ) {
    let matchLength = 1
    do {
        console.log(`[${searchString.substring(0, matchLength)}] === [${searchWindow.substring(startIndex, matchLength)}]`)

        matchLength = matchLength + 1        
    } while (searchString.substring(0, matchLength) === searchWindow.substring(startIndex, matchLength));
    
    return matchLength -1
}

while (cursor < streamLength) {
    const inputByte = bitStream.substring(cursor, cursor + searchLength)

    console.log('cursor:', cursor)
    console.log('current byte:', inputByte)
    console.log('searchLength:', searchLength)

    const window = getWindow(bitStream, cursor, windowSize)

    console.log('search window:', window)

    let found = false
    
    const positionInWindow = getMatchIndex(inputByte, window)

    if (positionInWindow >= 0) {
        found = true

        console.log('!!!!!!!!!! match found in window at position:', positionInWindow)

        const matchStart = cursor - windowSize + positionInWindow

        const matchLength = getMatchLength(inputByte, matchStart, window)

        console.log('match was n characters long:', matchLength)
        searchLength = matchStart + matchLength
    } else {
        cursor = cursor + matchLength + 1
        matchLength = 0
        searchLength = 1
    }
}
