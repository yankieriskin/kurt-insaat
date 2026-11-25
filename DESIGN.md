# Kurt İnşaat: tasarım notları

## Brief

- **Kim:** Kurt İnşaat. İstanbul Anadolu yakasında konut yapan, satan ve kiraya veren bir müteahhit / emlak firması (varsayım: şehir ve ilçeler yer tutucu).
- **Kime:** oturmak için ev alan aileler, küçük yatırımcılar, kiracılar ve binasını kentsel dönüşüme sokmak isteyen kat malikleri.
- **Sitenin işi:** belirli bir daire için arama / WhatsApp mesajı getirmek, güven kurmak, arsa sahibi ve kat maliki başvurusu toplamak.
- **Dil:** Türkçe.
- **Varlık:** hiçbir gerçek görsel ya da bilgi verilmedi. Projeler, ilanlar, fiyatlar, telefon, adres yer tutucu (`placeholder: true`). Görseller yapay zekâ ile üretildi, sitede "Görseller temsilidir" yazıyor.

## Araştırmadan çıkanlar (25.11.2026)

- Büyük Türk müteahhitleri (Nef, Folkart, DAP) proje sayfalarında fiyatı, ödeme planını, kat planını, teslim tarihini, ruhsat / yapı denetim bilgisini ya hiç vermiyor ya formun arkasına saklıyor. Folkart'ın SSS'i kendi plan tablosuyla çelişiyor. **Küçük bir firmanın farkı açıklık olabilir.**
- Alıcıların sorduğu: net mi brüt mü, kat ve cephe, teslim tarihi, ruhsat var mı, deprem yönetmeliği, tapu durumu (kat irtifakı / kat mülkiyeti), ödeme planı.
- Ön ödemeli konut satışında yasa zaten şunları istiyor: net / brüt alan, fiyat, teslim tarihi, yapı ruhsatı tarihi, kat planı. Site bunları her dairede gösteriyor.
- Kentsel dönüşümde malikler: müteahhidin bitirdiği işler, mali gücü, tapu devrinin inşaat ilerlemesine bağlanması, net / brüt hesabı, kira yardımı, paylaşım şeması.
- Türkiye'de iletişim telefon ve WhatsApp ağırlıklı ("Sizi arayalım" formu, sabit WhatsApp düğmesi). Formlarda KVKK aydınlatma metni ve ayrı ticari ileti izni olağan.
- Ödüllü yabancı emlak siteleri (ERA Residence, Belgrade Arbor, Sobha): iki renkli sakin palet, kat / daire seçici, sinematik kaydırma. En zayıf puanları kullanılabilirlik.

## Konseptler

| | Fikir | Dayanak | İmza | Ö / U / Y / T |
|---|---|---|---|---|
| A. Malzeme | Site bir binanın kesiti: çatıdan (+18.00) temele (−3.00) inersiniz; her bölüm bir kat, köşedeki asansör göstergesi hangi katta olduğunuzu söyler | mimari kesit çizimi ve kot işareti, asansör göstergesi (Türk apartmanının günlük nesnesi) | kesit çizgisi: bina cephesinin üstünde gezen dikey kesim çizgisi altındaki daireleri (satışta / opsiyonlu / satıldı) gösterir; proje sayfasında aynı çizim daire seçicisidir | 4 / 5 / 4 / 3 |
| B. Yer ve kültür | Satıştaki daireler apartman diyafon paneli gibi dizilir; her zil bir daire, yanan zil boş daire | Türk apartmanının zil paneli ve mermer apartman tabelası | zile basınca daire açılır | 4 / 4 / 4 / 3 |
| C. Ad | Kurt'un ini: in = yuva; site kurdun kendi inini kazması gibi | adın anlamı | toprak kazılıp ev ortaya çıkar | 3 / 3 / 4 / 2 |

**Seçilen: A.** Firmanın işine en çok oturan, kullanılabilirliği artıran (daire seçici zaten emlakta gereken şey) ve dipnota kadar taşınabilen kural sistemi. B'den çalınan: tarama (hatch) ve durum dili; satılan daireler kesitte kesilmiş beton gibi taranır.

## Konsept kartı

```
Fikir:       Bu site bir binanın kesiti. Çatıdan temele inersiniz, her bölüm bir kattır.
Metafor:     mimari kesit paftası + asansör
İmza:        Kesit: cephe çiziminin üstünde gezen kesim çizgisi, altındaki daireleri ve durumlarını açar.
             Ana sayfada amiral proje, proje sayfasında daire seçici, 404'te olmayan kat.
Duygu:       ilk 3 saniye: düzen, açıklık, "her şey ortada".
Hareket fiili: asansör kapısı gibi kayar ve oturur (yatay açılış, yumuşak duruş).
Ekran görüntüsü: kesim çizgisi binanın ortasında; solda cephe, sağda katlar, daireler ve kotlar.
```

