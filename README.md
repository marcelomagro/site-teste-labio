# LABIO — Liga Acadêmica de Bioengenharia

Site institucional da Liga Acadêmica de Bioengenharia da Universidade Federal do Piauí (UFPI).

O projeto utiliza HTML, CSS e JavaScript, com imagens, ícones, fontes e documentos locais. Não requer instalação de dependências ou etapa de compilação.

## Estrutura

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   └── hero-flows.js
│   ├── fonts/
│   ├── documents/
│   │   └── edital-labio-2026.pdf
│   └── images/
│       ├── brand/
│       ├── icons/
│       ├── members/
│       └── projects/
├── docs/
│   ├── manual-identidade-visual.md
│   └── brand/
│       └── labio-original.png
├── .editorconfig
├── .gitattributes
├── .gitignore
├── LICENSE
└── README.md
```

`assets/` contém os recursos utilizados pelo site. `docs/` reúne a documentação de manutenção e a referência original da identidade visual.

## Executar localmente

Na raiz do projeto, com Python 3 instalado:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Acesse [http://127.0.0.1:8000](http://127.0.0.1:8000). Para encerrar o servidor, pressione `Ctrl+C` no terminal.

Também é possível utilizar uma extensão de servidor estático do editor.

## Manutenção

- Conteúdo, links, integrantes e caminhos de imagens: `index.html`.
- Estilos, cores e responsividade: `assets/css/styles.css`.
- Menu, rolagem, carrosséis e ampliação das imagens: `assets/js/main.js`.
- Fios animados do hero: `assets/js/hero-flows.js`.
- Ícones: `assets/images/icons/`. As imagens usam a classe `site-icon`.
- Edital disponível para consulta: [edital-labio-2026.pdf](assets/documents/edital-labio-2026.pdf).
- Identidade visual: [manual-identidade-visual.md](docs/manual-identidade-visual.md).

Novos arquivos próprios devem usar nomes em letras minúsculas, sem espaços ou acentos, com palavras separadas por hífens. Os nomes originais das fontes de terceiros foram preservados. Os caminhos no HTML devem corresponder exatamente aos nomes dos arquivos.

As referências com `?v=` no HTML e no CSS permitem renovar o cache. Ao atualizar um recurso mantendo o mesmo nome, incremente sua versão na referência correspondente.

## Versionamento

O repositório inclui o código, os recursos do site, a documentação e os arquivos de configuração compartilhados.

O `.gitignore` exclui ferramentas locais de IA, configurações privadas de ambiente, dependências instaladas, caches, relatórios gerados, arquivos temporários e configurações locais de editor. Um eventual `.env.example` pode ser versionado com valores demonstrativos.

O `.editorconfig` define UTF-8, indentação com dois espaços e finais de linha LF. O `.gitattributes` normaliza os arquivos de texto no Git e mantém imagens, fontes e PDFs como binários.

## Commit manual

Na raiz do projeto:

```sh
git status --short
git diff --check
git add -A
git diff --cached --stat
git diff --cached
git commit -m "Organiza arquivos e atualiza site da LABIO"
git push origin main
git status --short
```

Revise o conteúdo preparado antes de executar o commit. `git add -A` registra os arquivos novos, as alterações e a remoção dos caminhos anteriores dos arquivos reorganizados.

## Publicação

O site pode ser servido por qualquer hospedagem estática. No GitHub Pages, a estrutura permite publicar a branch `main` a partir da pasta `/ (root)`. As pastas `assets/` e `docs/` devem acompanhar o `index.html`.

## Licença

O código do projeto possui [licença MIT](LICENSE). Os recursos de terceiros mantêm suas próprias condições de uso.
