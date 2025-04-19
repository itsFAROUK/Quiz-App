export const $ = (selector) => document.querySelector(selector);

export const enableElement = function (element) {
    const lastClass = element.classList[element.classList.length - 1];
    element.classList.add(`${lastClass}--active`);
    element.removeAttribute('inert');
    element.removeAttribute('aria-hidden');
    element.querySelectorAll('button').forEach(btn => btn.disabled = false);
};

export const disableElement = function (element) {
    const lastClass = element.classList[element.classList.length - 1];
    element.classList.remove(lastClass);
    element.setAttribute('inert', '');
    element.setAttribute('aria-hidden', 'true');
    element.querySelectorAll('button').forEach(btn => {
        btn.blur();
        btn.disabled = true;
    });
};


export const addEventOnElements = function (elements, eventType, callback) {
    if (!elements || typeof eventType !== "string" || typeof callback !== "function") {
        console.error("Invalid parameters passed to addEventOnElements:" ,elements, eventType, callback);
        return;
    }
    
    elements.forEach(element => {
        if (!(element instanceof Element)) {
            console.error("Invalid element in elements list:", element);
            return;
        }
        element.addEventListener(eventType, callback);
    }); 
}
