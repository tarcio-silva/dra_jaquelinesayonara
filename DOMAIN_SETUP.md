# Configuração do Domínio — drajaquelinesayonara.com.br

Guia completo para configurar o domínio personalizado na Vercel.

---

## 1. Adicionar o Domínio na Vercel

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione o projeto **drajaquelinesayonara**
3. Vá em **Settings** > **Domains**
4. No campo de texto, digite: `drajaquelinesayonara.com.br`
5. Clique em **Add**
6. A Vercel vai sugerir adicionar também o `www.drajaquelinesayonara.com.br` — aceite para configurar ambos
7. Escolha o domínio raiz (`drajaquelinesayonara.com.br`) como primário, com redirect do `www` para o root (ou vice-versa, conforme preferência)

---

## 2. Configurar DNS no Registrador

Acesse o painel do seu registrador de domínios (Registro.br, GoDaddy, Hostgator, etc.) e configure os seguintes registros DNS:

### Domínio raiz (drajaquelinesayonara.com.br)

| Tipo | Nome/Host | Valor | TTL |
|------|-----------|-------|-----|
| A    | `@` (ou vazio) | `76.76.21.21` | 3600 (ou automático) |

### Subdomínio www

| Tipo  | Nome/Host | Valor | TTL |
|-------|-----------|-------|-----|
| CNAME | `www`     | `cname.vercel-dns.com` | 3600 (ou automático) |

> **Nota:** Alguns registradores usam `@` para representar o domínio raiz, outros deixam o campo vazio. Consulte a documentação do seu registrador.

---

## 3. Remover Redirects Existentes no Registrador

Antes de configurar os registros DNS acima, verifique se o registrador possui algum **redirect (encaminhamento)** ativo para o domínio:

1. No painel do registrador, procure por seções como "Redirecionamento", "Forwarding" ou "URL Redirect"
2. **Remova todos os redirects** configurados para `drajaquelinesayonara.com.br` e `www.drajaquelinesayonara.com.br`
3. Redirects no registrador conflitam com os registros DNS e impedem que a Vercel receba o tráfego corretamente

> **Importante:** No Registro.br, verifique a aba "DNS" e também a aba "Redirecionamento". Ambas devem estar limpas/apontando para os valores corretos.

---

## 4. Verificar Propagação DNS

Após configurar os registros, aguarde a propagação (pode levar de 5 minutos a 48 horas, geralmente menos de 1 hora).

### Usando `dig` (Linux/macOS)

```bash
# Verificar registro A do domínio raiz
dig drajaquelinesayonara.com.br A +short
# Esperado: 76.76.21.21

# Verificar registro CNAME do www
dig www.drajaquelinesayonara.com.br CNAME +short
# Esperado: cname.vercel-dns.com.
```

### Usando `nslookup` (Windows/Linux/macOS)

```bash
# Verificar registro A do domínio raiz
nslookup drajaquelinesayonara.com.br
# Esperado: Address: 76.76.21.21

# Verificar registro CNAME do www
nslookup -type=CNAME www.drajaquelinesayonara.com.br
# Esperado: canonical name = cname.vercel-dns.com.
```

### Verificação online

Caso prefira, use ferramentas online como:
- [dnschecker.org](https://dnschecker.org/)
- [whatsmydns.net](https://www.whatsmydns.net/)

---

## 5. SSL e Redirect Automático

A Vercel cuida automaticamente dos seguintes pontos após a propagação DNS:

- **Certificado SSL (HTTPS):** Gerado e renovado automaticamente via Let's Encrypt
- **Redirect do .vercel.app:** A URL `drajaquelinesayonara.vercel.app` será automaticamente redirecionada (301) para `drajaquelinesayonara.com.br`
- **Redirect www ↔ root:** Configurado conforme escolhido no passo 1 (a Vercel faz o redirect 308 automaticamente)
- **HSTS:** Habilitado por padrão

### Verificação do SSL

Após a propagação DNS, o status do domínio no dashboard da Vercel mudará de "Pending" para "Valid". O certificado SSL é provisionado em poucos minutos após a validação do DNS.

Se o status ficar em "Pending" por mais de 1 hora:
1. Verifique se os registros DNS estão corretos com `dig`
2. Confirme que não há redirects no registrador
3. Tente remover e re-adicionar o domínio na Vercel

---

## Resumo

| Etapa | Ação |
|-------|------|
| 1 | Adicionar domínio na Vercel (Settings > Domains) |
| 2 | Configurar A record `76.76.21.21` + CNAME `cname.vercel-dns.com` |
| 3 | Remover redirects do registrador |
| 4 | Verificar propagação com `dig` ou `nslookup` |
| 5 | Aguardar SSL automático e confirmar status "Valid" na Vercel |
