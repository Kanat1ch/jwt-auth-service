import IMask from 'imask'

export const phoneMask = (selector: string) => {
    const element = document.getElementById(selector)
    const maskOptions = {
        mask: '(000) 000-00-00'
      };
    if (element) {
        IMask(element, maskOptions);
    }
}
