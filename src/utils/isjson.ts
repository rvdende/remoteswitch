export function isJson(x: string | Buffer): boolean {
    try {
        if (typeof x === "string") {
            const a = JSON.parse(x);
            return !!(a);
        } else {
            const a = JSON.parse(x.toString());
            return !!(a);
        }
    } catch (err) {
        return false;
    }
}
