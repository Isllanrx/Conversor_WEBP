export const elements = {
  btnSelect: document.getElementById('selecionar-imagens') as HTMLButtonElement,
  btnConvert: document.getElementById('botao-converter') as HTMLButtonElement,
  btnClear: document.getElementById('limpar-lista') as HTMLButtonElement,
  listImages: document.getElementById('lista-imagens') as HTMLTextAreaElement,
  qualityRange: document.getElementById('qualidade') as HTMLInputElement,
  qualityValue: document.getElementById('valor-qualidade') as HTMLSpanElement,
  progressBar: document.getElementById('barra-progresso') as HTMLProgressElement,
};

export const updateProgress = (completed: number, total: number) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  elements.progressBar.value = percentage;
  
  const container = document.getElementById('barra-progresso-container');
  if (container) {
    if (percentage > 0 && percentage < 100) {
      container.classList.add('active');
    } else {
      setTimeout(() => {
        if (elements.progressBar.value === 0 || elements.progressBar.value === 100) {
          container.classList.remove('active');
        }
      }, 1000);
    }
  }
};

export const setButtonState = (enabled: boolean) => {
  elements.btnConvert.disabled = !enabled;
};

export const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = document.createElement('span');
  icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  
  const text = document.createElement('span');
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 4000);
};
