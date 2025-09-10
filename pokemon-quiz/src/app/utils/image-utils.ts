export async function imageToSilhouette(imageUrl: string, width = 300, height = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      // dessiner l'image en redimensionné
      ctx.drawImage(img, 0, 0, width, height);

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // conversion grayscale puis seuil pour silhouette
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const gray = 0.299*r + 0.587*g + 0.114*b;
        // ajuster threshold (par ex. 70)
        const threshold = 70;
        const v = gray > threshold ? 255 : 0; // blanc ou noir
        data[i] = data[i+1] = data[i+2] = v;
        // garder alpha
      }
      ctx.putImageData(imgData, 0, 0);

      // on peut ensuite rendre noir (si fond blanc on inverse)
      // pour rendre silhouette noire sur fond transparent:
      const imgData2 = ctx.getImageData(0,0,width,height);
      const data2 = imgData2.data;
      for (let i = 0; i < data2.length; i += 4) {
        // si pixel blanc => alpha 0
        if (data2[i] === 255) {
          data2[i+3] = 0;
        } else {
          // noir pixel, garder alpha opaque
          data2[i] = 0; data2[i+1] = 0; data2[i+2] = 0; data2[i+3] = 255;
        }
      }
      ctx.putImageData(imgData2, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => reject(e);
    img.src = imageUrl;
  });
}
