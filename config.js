// Konfiguracja integracji Pentanex. Nie wpisuj kluczy API do publicznego front-endu.
// Ceny wymagają serwerowego proxy i umowy/dostępu do dostawcy danych.
window.PENTANEX_CONFIG = {
  priceProvider: '', // np. 'tomtom' po aktywacji dostępu
  priceApiProxy: ''  // firmowy endpoint HTTPS, który zwraca JSON cen dla stacji
};
