---
impacto: capacidade_nova
secao: adicionado
titulo: A chave do OpenCode pode apontar para o endpoint Go
---

Quem já usa o OpenCode no endereço de sempre não edita nada: vazio continua em `https://opencode.ai/zen/v1`. As chamadas passam a enviar o cabeçalho `x-opencode-session` (o valor de `OPENCODE_SESSION`, ou `crm` quando essa variável está vazia). Quem precisa do endpoint Go define `OPENCODE_BASE_URL=https://opencode.ai/zen/go/v1`. Esse endereço recusa a geração sem a sessão.
