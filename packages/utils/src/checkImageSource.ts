// This function should only be used when metadata 
// for the preview image is unavailable.
// It will check if the image source is valid and return the placeholder image if not.

export const checkImageSource = (src: string, placeholderSrc: string): string => {
    const img = new Image();
    img.src = src;
    if (img.complete) {
        return src;
    } else {
        return placeholderSrc;
    }
};