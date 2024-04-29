
// export async function toHaveProperty(element, property, expectedResult) {
//     const callbacks = {
//         textContent: el => el.textContent,
//         title: el => el.title,
//         href: el => el.href,
//     }
//     const actualResult = await element.evaluate(callbacks[property]);
//     return actualResult ===  expectedResult
//         ? { message: () => `${property} "${actualResult}" is equal to "${expectedResult}".`, pass: true }
//         : { message: () => `${property} "${actualResult}" is not equal to "${expectedResult}".`, pass: false };
// }

function assert(property, expectedResult, actualResult) {
    return expectedResult ===  actualResult
        ? { message: () => `Element ${property} "${actualResult}" is equal to "${expectedResult}".`, pass: true }
        : { message: () => `Element ${property} "${actualResult}" is not equal to "${expectedResult}".`, pass: false };
}

export async function toHaveTextContent(element, expectedTextContent) {
    const actualTextContent = await element.evaluate(el => el.textContent);
    return assert('textContent', expectedTextContent, actualTextContent)
}

export async function toHaveTitle(element, expectedTextContent) {
    const actualTextContent = await element.evaluate(el => el.title);
    return assert('title', expectedTextContent, actualTextContent)
}

export async function toHaveHref(element, expectedTextContent) {
    const actualTextContent = await element.evaluate(el => el.href);
    return assert('title', expectedTextContent, actualTextContent)
}
