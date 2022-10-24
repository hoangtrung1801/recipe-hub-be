export function deepCloneWithoutId<T>(o: T) {
    const copy = { ...o };
    for (const key in copy) {
        if (typeof copy[key] === 'object') {
            copy[key] = deepCloneWithoutId(copy[key]);
        }
    }
    delete copy['id'];
    delete copy['createdAt'];
    delete copy['updatedAt'];
    return copy;
}
