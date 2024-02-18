export const CompareArrays = <T>(one: T[] = [], two: T[] = []) =>
{
    if(one.length !== two.length) return false;

    const oneCopy = one.slice().sort();
    const twoCopy = two.slice().sort();

    const length = oneCopy.length;

    for(let i = 0; i < length; i++)
    {
        if(oneCopy[i] !== twoCopy[i]) return false;
    }

    return true;
}
