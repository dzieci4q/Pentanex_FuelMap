# Pentanex FuelMap — pakiet startowy

## Co jest gotowe

- Odświeżone oznakowanie: logo Pentanex z nazwą firmy i sloganem jest widoczne w nagłówku aplikacji; ikony PWA również zawierają branding Pentanex.


- `podglad.html` — interaktywna makieta ekranu. Możesz ją otworzyć od razu, bez konta Google Maps, klucza API, GitHuba i hostingu. Markery są poglądowe; dotknięcie otwiera kartę stacji i przyciski map.
- `podglad_pentanex.png` — zrzut wizualizacji do szybkiego obejrzenia na iPhonie.
- `index.html`, `styles.css`, `script.js` — początkowa wersja PWA z mapą OpenStreetMap/Leaflet, wyszukiwaniem, GPS, kartą szczegółów, Google Maps Street View / trasą i nawigacją.
- `stations.json` — 149 rekordów przetworzonych z CSV źródłowego.
- `stations_source.csv` — oryginalny CSV z zachowaniem kolumn źródłowych.
- `stations_geocoding_template.csv` — szablon do uzupełnienia zweryfikowanymi współrzędnymi.
- `manifest.json`, `sw.js` — instalacja na ekranie i cache podstawowych plików.
- `assets/` — logo SVG i ikony aplikacji.

## Ważne ograniczenia danych

1. Dostarczony CSV ma **149 wpisów: 110 z Holandii i 39 z Belgii**, ale nie zawiera szerokości i długości geograficznej. Dlatego aplikacja produkcyjna nie przypisuje stacji do przypadkowych miejsc na mapie. `stations.json` ma `lat: null`, `lon: null` — współrzędne trzeba uzupełnić i zweryfikować.
2. CSV nie zawiera aktualnych cen paliw. Prototyp pokazuje brak danych zamiast wymyślać ceny. Źródło cen wymaga osobnego uzgodnienia. TomTom Fuel Prices API wymaga kontaktu z działem sprzedaży i nie jest częścią standardowego darmowego dostępu: https://docs.tomtom.com/fuel-prices-api/documentation/product-information/introduction
3. Część rekordów w kolumnie `Verification status` wskazuje, że lokalizacja tankowania pod adresem nie jest potwierdzona. Te punkty trzeba zweryfikować przed wydaniem aplikacji kierowcom.
4. `podglad.html` jest makietą interfejsu: geograficzny układ mapy i lokalizacja nie są rzeczywiste. Używa przykładowych markerów wyłącznie do pokazania zachowania menu. Przyciski Google Maps otwierają wyszukiwanie/trasy dla rzeczywistego adresu.
5. Aplikacja przechodzi obecnie do Google Maps po trasę/podgląd ulicy. Bez współrzędnych lub potwierdzonego identyfikatora miejsca Google może wybrać podobny adres — dlatego współrzędne muszą być sprawdzone.

## Zobacz makietę na iPhonie — bez GitHuba

1. Pobierz `Pentanex_FuelMap.zip` z tej rozmowy.
2. Otwórz aplikację **Pliki** na iPhonie i znajdź pobrany ZIP (zwykle w „Pobrane”). Stuknij ZIP, aby go rozpakować.
3. Wejdź do folderu `Pentanex_FuelMap` i stuknij `podglad_pentanex.png`, by obejrzeć obraz makiety.
4. Aby przetestować przyciski, otwórz `podglad.html`. Jeśli iOS wyświetli kod zamiast strony, użyj obrazu PNG do obejrzenia wyglądu — to ograniczenie otwierania lokalnych plików HTML w iOS. Nie musisz przesyłać niczego do GitHuba.

## Jak uruchomić wersję PWA na ekranie głównym iPhone'a

Pliki są przygotowane, ale PWA z GPS i service workerem wymaga adresu HTTPS. Samo otwarcie `index.html` z aplikacji Pliki nie wystarczy do pełnej instalacji.

