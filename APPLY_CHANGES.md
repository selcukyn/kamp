# Daha önce yapılan değişiklikleri GitHub deposuna uygulama rehberi

Aşağıdaki adımlar, elinizdeki yerel proje klasöründeki son değişiklikleri GitHub’daki depoya göndermek için örnek bir akış sunar. Komutlar git kurulumunun hazır ve uzaktan `origin` adresinin GitHub’daki depoyu gösterdiği varsayımıyla hazırlanmıştır.

1. **Durumu kontrol edin**
   ```bash
   git status
   ```
   Çalışma ağacınızın temiz olduğundan ve beklenmedik dosyalar olmadığından emin olun.

2. **Güncel kodu alın (isteğe bağlı ama önerilir)**
   ```bash
   git pull --rebase origin <ana-branch>
   ```
   Genellikle ana branch `main` ya da `master` olur. Bu adım, yerel değişikliklerinizi göndermeden önce uzak depodaki son değişiklikleri alır.

3. **Yeni değişiklikleri ekleyin**
   Arşivden çıkardığınız veya başka şekilde güncellediğiniz dosyaları ekleyin:
   ```bash
   git add .
   ```
   Yalnızca belirli dosyaları eklemek istiyorsanız, `git add <dosya>` kullanabilirsiniz.

4. **Değişiklikleri açıklayan bir commit oluşturun**
   ```bash
   git commit -m "Restore components and fix date-fns imports"
   ```
   Mesajı ihtiyacınıza göre düzenleyin. Bu adım, değişiklikleri yerel commit hâline getirir.

5. **Commit’i GitHub’a gönderin**
   ```bash
   git push origin <branch-adiniz>
   ```
   Çalıştığınız branch genellikle `main` veya geliştirme için açtığınız başka bir branch olabilir. Eğer branch GitHub’da yoksa bu komut yeni branch’i oluşturur.

6. **(Opsiyonel) Pull request açın**
   GitHub arayüzünden branch’iniz için bir Pull Request açarak kod incelemesi ve birleştirme akışını başlatabilirsiniz. PR açıklamasına özet, yapılan değişiklikler ve test sonuçlarını eklemek iyi bir pratiktir.

### Sık karşılaşılan sorunlar
- **Yetkilendirme hataları**: GitHub’ın kişisel erişim token’ını (PAT) veya SSH anahtarını yapılandırmanız gerekebilir.
- **Rebase/merge çatışmaları**: `git status` ve ilgili dosyalardaki çatışma işaretlerini kullanarak manuel çözüm yapın, ardından `git add` ve `git rebase --continue` veya `git merge --continue` komutlarıyla devam edin.
- **Yanlış branch’e push**: `git branch` ile bulunduğunuz branch’i kontrol edin; gerekirse `git switch <dogru-branch>` ile doğru branch’e geçip yeniden push edin.

Bu adımları izleyerek yereldeki son değişikliklerinizi GitHub’daki depoya aktarabilir ve gerekirse bir Pull Request ile kod inceleme sürecini başlatabilirsiniz.
