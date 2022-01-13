import IMask from 'imask'

export const phoneMask = (selector: string) => {
    const element = document.getElementById(selector)
    const maskOptions = {
        mask: '(000) 000-00-00',
      };
    if (element) {
        IMask(element, maskOptions);
    }
}

export const phoneToMask = (phone: string) => {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`
}
