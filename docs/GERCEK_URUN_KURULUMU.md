# Gerçek Ürün Kurulumu

Bu rehber Finans Pusulam uygulamasını demo moddan çıkarıp gerçek kullanıcı girişi ve veritabanı ile çalıştırmak için hazırlanmıştır.

## 1. Supabase Projesi Oluştur

1. https://supabase.com adresine gir.
2. Yeni proje oluştur.
3. Project URL ve anon public key değerlerini al.

Frontend tarafında sadece şu iki değer kullanılacak:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Service role key frontend dosyalarına kesinlikle konmamalıdır.

## 2. Ortam Değişkenlerini Hazırla

Proje kökünde `.env.example` dosyasını kopyala ve `.env.local` oluştur:

```powershell
copy .env.example .env.local
```

`.env.local` içine kendi Supabase bilgilerini yaz:

```text
VITE_SUPABASE_URL=https://project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

Vite dev server açıksa kapatıp tekrar başlat:

```powershell
pnpm dev
```

## 3. Veritabanı Şemasını Kur

Supabase panelinde:

1. SQL Editor bölümüne gir.
2. `supabase/schema.sql` dosyasındaki tüm SQL'i yapıştır.
3. Run butonuna bas.

Bu dosya şunları oluşturur:

- `profiles` tablosu
- `transactions` tablosu
- `avatars` storage bucket
- Row Level Security politikaları
- Kullanıcının sadece kendi verisini görmesini sağlayan kurallar

## 4. Auth Ayarları

Supabase panelinde Authentication bölümünden:

- Email provider açık olmalı.
- İlk test için email confirmation kapatılabilir.
- Canlı üründe email confirmation açık tutulması önerilir.

## 5. Çalıştırma

```powershell
pnpm install
pnpm dev
```

Uygulama artık Supabase modu ile açılır. Kullanıcı kayıt/giriş ekranı görünür.

## 6. Netlify Ortam Degiskenleri

Netlify deploy sirasinda proje ayarlarinda Environment Variables bolumune sunlari ekle:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Sonra yeniden deploy et.

## 7. Üretim Öncesi Kontrol Listesi

- [ ] Supabase RLS açık mı?
- [ ] Kullanıcı başka kullanıcının kayıtlarını göremiyor mu?
- [ ] `.env.local` GitHub'a yüklenmiyor mu?
- [ ] Service role key hiçbir frontend dosyasında yok mu?
- [ ] Netlify environment variable degerleri dogru mu?
- [ ] Kayıt, giriş, çıkış çalışıyor mu?
- [ ] Gelir/gider ekleme ve silme çalışıyor mu?
- [ ] Profil fotoğrafı yükleniyor mu?
