import JSZip from 'jszip';
import { ConversionResult } from '../core/converter';

export class ZipService {
  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  public addFile(result: ConversionResult): void {
    this.zip.file(result.name, result.blob);
  }

  public async generateZip(): Promise<Blob> {
    return await this.zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    });
  }

  public downloadZip(blob: Blob, filename: string = 'imagens_convertidas.zip'): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
