# Geliştirme Önerileri

## Durum Yönetimi ve Kalıcılık
- **Yerel depolama katmanını soyutlayın:** `App` içinde olaylar, kullanıcılar, departmanlar, IP ayarları, bildirimler ve loglar ayrı `useState` çağrılarıyla `localStorage`’a yazılıyor. Tekrarlı serileştirme/parse işlemlerini azaltmak ve hata yakalamayı merkezileştirmek için `usePersistentState` benzeri bir özel hook veya `zustand` gibi hafif bir store kullanabilirsiniz. Bu, hem type-safe kalır hem de okuma/yazma hatalarının kullanıcıya tostla bildirilebilmesini kolaylaştırır.
- **Veri şeması doğrulama:** `localStorage`’dan gelen veriler parse edilirken hata durumunda sessizce `INITIAL_*` listelerine düşülüyor; `zod` gibi bir doğrulama kütüphanesiyle beklenmeyen alanları temizleyip loglayarak veri bütünlüğünü koruyabilirsiniz.

## Erişim Kontrolü ve Roller
- **IP tabanlı erişimi yapılandırma dosyasına taşıyın:** Şu anda IP eşleşmeleri `App` içindeki state’te tutuluyor. Bunları `constants.ts` veya ayrı bir config dosyasından yükleyip UI’da düzenlenebilir hale getirirseniz dağıtım ortamına göre güvenli/kolay güncellenebilir olur. Ayrıca geçersiz IP girildiğinde kullanıcıya tost veya inline hata gösterilmesi kullanılabilirliği artırır.
- **Departman görünürlüğü için sunucu doğrulaması:** Rol belirleme tamamen istemci tarafında. Orta vadede basit bir API katmanı ekleyip departman kimliğini sunucudan doğrulatmak, IP spoofing riskini azaltacaktır.

## Bildirimler ve İletişim
- **EmailJS hatalarını kullanıcıya yansıtın:** E-posta gönderimi başarısız olduğunda yalnızca `console.error` veya `alert` gibi yöntemlerle uyarı veriliyor. Başarısızlık durumunda inline hata, yeniden deneme butonu ve log kaydı eklenerek kullanıcı deneyimi iyileştirilebilir.
- **Bildirim/Log tutulabilirliğini artırın:** Bildirimler ve loglar şu anda yalnızca tasarımcı rolüne açık. Rol bazlı filtreleme ekleyerek departman kullanıcılarının kendi eylemlerini görebilmesini sağlayabilir, geçmiş arama/filtrelemeleri loglara ekleyerek denetlenebilirliği yükseltebilirsiniz.

## Performans ve Kullanılabilirlik
- **Takvim ızgarası için sanallaştırma:** Ay görünümünde `eachDayOfInterval` ile tüm günler render ediliyor. Etkinlik sayısı arttığında `EventBadge` listelerinin yeniden render sayısını azaltmak için `React.memo` veya küçük bir sanallaştırma (örn. `react-window`) uygulanabilir.
- **Filtre durumunu URL’ye yansıtma:** Arama, atanan kişi ve aciliyet filtreleri yalnızca state’te duruyor. Parametreleri URL query string’e yazarak sayfa yenilendiğinde veya paylaşımda filtrelerin korunmasını sağlayabilirsiniz.
- **Erişilebilirlik kontrolleri:** Modallar ve popover’larda odak tuzağı, ESC kapatma ve ARIA rol/label’ları tutarlı hale getirilebilir. Klavye navigasyonunu doğrulamak için `@testing-library/react` ile etkileşim testleri eklemek faydalı olur.

## Test ve Kalite
- **Birim ve uçtan uca testler:** Projede test altyapısı yok. React Testing Library ile temel bileşen testleri, Playwright ile kritik akışlar (etkinlik ekleme, filtreleme, rol değişimi) için e2e senaryoları ekleyerek regresyon riskini düşürebilirsiniz.
- **Türkçe/İngilizce metin ayrıştırması:** Metinler bileşenlere serpiştirilmiş durumda. `i18next` veya basit bir sözlük nesnesiyle metinleri dışa alıp çok dilliliğe hazırlık ve tutarlılık sağlayabilirsiniz.

## DevOps ve Sürümleme
- **Çevre değişkenleri için şablon:** `GEMINI_API_KEY` `.env.local` beklentisi mevcut. Depolama anahtarları, EmailJS anahtarları gibi değerler için `.env.example` ekleyip README’de açıklamak geliştirici deneyimini iyileştirir.
- **Otomatik format/lint:** `package.json`’da format/lint script’i bulunmuyor. `eslint` + `prettier` yapılandırması ve pre-commit hook (örn. `husky`) ekleyerek kod standartlarını otomatize edebilirsiniz.

## Gelecek İşlevler
- **Takvim dışa aktarma / içe aktarma:** Etkinlikleri CSV/ICS olarak dışa aktarma ve içe aktarma özelliği eklemek, departmanların diğer sistemlerle entegrasyonunu kolaylaştırır.
- **Hatırlatıcılar ve tekrar eden etkinlikler:** Aciliyet düzeyine göre e-posta/push hatırlatıcıları ve haftalık/aylık tekrar eden etkinlikler kampanya takibine esneklik katar.
