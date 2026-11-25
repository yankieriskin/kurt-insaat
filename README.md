# Kurt İnşaat web sitesi

Astro ile yapılmış statik site. Sunucu, veritabanı ya da çerez yok; formlar bilgileri WhatsApp mesajı olarak açar.

## İçeriği değiştirmek

Bütün yazılar, projeler, daireler, fiyatlar ve ilanlar tek dosyada: `src/data/site.ts`.
Dosyanın başındaki yorumda örnek (yer tutucu) olan her şey listelenmiş.

- Telefon, WhatsApp, e-posta, adres: `site` nesnesi
- Bir dairenin durumu (satışta, opsiyonlu, satıldı): projedeki `...Status` dizisi ya da `units`
- Yeni ilan: `portfolio` dizisine bir kayıt ekleyin
- Görseller: `src/assets/img/` klasörüne koyun, `site.ts` başında içe aktarın

Gerçek bilgiler girildiğinde `site.placeholder` değerini `false` yapın: altbilgideki "örnek içerik" notu ve
arama motorlarını engelleyen `noindex` etiketi kalkar.

## Çalıştırmak

```bash
npm install
npm run dev        # geliştirme: http://localhost:4321
npm run build      # yayın dosyaları dist/ klasörüne
npm run preview    # yayın dosyalarını yerelde aç
```

## Yayına almak

`dist/` klasörü herhangi bir statik barındırmaya (GitHub Pages, Netlify, Cloudflare Pages, Vercel) konabilir.
Önce `astro.config.mjs` içindeki `site` ve `src/data/site.ts` içindeki `url` değerini gerçek alan adıyla değiştirin,
`public/robots.txt` içindeki adresi de güncelleyin.