1. **Nie publikuj ZIP-a ani `stations.json` na publicznej stronie.** Lista jest przeznaczona wyłącznie dla pracowników Pentanex.
2. Poproś osobę odpowiedzialną za IT w Pentanex o prywatny hosting HTTPS z logowaniem pracowników (lub firmowy VPN/SSO). Wdrażaj katalog aplikacji na prywatnym serwerze, nie na publicznym, niechronionym hostingu statycznym.
3. Przed uruchomieniem uzupełnij `latitude` i `longitude` w `stations_geocoding_template.csv` w kontrolowanym, firmowo zatwierdzonym procesie geokodowania. Nie należy wysyłać całej listy na przypadkową stronę geokodującą. Przenieś sprawdzone wartości do odpowiednich rekordów `lat` i `lon` w `stations.json`.
4. Uzgodnij wiarygodne źródło cen paliw (np. umowa z dostawcą danych). Nie wpisuj cen ręcznie bez daty aktualizacji i źródła.
5. Opublikuj pliki aplikacji pod firmowym adresem HTTPS, z autoryzacją przed udostępnieniem `stations.json`.
6. Na iPhonie otwórz adres w Safari i zezwól na lokalizację, gdy pojawi się pytanie.
7. W Safari stuknij **Udostępnij → Dodaj do ekranu początkowego → Dodaj**. Uruchamiaj aplikację ikoną Pentanex na ekranie głównym.

## Struktura `stations.json`

Każdy rekord przechowuje `id`, `name`, `address`, `city`, `country`, `source`, `verificationStatus`, `lat`, `lon` i `prices`. Pola `lat`, `lon` oraz `prices` są celowo puste do czasu weryfikacji.

## Bezpieczeństwo — wymagane przed użyciem przez pracowników

To jest pakiet startowy/prototyp, **nie gotowy system produkcyjny**. Samo umieszczenie strony za trudnym do odgadnięcia adresem nie zabezpiecza listy. Wymagane jest logowanie pracowników oraz ograniczenie dostępu do wszystkich plików danych, kopii zapasowych i API. Ogranicz zbieranie lokalizacji do momentu, gdy kierowca otwiera mapę lub prosi o GPS; nie zapisuj śladów lokalizacji na serwerze bez zatwierdzonej potrzeby i polityki prywatności.

## Użyte komponenty

- Leaflet 1.9.4 (CDN) i kafelki OpenStreetMap do mapy w wersji aplikacyjnej.
- Google Maps URLs do wyszukiwania stacji i uruchamiania trasy/podglądu ulicy. Google podaje, że Maps URLs działają między platformami i nie wymagają klucza API: https://developers.google.com/maps/documentation/urls/get-started
- Zewnętrzna mapa wymaga internetu. Cache PWA dotyczy plików aplikacji i danych — nie gwarantuje pełnej mapy offline.


## Aktualizacja: geokodowanie adresów i ceny

### Umieszczanie stacji na mapie
W aplikacji jest przycisk **„Znajdź stacje na mapie”**. Dla adresów bez współrzędnych wykonuje zapytania do OpenStreetMap Nominatim pojedynczo, z odstępem ok. 1,1 s, i zapisuje znalezione współrzędne w pamięci przeglądarki na danym urządzeniu. Nie zamykaj aplikacji podczas procesu; 149 adresów może wymagać kilku minut. Wyniki są dopasowaniami automatycznymi, więc trzeba zweryfikować każdy punkt przed użyciem operacyjnym. Usługa może odrzucić niejednoznaczne lub niepełne adresy. Atrybucja mapy: © OpenStreetMap contributors.

**Ważne dla wdrożenia firmowego:** współrzędne znalezione w ten sposób są lokalne dla przeglądarki danego urządzenia i nie są automatycznie zapisane w `stations.json` ani współdzielone z pozostałymi kierowcami. Przed wdrożeniem do całej firmy należy zatwierdzić wyniki i zapisać je w firmowej bazie danych. Nie używaj publicznego geokodera jako masowej usługi produkcyjnej dla wszystkich kierowców.

### Darmowe ceny orientacyjne — aktywowane w aplikacji

Karta stacji próbuje pobrać bezpłatne podsumowanie z `https://www.fuel-prices.eu/live/api.php?action=summary`, ale aktualny dokument API nie zawiera danych dla Holandii (NL) ani Belgii (BE). Dlatego nie traktujemy go jako źródła cen dla tych krajów. Jeśli brak danych, karta pokazuje linki do FuelScan, oficjalnych cen maksymalnych Belgii i danych CBS Holandii zamiast wymyślonych cen. Metodologia FuelScan potwierdza, że Holandia ma dane średniej krajowej, a Belgia oficjalne ceny maksymalne: https://fuelscan.eu/methodology .

To jest bezpłatne rozwiązanie przejściowe, nie zastępuje kanału cen na poziomie stacji. Fuel-prices.eu opisuje darmowy limit 1 000 zapytań miesięcznie dla planu Free; cache należy respektować. W obecnej wersji pobieramy podsumowanie tylko po otwarciu karty stacji, więc przy 149 stacjach może być potrzebne cache po stronie aplikacji lub proxy, aby ograniczyć liczbę żądań.

