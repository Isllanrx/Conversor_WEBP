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
};

export const setButtonState = (enabled: boolean) => {
  elements.btnConvert.disabled = !enabled;
};

export const showAlert = (message: string) => {
  alert(message);
};
