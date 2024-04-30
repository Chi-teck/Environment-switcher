function assert(property, expectedResult, actualResult) {
    return expectedResult ===  actualResult
        ? { message: () => `Element ${property} "${actualResult}" is equal to "${expectedResult}".`, pass: true }
        : { message: () => `Element ${property} "${actualResult}" is not equal to "${expectedResult}".`, pass: false };
}

export async function toHaveTextContent(element, expectedTextContent) {
    if (element === null) {
        return {message: () => 'Element must not be null', pass: false};
    }
    const actualTextContent = await element.evaluate(el => el.textContent);
    return assert('textContent', expectedTextContent, actualTextContent)
}

export async function toHaveTitle(element, expectedTextContent) {
    const actualTextContent = await element.evaluate(el => el.title);
    return assert('title', expectedTextContent, actualTextContent)
}

export async function toHaveHref(element, expectedTextContent) {
    const actualTextContent = await element.evaluate(el => el.href);
    return assert('href', expectedTextContent, actualTextContent)
}

export async function toHaveValue(element, expectedTextContent) {
    const actualTextContent = await element.evaluate(el => el.value);
    return assert('value', expectedTextContent, actualTextContent)
}

export async function toBeDisabled(element) {
    const pass = await element.evaluate(el => el.disabled);
    return pass
        ? { message: () => 'Element is disabled', pass }
        : { message: () => 'Element is not disabled', pass };
}
