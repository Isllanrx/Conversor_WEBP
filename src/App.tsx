import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Image as ImageIcon, Link as LinkIcon, Check, X, Info } from 'lucide-react';
import { ImageConverter } from './core/converter';
import { ZipService } from './services/zip-service';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(85);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 50) {
        addToast('Você pode selecionar no máximo 50 imagens.', 'error');
        return;
      }
      setSelectedFiles(files);
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setProgress(0);
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      addToast('Nenhuma imagem selecionada!', 'info');
      return;
    }

    try {
      setIsConverting(true);
      setProgress(0);

      const zipService = new ZipService();
      const q = quality / 100;
      let completed = 0;

      for (const file of selectedFiles) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 50));
          const result = await ImageConverter.convertToWebP(file, { quality: q });
          zipService.addFile(result);
        } catch (error) {
          console.error(`Erro ao converter ${file.name}:`, error);
        } finally {
          completed++;
          setProgress((completed / selectedFiles.length) * 100);
        }
      }

      const zipBlob = await zipService.generateZip();
      zipService.downloadZip(zipBlob);

      addToast('Conversão concluída!', 'success');
    } catch (error) {
      console.error('Erro na conversão:', error);
      addToast('Ocorreu um erro durante a conversão.', 'error');
    } finally {
      setIsConverting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="background-circles" aria-hidden="true">
        <motion.div 
          className="circle circle-1"
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="circle circle-2"
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div id="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`toast toast-${toast.type}`}
              role={toast.type === 'error' ? 'alert' : 'status'}
            >
              <span className="toast-icon">
                {toast.type === 'success' && <Check size={18} />}
                {toast.type === 'error' && <X size={18} />}
                {toast.type === 'info' && <Info size={18} />}
              </span>
              <span className="toast-message">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <main className="container">
        <header>
          <h1>Conversor WEBP <span className="badge">PRO</span></h1>
          <p className="subtitle">Otimize suas imagens com performance React</p>
        </header>

        <label htmlFor="file-upload" className="dropzone">
          <Upload size={32} />
          <span>{selectedFiles.length > 0 ? `${selectedFiles.length} imagens selecionadas` : 'Clique para selecionar imagens'}</span>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={onFileChange}
            style={{ display: 'none' }}
          />
        </label>

        {selectedFiles.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="file-list-container"
          >
            <div className="file-list">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="file-item">
                  <ImageIcon size={14} />
                  <span className="file-name">{file.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="control-group">
          <label htmlFor="quality">Qualidade da Conversão: <span className="value">{quality}%</span></label>
          <div className="range-container">
            <input
              type="range"
              id="quality"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="range"
            />
          </div>
        </div>

        <AnimatePresence>
          {progress > 0 && (
            <motion.div 
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className="progress-container active"
            >
              <div className="progress">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="buttons">
          <button 
            onClick={handleConvert} 
            disabled={isConverting || selectedFiles.length === 0}
            className="btn"
          >
            {isConverting ? 'Convertendo...' : 'Converter Imagens'}
          </button>
          <button 
            onClick={handleClear} 
            className="btn clear"
            disabled={isConverting}
          >
            <Trash2 size={18} /> Limpar
          </button>
        </div>

        <a
          href="https://www.linkedin.com/in/isllantoso/"
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin-link"
        >
          <LinkIcon size={16} /> Conecte-se no LinkedIn
        </a>

        <footer>Desenvolvido com React por Isllan Toso</footer>
      </main>
    </div>
  );
};

export default App;
