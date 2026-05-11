export interface ConversionResult {
  name: string;
  blob: Blob;
}

export interface ConverterOptions {
  quality: number;
}

export class ImageConverter {
  public static async convertToWebP(
    file: File,
    options: ConverterOptions,
  ): Promise<ConversionResult> {
    const { quality } = options;
    const imageUrl = URL.createObjectURL(file);

    try {
      const image = await this.loadImage(imageUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Canvas toBlob failed'));
          },
          'image/webp',
          quality,
        );
      });

      return {
        name: file.name.replace(/\.\w+$/, '.webp'),
        blob,
      };
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  private static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }
}
