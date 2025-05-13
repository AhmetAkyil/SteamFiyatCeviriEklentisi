// Kur API'si
const exchangeRateAPI = 'https://api.exchangerate-api.com/v4/latest/USD';

// Fiyatları TL'ye çevir
function convertPricesToTRY() {
    fetch(exchangeRateAPI)
        .then(response => response.json())
        .then(data => {
            const exchangeRate = data.rates.TRY;

            // Ana sayfadaki fiyatları çevir
            const priceElements = document.querySelectorAll('.game_purchase_price, .discount_final_price, .search_price');
            convertElements(priceElements, exchangeRate);

            // Arama önerilerindeki fiyatları çevir
            const searchSuggestionPrices = document.querySelectorAll('.match_subtitle');
            convertElements(searchSuggestionPrices, exchangeRate);

            // Yeni belirtilen elementlerdeki fiyatları çevir
            const additionalPriceElements = document.querySelectorAll('._3j4dI1yA7cRfCvK8h406OB');
            convertElements(additionalPriceElements, exchangeRate);
        })
        .catch(error => console.error('Döviz kuru alınırken hata oluştu:', error));
}

// Elementleri TL'ye çevir
function convertElements(elements, exchangeRate) {
    elements.forEach(element => {
        // Eğer fiyat zaten TL'ye çevrilmişse, tekrar çevirme
        if (element.dataset.converted === 'true') return;

        const priceText = element.textContent.trim();
        const priceValue = parseFloat(priceText.replace(/[^0-9.]/g, ''));

        if (!isNaN(priceValue)) {
            const convertedPrice = (priceValue * exchangeRate).toFixed(2);
            element.textContent = `${convertedPrice} TRY`;
            element.dataset.converted = 'true'; // Fiyatın çevrildiğini işaretle
        }
    });
}

// Sayfa yüklendiğinde fiyatları çevir
window.addEventListener('load', convertPricesToTRY);

// Arama kutusunu dinle
const searchInput = document.querySelector('#store_nav_search_term');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        setTimeout(convertPricesToTRY, 500);
    });
}

// Sayfa dinamik olarak değiştiğinde de fiyatları çevir
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            convertPricesToTRY();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
