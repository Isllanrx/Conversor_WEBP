document.addEventListener("DOMContentLoaded", function () {
  const botaoSelecionar = document.getElementById("selecionar-imagens");
  const botaoConverter = document.getElementById("botao-converter");
  const botaoLimpar = document.getElementById("limpar-lista");
  const listaImagens = document.getElementById("lista-imagens");
  const controleQualidade = document.getElementById("qualidade");
  const valorQualidade = document.getElementById("valor-qualidade");
  const barraProgresso = document.getElementById("barra-progresso");

  let arquivos = [];

  controleQualidade.addEventListener("input", function () {
    valorQualidade.textContent = `${controleQualidade.value}%`;
  });

  botaoSelecionar.addEventListener("click", function () {
    let entrada = document.createElement("input");
    entrada.type = "file";
    entrada.accept = "image/*";
    entrada.multiple = true;
    entrada.onchange = function (evento) {
      arquivos = Array.from(evento.target.files);
      if (arquivos.length > 50) {
        alert("Você pode selecionar no máximo 50 imagens.");
        arquivos = [];
        return;
      }
      listaImagens.value = arquivos.map((arquivo) => arquivo.name).join("\n");
    };
    entrada.click();
  });

  function converterParaWebP(arquivo, qualidade) {
    return new Promise((resolver, rejeitar) => {
      let imagem = new Image();
      imagem.src = URL.createObjectURL(arquivo);
      imagem.onload = function () {
        let canvas = document.createElement("canvas");
        let contexto = canvas.getContext("2d");
        canvas.width = imagem.width;
        canvas.height = imagem.height;
        contexto.drawImage(imagem, 0, 0);

        setTimeout(() => {
          canvas.toBlob(
            (blob) => {
              resolver({
                nome: arquivo.name.replace(/\.\w+$/, ".webp"),
                blob,
              });
            },
            "image/webp",
            qualidade
          );
        }, 50);
      };
      imagem.onerror = rejeitar;
    });
  }

  async function processarConversao() {
    if (arquivos.length === 0) {
      alert("Nenhuma imagem selecionada!");
      return;
    }

    botaoConverter.disabled = true;
    barraProgresso.value = 0;
    let zip = new JSZip();
    let qualidade = controleQualidade.value / 100;
    let concluidos = 0;

    async function processarImagem(arquivo) {
      try {
        let { nome, blob } = await converterParaWebP(arquivo, qualidade);
        zip.file(nome, blob);
      } catch (erro) {
        console.error(`Erro ao converter ${arquivo.name}:`, erro);
      }
      concluidos++;
      barraProgresso.value = (concluidos / arquivos.length) * 100;
    }

    for (let arquivo of arquivos) {
      await new Promise((resolver) => setTimeout(resolver, 50));
      await processarImagem(arquivo);
    }

    zip
      .generateAsync({ type: "blob", compression: "DEFLATE" })
      .then((conteudo) => {
        let link = document.createElement("a");
        link.href = URL.createObjectURL(conteudo);
        link.download = "imagens_convertidas.zip";
        link.click();
        alert("Conversão concluída!");
        barraProgresso.value = 0;
        botaoConverter.disabled = false;
      });
  }

  botaoConverter.addEventListener("click", processarConversao);
  botaoLimpar.addEventListener("click", function () {
    arquivos = [];
    listaImagens.value = "";
  });
});
