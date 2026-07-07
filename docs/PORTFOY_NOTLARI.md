# Portföy ve Mülakat Notları

Bu dosya Finans Pusulam projesini CV'de, GitHub'da ve mülakatta anlatmak için kısa notlar içerir.

## CV Maddesi

```text
Finans Pusulam: React, TypeScript ve Vite ile kişisel finans takibi için responsive dashboard uygulaması geliştirdim. Gelir-gider yönetimi, kategori bazlı analiz, profil fotoğrafı yükleme, localStorage ile veri saklama ve mock açık bankacılık görünümü ekledim.
```

## Kısa Mülakat Anlatımı

```text
Bu projede kişisel finans takibi yapılabilen bir frontend uygulaması geliştirdim. Kullanıcı gelir ve gider ekleyebiliyor, kategorilere göre harcama dağılımını görebiliyor ve aylık özet metrikleri takip edebiliyor. Veriyi ilk sürümde localStorage'da tuttum çünkü portföy demosunda hızlı ve güvenli bir kullanım hedefledim. Gerçek banka bağlantısı yerine mock veri kullandım; böylece açık bankacılık fikrini gösterebildim ama kullanıcı şifresi veya hassas finansal veri saklamadım.
```

## Teknik Olarak Anlatılabilecekler

- Transaction verisi `income` ve `expense` tipleriyle ayrıldı.
- Toplam gelir, toplam gider, bakiye ve birikim oranı transaction listesinden hesaplandı.
- Form alanları React state ile kontrollü input olarak yönetildi.
- Profil fotoğrafı `FileReader` ile tarayıcıda önizlendi.
- Veriler localStorage'a kaydedildi, sayfa yenilenince korunması sağlandı.
- Açık bankacılık bölümü gerçek API yerine mock veriyle gösterildi.
- Responsive CSS grid yapısıyla masaüstü ve mobil ekranlar desteklendi.

## Güvenlik Kararı Nasıl Anlatılır?

```text
Gerçek banka entegrasyonu yapmadım çünkü finansal veriler hassas. Böyle bir özellik canlı üründe lisanslı açık bankacılık sağlayıcısı ve güvenli backend üzerinden yapılmalı. Frontend tarafında banka şifresi, API secret veya kalıcı access token saklanmamalı.
```

## Geliştirme Yol Haritası

1. Supabase Auth ile kullanıcı girişi eklemek
2. Gelir-gider kayıtlarını Supabase veritabanına taşımak
3. Profil fotoğrafını Supabase Storage'da saklamak
4. Grafiklerle aylık trend analizi yapmak
5. Bütçe hedefi ve limit uyarıları eklemek
6. Lisanslı sağlayıcıyla açık bankacılık entegrasyonu planlamak
