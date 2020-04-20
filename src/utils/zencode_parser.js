const quoted = new RegExp(/'[^']*'/, 'g')

export const getParams = sentence => {
    const params = sentence.match(quoted)
    return (params) ? params.map(p => p.replace(/'/g, '')) : null
}

export const removeParams = sentence => sentence.replace(quoted, '{}')

export const removeWords = (sentence, words) => {
    const regex = new RegExp(`\\b${words.join('|')}\\b`, "gi")
    return sentence.replace(regex, '')
}

export const removeKeywords = str => removeWords(str, ['when', 'given', 'and', 'then'])

export const parseZencode = (contract) => {
    let parsed = new Map() // ensure insertion order
    const carr = contract.split('\n')
    for (const c of carr) {
        const params = getParams(c) || []
        const sentenceId = removeKeywords(removeParams(c)).trim()
        parsed.set(sentenceId, params)
    }
    return parsed
}