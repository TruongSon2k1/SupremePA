
export function Instance<T>(obj: ClassType<T>): T | null
{
    if(obj['instance']) return obj['instance']();
    return null;
}
