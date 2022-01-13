export const hideEmail = (email: string) => {
    const emailName = email.split('@')[0]
    const emailDomain = email.split('@')[1].split('.')[0]
    const emailCode = email.split('.')[1]

    const replaceValue = (value: string, visibleStart: number, visibleEnd: number = 0) => {
        if (value.length <= visibleStart + visibleEnd) {
            return value.replace(/[a-z0-9]/gi, '*')
        } else {
            if (visibleEnd) {
                return value.slice(0, visibleStart) + value.replace(/[a-z0-9]/gi, '*').slice(0, value.length - (visibleStart + visibleEnd)) + value.slice(-visibleEnd)
            } else {
                return value.slice(0, visibleStart) + value.replace(/[a-z0-9]/gi, '*').slice(0, value.length - (visibleStart + visibleEnd))
            }
        }
    }

    const hidedName = replaceValue(emailName, 2, 1)
    const hidedDomain = replaceValue(emailDomain, 1)
    const hidedCode = replaceValue(emailCode, 1)

    return `${hidedName}@${hidedDomain}.${hidedCode}`
}

export const hidePhone = (phone: string) => {
    return `+7******${phone.slice(-4)}`
}