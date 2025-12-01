/**
 * Utilitários de segurança para prevenir interceptação de dados
 */

// Força HTTPS em produção
export const enforceHTTPS = () => {
  if (
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost' &&
    !window.location.hostname.includes('127.0.0.1')
  ) {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
};

// Previne clickjacking
export const preventClickjacking = () => {
  if (window.self !== window.top) {
    window.top!.location.href = window.self.location.href;
  }
};

// Sanitiza URLs antes de fazer requisições
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Permite apenas HTTPS em produção
    if (
      import.meta.env.PROD &&
      parsed.protocol !== 'https:' &&
      !parsed.hostname.includes('localhost')
    ) {
      throw new Error('Only HTTPS URLs are allowed in production');
    }
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL');
  }
};

// Inicializa todas as proteções de segurança
export const initSecurity = () => {
  enforceHTTPS();
  preventClickjacking();
  
  // Desabilita console em produção
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
};
