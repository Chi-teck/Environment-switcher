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

export async function toHaveTitle(element, expectedTitle) {
    const actualTitle = await element.evaluate(el => el.title);
    return assert('title', expectedTitle, actualTitle)
}

export async function toHaveHref(element, expectedHref) {
    const actualHref = await element.evaluate(el => el.href);
    return assert('href', expectedHref, actualHref)
}

export async function toHaveValue(element, expectedValue) {
    const actualValue = await element.evaluate(el => el.value);
    return assert('value', expectedValue, actualValue)
}

export async function toHaveAriaLabel(element, expectedAriaLabel) {
    const actualAriaLabel = await element.evaluate(el => el.ariaLabel);
    return assert('value', expectedAriaLabel, actualAriaLabel)
}

export async function toBeDisabled(element) {
    const pass = await element.evaluate(el => el.disabled);
    return pass
        ? { message: () => 'Element is disabled', pass }
        : { message: () => 'Element is not disabled', pass };
}

export async function toBeChecked(element) {
    const pass = await element.evaluate(el => el.checked);
    return pass
        ? { message: () => 'Element is checked', pass }
        : { message: () => 'Element is not checked', pass };
}
