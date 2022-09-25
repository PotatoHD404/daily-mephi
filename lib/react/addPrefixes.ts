export default function addPrefixes(prefixes: string[], className: string) {
    return className.split(' ').map((name) => {
        return prefixes.map((prefix) => {
            return prefix + name;
        }).join(' ');
    }).join(' ');
}
