# Guia de Publicação em Produção com Domínio Próprio
## Cacofer Tecnologia — Infraestrutura Blindada e Alta Performance

Este guia detalha o passo a passo seguro para colocar a landing page da **Cacofer Tecnologia** no ar utilizando o seu domínio registrado, garantindo **velocidade máxima, custo R$ 0,00 de hospedagem e conformidade com os mais altos padrões de cibersegurança**.

---

### Opção 1: Vercel ou Cloudflare Pages (Recomendada — Deploy em 3 Minutos)

Esta é a opção adotada pelas maiores startups de tecnologia do mundo (Stripe, Supabase, Linear). O site é distribuído em mais de 300 data centers globais com certificado SSL TLS 1.3 automático.

#### Passo a Passo:
1. Acesse **[vercel.com](https://vercel.com)** ou **[pages.cloudflare.com](https://pages.cloudflare.com)** e faça login com seu GitHub ou e-mail.
2. Clique em **"Add New Project"** e faça upload da pasta `cacofer_website` (ou conecte o repositório Git).
3. Na aba **Domains (Domínios)**:
   - Adicione o seu domínio: `cacofer.com.br` e `www.cacofer.com.br`.
4. Vá no seu registrador de domínio (ex: **Registro.br**, GoDaddy ou Cloudflare):
   - Crie uma entrada do tipo **A**:
     - **Nome:** `@`
     - **Destino / IP:** `76.76.21.21` (ou o IP fornecido pela Vercel)
   - Crie uma entrada do tipo **CNAME**:
     - **Nome:** `www`
     - **Destino:** `cname.vercel-dns.com` (ou o CNAME fornecido)
5. **Pronto!** Em poucos minutos o site estará online com certificado SSL automático (cadeado verde). Todos os cabeçalhos do arquivo `vercel.json` e `_headers` já estão configurados e serão aplicados automaticamente.

---

### Opção 2: Na Própria VPS da Cacofer (Via Nginx e Let's Encrypt)

Se você preferir manter tudo 100% sob seu controle na VPS onde já rodam o PostgreSQL e o n8n:

#### 1. Copie os arquivos para a VPS:
```bash
# No terminal local (PowerShell ou Bash)
scp -r ./cacofer_website root@SEU_IP_VPS:/var/www/cacofer_website
```

#### 2. Instale o Nginx e o Certbot na VPS (caso ainda não estejam instalados):
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

#### 3. Aplique a configuração de segurança da Cacofer:
```bash
sudo cp /var/www/cacofer_website/security/nginx.conf /etc/nginx/sites-available/cacofer.com.br
sudo ln -s /etc/nginx/sites-available/cacofer.com.br /etc/nginx/sites-enabled/
```

#### 4. Gere o Certificado SSL Gratuito com Let's Encrypt:
```bash
sudo certbot --nginx -d cacofer.com.br -d www.cacofer.com.br
```

#### 5. Reinicie o Nginx:
```bash
sudo nginx -t && sudo systemctl restart nginx
```

---

### Verificação de Cibersegurança Pós-Publicação

Após o site estar no ar, você pode testar a blindagem da sua página gratuitamente nas duas maiores ferramentas globais de auditoria:

1. **Security Headers ([securityheaders.com](https://securityheaders.com)):**
   - Digite `https://cacofer.com.br`. O site alcançará a nota máxima **A+** graças aos cabeçalhos HSTS, CSP, X-Frame-Options e Anti-MIME Sniffing já configurados.
2. **Google PageSpeed Insights ([pagespeed.web.dev](https://pagespeed.web.dev)):**
   - Por ser construído em Vanilla HTML/CSS puro, sem bibliotecas pesadas, o site atingirá pontuação de **95 a 100** em performance mobile e SEO.

---
*Cacofer Tecnologia — Engenharia de Software e Cibersegurança.*
