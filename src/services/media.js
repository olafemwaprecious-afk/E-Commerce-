// Local image helper for profile photos and review images.
// Images are downscaled in the browser and stored as data URLs on this device.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function readImageFile(file, { maxSize = 480, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Choose an image first.'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Choose an image file (JPG, PNG or WebP).'));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      reject(new Error('Choose an image smaller than 5 MB.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('That image could not be read. Try another file.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That image could not be read. Try another file.'));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          resolve(String(reader.result));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
