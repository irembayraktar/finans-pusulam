# GitHub ve Yayinlama Rehberi

Bu rehber Finans Pusulam projesini GitHub'a yuklemek ve canli demo olarak yayinlamak icin hazirlanmistir.

## 1. Projeyi Kontrol Et

VS Code terminalinde proje klasorunde ol:

```powershell
cd "C:\Users\iremb\OneDrive\Desktop\finans-pusulam"
```

Kontrol komutlari:

```powershell
pnpm install
pnpm lint
pnpm build
```

Ucu de hatasiz bitiyorsa proje GitHub'a hazirdir.

## 2. GitHub Repository Olustur

GitHub'da yeni repository olustur:

```text
finans-pusulam
```

Onerilen ayarlar:

- Public
- README ekleme: kapali
- .gitignore ekleme: kapali
- License ekleme: istege bagli

Bu projede README ve .gitignore zaten var.

## 3. Ilk Commit

Terminalde:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/finans-pusulam.git
git push -u origin main
```

`KULLANICI_ADIN` kismini kendi GitHub kullanici adinla degistir.

## 4. Netlify ile Yayinla

1. https://www.netlify.com/ adresine gir.
2. GitHub hesabinla giris yap.
3. `Add new project` sec.
4. `Import an existing project` sec.
5. `finans-pusulam` repository'sini sec.
6. Build command: `pnpm build`
7. Publish directory: `dist`
8. Environment variables alanina Supabase degerlerini ekle:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
9. Deploy butonuna bas.

Deploy bitince Netlify sana canli link verir.

## 5. README'ye Canli Demo Linkini Ekle

README dosyasinda canli demo bolumune Netlify'nin verdigi gercek linki ekle.

Sonra:

```powershell
git add README.md
git commit -m "Add live demo link"
git push
```

## 6. GitHub Profilinde Sabitle

GitHub profilinde:

1. Profile git.
2. `Customize your pins` sec.
3. `finans-pusulam` projesini sabitle.

Bu sayede is basvurularinda ilk gorunen projelerden biri olur.