## Sanat yönetimi

**Palet (kesit paftasından):**
- `paper` #E9EAE6: aydınger / taze sıva grisi, zemin
- `sky` #DCE2E3: çatı katının gökyüzü tonu (yalnız hero)
- `ink` #151514: çizim mürekkebi, metin
- `muted` #575C58: ikincil metin (paper üzerinde AA)
- `line` rgba(21,21,20,.16): ince çizgiler
- `signal` #E2551B: iş güvenliği turuncusu; asansör LED'i, "satışta" işareti, odak halkası. Seyrek.
- `soil` #1A1815: temel / dipnot zemini (koyu bölüm), üstünde `paper` metin

**Yazı:** Archivo (Google, OFL, Türkçe karakter tam). Başlık: genişlik 112 ile 125 arası, kalın (750 ile 850), sıkı aralık. Metin: genişlik 100, 400 / 500. Sayılar tablo rakamı. Asansör göstergesi: kendi çizdiğimiz 5x7 nokta vuruşlu LED harfleri (SVG), yalnız orada.

**Izgara:** 12 sütun, kenar boşluğu = oluk. Solda 1 sütunluk "kot şeridi": her bölüm `▼ +12.00` kotu ve kat adıyla başlar. Metin blokları 4. ve 7. sütun çizgisine asılır.

**Bölüm ritmi:** her bölüm bir döşemeyle ayrılır: tam genişlikte ince taralı bant (kesilmiş beton) ve solunda kot etiketi. Bölüm yükseklikleri bilerek farklı.

**Biçim:** köşe yarıçapı 0 (çizim dünyası). Tek istisna yok.

**Hareket dili:** expo.out / expo.inOut. Görseller ortadan iki yana açılır (asansör kapısı, `clip-path: inset(0 50%)` → `inset(0)`). Metin satırları yukarı kayar (asansör yükselir). Sayfa geçişi: iki kapı paneli ortada kapanır, LED gösterge yeni sayfanın adını yazar, kapılar açılır. Düğme: dolgu ortadan iki yana açılır + ok kayar.

**Boşta hareket:** kesim çizgisi işaretçi yokken yavaşça salınır (binayı tarar); asansör göstergesindeki yön oku kaydırma yönünü gösterir. Azaltılmış harekette çizgi binanın ortasında sabit durur.

## Bölüm planı (ana sayfa, kat kat)

```
Ç  +18.00  Çatı      | H1 + açıklama + 2 eylem          | KESİT (amiral proje) |   (bölünmüş çerçeve)
5  +15.00  Satışta   | oda tipine göre satıştaki daire sayısı ve başlangıç fiyatı, ilanlara geçiş (veri satırı)
4  +12.00  Projeler  | dizin listesi: ad, ilçe, durum, daire, teslim; masaüstünde imleçle önizleme
3   +9.00  Açık hesap| büyük cümle + her dairede yazan 6 bilgi (açıklama dizisi)
2   +6.00  Dönüşüm   | malikler için: 5 adım (gerçek sıra), başvuru
1   +3.00  Şantiyeden| tarihli şantiye notları + fotoğraf (asimetrik çift)
Z   ±0.00  Zemin     | biz kimiz + ofis, saat, telefon, WhatsApp (bilgi + harita bağlantısı)
-1  −3.00  Temel     | dipnot: büyük ad, bağlantılar, yasal satırlar (koyu toprak)
```

## Sayfalar

- `/` ana sayfa
- `/projeler/` ve `/projeler/[slug]/`: proje sayfası (kesit = daire seçici, daire tipleri, galeri, konum ve mesafeler, ödeme, şantiye, SSS, iletişim)
- `/ilanlar/` (süzgeçli) ve `/ilanlar/[no]/`
- `/kentsel-donusum/`
- `/iletisim/`
- `/kvkk/` (taslak metin, avukat onayı gerekir)
- `404`: "Bu kat yok"

## Jenerik testi

"Emlak sitesi" denince bir model şuraya gider: tam ekran bina fotoğrafı slayt, ortada "Hayalinizdeki eve kavuşun", üç eşit kart (Güven, Kalite, Zamanında teslim), sayaçlar. Değiştirdiklerim:
- Hero fotoğraf değil, çizim: kesit. Fotoğraf proje kartlarında ve galeride.
- Üç eşit kart yerine "Açık hesap": her dairede yazan altı bilgi, gerçek ve denetlenebilir.
- Sayaç yok (gerçek sayılar elimizde değil).
- Yuvarlak köşe ve gölge yok; döşeme bantları ve kot etiketleri.

