export const Base64ToArrayBuffer = (base64: string) =>
{
    let binaryString = atob(base64);
    let bytes = new Uint8Array(binaryString.length);

    for (var i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

    return bytes.buffer;
};
