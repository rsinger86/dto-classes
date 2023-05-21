
export function isNumeric(n): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function getAllPropertyNames(obj): string[] {
    var allProps: any[] = [];
    var curr = obj;

    do {
        var props = Object.getOwnPropertyNames(curr);

        props.forEach(function (prop: any) {
            if (allProps.indexOf(prop) === -1)
                allProps.push(prop)
        })
    } while (curr = Object.getPrototypeOf(curr))

    return allProps
}