## Teknik

- Astro (statik, hızlı, GitHub Pages'e ücretsiz konur). GSAP + Lenis. WebGL yok (gerek yok).
- Tüm içerik `src/data/site.ts` içinde.
- Formlar sunucuya bir şey göndermez: doldurulan bilgiler WhatsApp mesajı olarak açılır, kullanıcı kendisi gönderir.
- Çerez kullanılmaz. Favoriler yok (gerekirse sonra).

## Boştayken hareket

Kesim çizgisi işaretçi yokken binanın üstünde yavaşça salınır; asansör kabini 2 ile 5 saniyede bir başka kata gider. Göstergedeki yön oku yalnız sayfa kayarken yanar. Azaltılmış harekette ikisi de durur, çizgi binanın ortasında kalır.

## Etkileşim kuralları (rol başına bir davranış)

- Birincil düğmeler: dolgu ortadan iki yana açılır (asansör kapısı), ok 4 px kayar.
- Gezinme: alt çizgi ortadan iki yana açılır; bulunulan sayfada çizgi ve küçük turuncu işaret durur.
- Proje satırları ve ilan kartları: zemin ortadan açılır / görsel çerçeve içinde büyür, ad sağa kayar.
- Metin içi bağlantılar: hep altı çizili, üstüne gelince çizgi kalınlaşır.
- Kesitteki daireler: çerçevelenir, kesim çizgisi daireyi açacak yere gider, kabin o kata iner.

## Sabit sayfalar (bilinçli karar)

İlanlar, kentsel dönüşüm, iletişim ve KVKK sayfaları boştayken durur: bunlar okunacak ve doldurulacak sayfalar. Hayat oralarda düğmelerin, kartların ve sayfa geçişindeki asansör kapısının tepkisinden gelir. Kesit (ana sayfa, proje sayfası) ve sokak silüetindeki vinçler (projeler sayfası) boştayken hareket eder.

## İlk açılış

Oturum başına bir kez, kapılar kapalı başlar, gösterge B'den Ç'ye sayar ve 1,75 sn sonra kapılar açılır. Tamamen CSS ile çalışır: JavaScript'i beklemez, sayfanın ilk içeriğini geciktirmez (telefonda ölçülen LCP 1,6 sn). Azaltılmış harekette hiç görünmez.

## Telefon öncelikli revizyon (25.11.2026)

Sahibinin geri bildirimi: "Çok fazla bilgisayar sitesi gibi, mobil odaklı yap." Emlak ziyaretçisinin çoğu Instagram ve WhatsApp bağlantısından telefonla gelir. Site artık önce 390 px için kurulur, bilgisayar aynı parçaları geniş gösterir.

- Gezinme: altta sekme çubuğu (Ana sayfa, İlanlar, Projeler, Dönüşüm, Bize yaz). Simgeler pafta çizgisiyle çizildi, bulunulan sekmenin üstünde turuncu LED noktası yanar. Bilgisayarda aynı çubuk alt ortada yüzen bir panel olur, aşağı kayarken çekilir, yukarı kayınca döner. Hamburger menü ve Ara/WhatsApp şeridi kalktı.
- Üst çubuk: yalnız logo ve asansör göstergesi (56 px).
- "Bize yaz": alttan açılan iletişim çekmecesi (WhatsApp, telefon, yol tarifi, saatler). Çekmecenin tutamağı küçük bir döşeme taraması.
- Liste kalıbı: kartlar yatay kayar (scroll-snap), bir sonraki kart kenardan görünür. Bölüm başlığı "Başlık + Tümü" düzeninde.
- İlanlar: üstte yapışkan çip satırı (Hepsi, Satılık, Kiralık, oda sayıları) ve "Süzgeç" çekmecesi (ilçe, fiyat, sıralama).
- Detay sayfaları (ilan, proje): fotoğraflar tam genişlikte kayar; altta sekme çubuğu yerine bağlama özel işlem çubuğu (geri, ara, WhatsApp'tan sor). Proje sayfasında yapışkan bölüm sekmeleri; kesitte seçilen daire işlem çubuğuna yazılır.
- Daire tablosu telefonda satır kartlarına döner; iş programı telefonda dikey zaman çizgisi olur.
- Ana sayfa kısaldı: iş programı yalnız Kentsel dönüşüm sayfasında; ana sayfada koyu bir dönüşüm kartı var.
