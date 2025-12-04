# Backend & Database Migration Plan

## Why localStorage is insufficient
- **Tek cihaz ile sınırlı kalıcılık:** Veriler tarayıcıya bağlı kaldığı için ekip içi paylaşım veya farklı cihazdan erişim mümkün değil.
- **Yetkilendirme zafiyeti:** IP tabanlı rol simülasyonu gerçek kimlik doğrulama/oturum açma sağlamıyor; kullanıcı ve departman yetkileri güvence altında değil.
- **Bildirim tutarsızlığı:** E-posta gönderilse bile alıcı, tarayıcıda veri olmadığı için takvimde kaydı göremiyor; merkezi veri olmadan eşlenme sağlanamıyor.
- **Denetim ve yedeklilik:** localStorage silindiğinde veya tarayıcı temizlendiğinde kayıtlar kayboluyor; versiyonlama ve geri alma yok.

## Önerilen mimari
1) **API katmanı (Node.js + Express veya NestJS):**
   - JWT tabanlı oturum açma (e-posta/şifre veya SSO entegrasyonu).
   - Rol ve departman yetkilerini doğrulayan middleware.
   - REST veya GraphQL uçları:
     - `/auth/login`, `/auth/refresh`
     - `/users`, `/departments`
     - `/events` (listele, oluştur, güncelle, sil)
     - `/notifications` (okundu bilgisi)
   - Kuyruklu e-posta gönderimi (BullMQ + Redis) ile dayanıklı bildirim.
2) **Veritabanı (PostgreSQL tercihli):**
   - Tablolar: `users`, `departments`, `events`, `event_assignments`, `notifications`, `audit_logs`.
   - Zaman damgalı audit alanları (created_at, updated_at, created_by).
   - İlişkiler: etkinlik -> talep eden departman, atanmış kullanıcı; bildirim -> kullanıcı, etkinlik.
3) **İstemci entegrasyonu:**
   - `localStorage` başlangıç seed’lerini kaldırıp ilk yüklemede API’den veri çekmek.
   - React Query/SWR ile önbellek + optimistik güncellemeler.
   - Kimlik doğrulama için `accessToken` + `refreshToken` akışı; protected fetch helper.
   - Rol kontrolü için API’den dönen kullanıcı profilini kullanmak; IP simülasyonunu yalnızca geliştirme aracı olarak tutmak.

## Geçiş adımları
1. **Veri modelini netleştir:** mevcut `types.ts`’i temel alarak DB şemasını oluştur; örnek SQL script’i çıkar.
2. **API’yi inşa et:** auth, kullanıcı, departman, etkinlik uçlarını yaz; jest/supertest ile temel entegrasyon testleri ekle.
3. **İstemciyi bağla:** fetch katmanı ekle, React Query ile listeleme/oluşturma/güncelleme/silme işlemlerini API’ye taşı.
4. **Bildirim ve logları merkezileştir:** e-posta kuyruğu ve `audit_logs` tablosu ile logları server tarafında sakla; istemci yalnızca okuyucu olsun.
5. **Temizleme:** localStorage kullanımını kaldır, yalnızca JWT/refresh token ve kullanıcı tercihleri gibi istemci-özel verileri sakla.
6. **DevOps:** Docker Compose ile `web`, `api`, `db`, `redis` servisleri; staging/prod için migration (Prisma/MikroORM/TypeORM) ve seed scriptleri.

## Kısa vadeli emniyet bandı
Backend gelene kadar geçici çözüm olarak tarayıcılar arasında veri paylaşımı için:
- Bir "dışa aktar/aktar" JSON butonu ekleyip localStorage state’ini indirip yüklemek.
- Basit bir Supabase/Firestore entegrasyonu ile yalnızca `events` koleksiyonunu buluta yazmak (kimlik doğrulama zorunlu olmadan bile paylaşım sağlanır).

Bu plan, e-posta bildirimi alan kullanıcıların takvimde aynı kaydı görebilmesi için merkezi ve kalıcı veri katmanını devreye almayı hedefler.
