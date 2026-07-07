# Finans Pusulam

Finans Pusulam, kişisel finans okuryazarlığını artırmaya yönelik hazırlanmış React + TypeScript uygulamasıdır. Kullanıcı gelir ve giderlerini kategorilere ayırabilir, aylık finans özetini görebilir, profil fotoğrafı ekleyebilir ve demo açık bankacılık görünümü üzerinden hesap bakiyelerini inceleyebilir.

Uygulama iki modda çalışır:

- Demo mod: Supabase ayarı yoksa localStorage ile portföy demosu olarak çalışır.
- Gerçek ürün modu: Supabase ayarı varsa kullanıcı kayıt/giriş, veritabanı ve profil fotoğrafı storage akışları açılır.

> Gerçek banka entegrasyonu içermez. Banka alanı şu an güvenli mock/demo veridir.

## Canlı Demo

Canli demo:

```text
https://incomparable-seahorse-55ac17.netlify.app
```

## Ekran Görüntüsü

GitHub'a yükledikten sonra buraya uygulama ekran görüntüsü eklenebilir:

```md
![Finans Pusulam dashboard](./docs/screenshots/dashboard.png)
```

## Özellikler

- Aylık toplam gelir, toplam gider, kalan bakiye ve birikim oranı
- Gelir ve gider ekleme formu
- Gelir kategorileri: Maaş, Ek gelir, Yatırım, Hediye, Diğer
- Gider kategorileri: Market, Fatura, Kira, Ulaşım, Sağlık, Eğitim, Eğlence, Diğer
- Kategori bazlı gider dağılımı
- Profil bilgisi ve profil fotoğrafı yükleme
- Supabase Auth ile kullanıcı kayıt/giriş altyapısı
- Supabase Database ile kullanıcıya bağlı transaction altyapısı
- Supabase Storage ile profil fotoğrafı altyapısı
- Motive edici finans sözleri
- Finans okuryazarlığı ipuçları
- Demo banka bağlantısı
- localStorage ile tarayıcıda veri saklama
- Mobil uyumlu dashboard tasarımı

## Demo Banka Görünümü

Uygulamadaki banka bağlantısı gerçek değildir. Demo olarak şu hesap türleri gösterilir:

- Vadesiz TL hesabı
- Kredi kartı dönem borcu
- Vadeli hesap
- Altın hesabı

Bu yaklaşım, gerçek banka API anahtarı veya kullanıcı şifresi kullanmadan açık bankacılık fikrini güvenli şekilde göstermek için tercih edilmiştir.

## Teknolojiler

- React
- TypeScript
- Vite
- CSS
- localStorage
- Supabase

## Kurulum

Projeyi bilgisayarında çalıştırmak için:

```bash
pnpm install
pnpm dev
```

Tarayıcıda aç:

```text
http://localhost:5173
```

Production build almak için:

```bash
pnpm build
```

Lint kontrolü:

```bash
pnpm lint
```

## Gerçek Ürün Modu

Supabase ile çalıştırmak için:

1. `.env.example` dosyasını `.env.local` olarak kopyala.
2. Supabase URL ve anon public key değerlerini gir.
3. `supabase/schema.sql` dosyasını Supabase SQL Editor'de çalıştır.
4. `pnpm dev` ile uygulamayı yeniden başlat.

Ayrıntılı adımlar için:

- [Gerçek Ürün Kurulumu](./docs/GERCEK_URUN_KURULUMU.md)

## Proje Yapısı

```text
src/
  App.tsx      Ana uygulama, state yönetimi ve ekran akışları
  App.css      Dashboard ve responsive arayüz stilleri
  index.css    Global stiller
```

## Dokümanlar

- [GitHub ve Yayinlama Rehberi](./docs/GITHUB_VERCEL_REHBERI.md)
- [Portföy ve Mülakat Notları](./docs/PORTFOY_NOTLARI.md)
- [Gerçek Ürün Kurulumu](./docs/GERCEK_URUN_KURULUMU.md)
- [Ürün Yol Haritası](./docs/URUN_YOL_HARITASI.md)

## Güvenlik Notu

Bu proje gerçek banka API'sine bağlanmaz. Uygulama banka şifresi, access token, kart numarası veya gerçek finansal bilgi saklamaz.

Gerçek ürün haline getirilecekse:

- Kullanıcı girişi backend veya güvenilir auth servisi üzerinden yapılmalı
- Finansal kayıtlar kullanıcıya bağlı veritabanında tutulmalı
- Profil fotoğrafları güvenli storage servisinde saklanmalı
- Açık bankacılık entegrasyonu lisanslı sağlayıcı üzerinden yapılmalı
- Frontend tarafında banka şifresi veya API secret saklanmamalı

## Portföyde Anlatılabilecek Noktalar

- Gelir ve gider verisini tip, kategori, tarih ve not alanlarıyla modelleme
- localStorage kullanarak kalıcı frontend state yönetimi
- Form validasyonu ve kontrollü input kullanımı
- Dosya yükleme akışı ile profil fotoğrafı önizleme
- Dashboard metriklerini transaction listesinden hesaplama
- Gerçek banka entegrasyonu yerine güvenli mock/demo yaklaşımı
- Responsive arayüz tasarımı

## Gelecek Geliştirmeler

- Grafikler ve aylık trend analizi
- Bütçe hedefleri ve harcama limiti uyarıları
- Kayıt düzenleme
- Aylık filtreleme
- Lisanslı sağlayıcı üzerinden açık bankacılık entegrasyonu
