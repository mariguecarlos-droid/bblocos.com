# 📘 Manual de Boas Práticas e Fluxo de Trabalho

## 1. Python e Automação (Backend & Scripts)
* *Ambiente Virtual:* Sempre usar .venv para isolar dependências.
    * Comando: source .venv/bin/activate (Linux).
* *Estrutura de Arquivos:* Manter scripts organizados por função.
    * Exemplo: scripts_python/ para automações e app/ para projetos Flask.
* *Tratamento de Erros:* Como trabalho com automação (ex: WhatsApp, Sockets), sempre usar blocos try-except para evitar que o script pare abruptamente.
* *Segurança:* Nunca deixar senhas ou chaves de API hardcoded no código. Usar variáveis de ambiente (.env).
* *Legibilidade:* Usar Type Hints (dicas de tipo) nas funções para facilitar a leitura.
    * Ex: def calcular_media(notas: list) -> float:

## 2. Desenvolvimento Web (Flask, HTML, CSS)
* *Padrão Flask:*
    * Templates HTML dentro da pasta /templates.
    * Arquivos estáticos (CSS, JS, Imagens) na pasta /static.
* *Frontend:*
    * Priorizar CSS Responsivo (Mobile First).
    * Manter o CSS organizado e evitar estilos "inline" (direto no HTML).
    * Usar HTML semântico (<header>, <main>, <footer>) para melhor estrutura.

## 3. Ambiente Linux e Terminal
* *Permissões:* Cuidado com sudo. Usar apenas para instalações ou alterações no sistema. Para rodar scripts locais, usar permissão de usuário comum.
* *Instalações:* Preferir apt ou pip dentro da venv. Se usar snap (como no VS Code), lembrar das permissões (--classic).
* *Alias:* Criar atalhos no .bashrc para comandos repetitivos.

## 4. Versionamento (Git)
* *Commits:* Fazer commits pequenos e com mensagens claras (ex: "Corrigindo erro no socket" em vez de "ajustes").
* *Ignorar Arquivos:* Sempre ter um .gitignore configurado para não subir a pasta .venv ou arquivos __pycache__.

## 5. Como pedir ajuda ao Gemini (Prompting)
* *Contexto:* Sempre explicar o objetivo final (ex: "Quero um script para organizar arquivos, não apenas deletar").
* *Review:* Sempre revisar o código gerado antes de rodar, especialmente comandos de sistema (os.system, subprocess).
* *Iteração:* Se o código der erro, colar o erro do terminal para a IA analisar a saída exata.