### Ceny paliw na żywo
W tym pakiecie **nie ma aktywnego źródła aktualnych cen**. Sam plik CSV nie zawiera cen, a aplikacja nie może ich wiarygodnie wywnioskować. Żeby pokazywać ceny prawdziwe, Pentanex musi uzyskać legalny dostęp do dostawcy danych (np. TomTom Fuel Prices, jeśli obejmuje potrzebne stacje i paliwa), klucz/API oraz skonfigurować firmowy endpoint HTTPS. Klucza dostawcy nie wolno umieszczać w kodzie front-endowym aplikacji.

Plik `config.js` zawiera pola integracji: `priceProvider` i `priceApiProxy`. Po uruchomieniu własnego endpointu ustaw `priceApiProxy` na adres HTTPS zwracający dla zapytania `stationId`, `lat`, `lon` obiekt JSON w formacie:

```json
{
  "items": [
    { "fuel": "Diesel", "price": "1.699" }
  ],
  "updatedAt": "2026-10-24T12:00:00Z"
}
```

Cena i czas aktualizacji muszą pochodzić od dostawcy, nie z przykładowego JSON. Endpoint powinien weryfikować użytkownika i klucz dostawcy po stronie serwera. Do momentu konfiguracji aplikacja wyraźnie informuje, że ceny na żywo nie są dostępne — nie pokazuje fikcyjnych cen.


## Wdrożenie HTTPS bez GitHuba — Cloudflare Pages

Przygotowałem pliki konfiguracyjne dla Cloudflare Pages. Platforma automatycznie udostępnia witrynę przez HTTPS; aktualna dokumentacja potwierdza możliwość wdrożenia bez repozytorium, przez przesłanie ZIP-a: https://developers.cloudflare.com/pages/get-started/direct-upload/.

**Ważne:** samo HTTPS szyfruje połączenie, ale nie ogranicza dostępu do firmowej listy. Przed umieszczeniem prawdziwych danych stacji skonfiguruj Cloudflare Access i wymagaj logowania pracowników. Bez tego strona na `*.pages.dev` może być publiczna.

1. Otwórz https://dash.cloudflare.com/ i zaloguj się albo utwórz konto.
2. Wejdź w **Workers & Pages → Create application → Pages → Direct Upload / Drag and drop**.
3. Nadaj projektowi nieoczywistą nazwę i prześlij plik ZIP z pakietu. Jeśli panel nie przyjmie ZIP-a na iPhonie, trzeba wykonać ten etap z komputera albo użyć funkcji „Wersja na komputer” w Safari — nie zmieniaj przy tym dostępu na publiczny.
4. Po wdrożeniu Cloudflare poda adres `https://NAZWA.pages.dev`. Sprawdź, czy strona otwiera się przez HTTPS.
5. Wejdź do **Workers & Pages → wybierz projekt → Settings / Access** i włącz ochronę Cloudflare Access. Następnie w **Zero Trust → Access → Applications** sprawdź, że aplikacja obejmuje dokładnie produkcyjny host `NAZWA.pages.dev` (nie tylko adresy podglądu). Dodaj politykę **Allow** dla zatwierdzonych adresów e-mail pracowników i upewnij się, że domyślnie niezalogowani są blokowani. Instrukcja dla `pages.dev`: https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain.
6. Jeśli pojawi się osobny adres domeny własnej, zabezpiecz go osobną aplikacją Access. Zabezpiecz też hosty podglądowe lub wyłącz wdrożenia podglądowe, jeśli nie są potrzebne.
7. W ustawieniach projektu włącz **Always Use HTTPS**, jeśli ta opcja jest dostępna. Testuj stronę zarówno w zwykłym Safari, jak i w oknie prywatnym: niezalogowany użytkownik powinien zobaczyć ekran logowania/blokadę, a nie mapę.
8. Dopiero po potwierdzeniu logowania otwórz adres w Safari na iPhonie i wybierz **Udostępnij → Dodaj do ekranu początkowego**.

W paczce dodałem `_headers` z nagłówkami bezpieczeństwa, zakazem indeksowania i `no-store` dla danych konfiguracyjnych oraz listy stacji. Zmieniłem też service worker tak, aby nie zapisywał `stations.json` w pamięci podręcznej aplikacji. To dodatkowe zabezpieczenia, **nie zastępują logowania Cloudflare Access**.

**Nie mogę aktywować hostingu w Twoim imieniu z tej rozmowy**, ponieważ wymaga to zalogowania się na konto Cloudflare i ustawienia polityki dostępu. Pakiet jest przygotowany, ale wdrożenie nie jest jeszcze opublikowane. Nie przesyłaj firmowej listy stacji do publicznego hostingu bez włączenia Access.
