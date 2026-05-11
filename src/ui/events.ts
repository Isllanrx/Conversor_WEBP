import { elements, setButtonState, showAlert, updateProgress } from './dom';
import { ImageConverter } from '../core/converter';
import { ZipService } from '../services/zip-service';

let selectedFiles: File[] = [];

export const initEvents = () => {
  elements.qualityRange.addEventListener('input', () => {
    elements.qualityValue.textContent = `${elements.qualityRange.value}%`;
  });

  elements.btnSelect.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);
        if (files.length > 50) {
          showAlert('Você pode selecionar no máximo 50 imagens.', 'error');
          return;
        }
        selectedFiles = files;
        elements.listImages.value = selectedFiles.map((f) => f.name).join('\n');
      }
    };
    input.click();
  });

  elements.btnClear.addEventListener('click', () => {
    selectedFiles = [];
    elements.listImages.value = '';
    updateProgress(0, 100);
  });

  elements.btnConvert.addEventListener('click', async () => {
    if (selectedFiles.length === 0) {
      showAlert('Nenhuma imagem selecionada!', 'info');
      return;
    }

    try {
      setButtonState(false);
      updateProgress(0, 100);

      const zipService = new ZipService();
      const quality = parseInt(elements.qualityRange.value) / 100;
      let completed = 0;

      for (const file of selectedFiles) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 50));
          const result = await ImageConverter.convertToWebP(file, { quality });
          zipService.addFile(result);
        } catch (error) {
          console.error(`Erro ao converter ${file.name}:`, error);
        } finally {
          completed++;
          updateProgress(completed, selectedFiles.length);
        }
      }

      const zipBlob = await zipService.generateZip();
      zipService.downloadZip(zipBlob);

      showAlert('Conversão concluída!', 'success');
    } catch (error) {
      console.error('Erro na conversão:', error);
      showAlert('Ocorreu um erro durante a conversão.', 'error');
    } finally {
      setButtonState(true);
      updateProgress(0, 100);
    }
  });
};
