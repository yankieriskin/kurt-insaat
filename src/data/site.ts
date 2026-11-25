// Kurt İnşaat: sitedeki bütün içerik bu dosyada.
//
// YER TUTUCU (placeholder) UYARISI: Firmanın gerçek bilgileri verilmediği için aşağıdakilerin
// hepsi örnek olarak yazıldı ve sahibinin gerçeğiyle değiştirmesi gerekir:
//   - telefon, WhatsApp, e-posta, adres, çalışma saatleri, yetki belgesi numarası, alan adı
//   - dört projenin hepsi (ad, yer, daireler, fiyatlar, tarihler, ruhsat, yapı denetim, mesafeler)
//   - üç portföy ilanı (KI-2041, KI-2047, KI-2052)
//   - şantiye günlüğü kayıtları, kentsel dönüşüm takvimi (ay sayıları)
//   - "Açık hesap" sözleri ve kentsel dönüşüm teklif ilkeleri (firmanın gerçekten böyle çalıştığını onaylaması gerekir)
//   - bütün görseller yapay zekâ ile üretildi; sitede "Görseller temsilidir" yazar
// Bir değeri değiştirdiğinizde site her yerde (ana sayfa, proje, ilan, sayılar) kendiliğinden güncellenir.

import type { ImageMetadata } from 'astro';
import esentepeDis from '../assets/img/esentepe-dis.jpg';
import esentepeAksam from '../assets/img/esentepe-aksam.jpg';
import esentepeSalon from '../assets/img/esentepe-salon.jpg';
import esentepeMutfak from '../assets/img/esentepe-mutfak.jpg';
import goztepeDis from '../assets/img/goztepe-dis.jpg';
import goztepeSantiye from '../assets/img/goztepe-santiye.jpg';
import cevizliDis from '../assets/img/cevizli-dis.jpg';
import cevizliYatak from '../assets/img/cevizli-yatak.jpg';
import tasdelenDis from '../assets/img/tasdelen-dis.jpg';
import santiyeBeton from '../assets/img/santiye-beton.jpg';
import santiyeKalip from '../assets/img/santiye-kalip.jpg';
import banyo from '../assets/img/banyo.jpg';
import balkonManzara from '../assets/img/balkon-manzara.jpg';
import salonYenilenmis from '../assets/img/salon-yenilenmis.jpg';
import ofisMasa from '../assets/img/ofis-masa.jpg';

export const images = { ofisMasa, santiyeBeton, santiyeKalip, goztepeSantiye, balkonManzara };

/* ------------------------------------------------------------------ firma */

export const site = {
  name: 'Kurt İnşaat',
  legalName: 'Kurt İnşaat (ticaret unvanı eklenecek)', // placeholder
  url: 'https://kurtinsaat.com.tr', // placeholder: alan adı
  description:
    'Kurt İnşaat İstanbul Anadolu yakasında konut yapar, satar ve kiraya verir. Her dairenin planı, metrekaresi, fiyatı ve teslim tarihi sitede açıkça yazar.',
  phone: { label: '0216 000 00 00', href: 'tel:+902160000000' }, // placeholder
  whatsapp: { label: '0500 000 00 00', number: '905000000000' }, // placeholder
  email: 'info@kurtinsaat.com.tr', // placeholder
  address: ['Örnek Mahallesi, Örnek Caddesi No: 1', 'Kartal, İstanbul'], // placeholder
  mapQuery: 'Kartal İstanbul', // placeholder: Google Haritalar araması
  hours: [
    ['Hafta içi', '09.00 ile 18.30 arası'],
    ['Cumartesi', '10.00 ile 16.00 arası'],
    ['Pazar', 'Kapalı, WhatsApp açık'],
  ] as [string, string][],
  licence: '0000000', // placeholder: Taşınmaz Ticareti Yetki Belgesi numarası
  instagram: '', // boş bırakılırsa gösterilmez
  updated: '25 Kasım 2026', // fiyat ve durumların güncellendiği tarih
  placeholder: true,
};

export const wa = (text: string) => `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;

export const nav = [
  { href: '/projeler/', label: 'Projeler' },
  { href: '/ilanlar/', label: 'İlanlar' },
  { href: '/kentsel-donusum/', label: 'Kentsel dönüşüm' },
  { href: '/iletisim/', label: 'İletişim' },
];

/* ------------------------------------------------------------------ biçim */

const tl = new Intl.NumberFormat('tr-TR');
export const price = (n: number) => `${tl.format(n)} ₺`;
export const m2 = (n: number) => `${n.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} m²`;
export const floorName = (f: number) => (f === 0 ? 'Zemin kat' : f < 0 ? `${-f}. bodrum` : `${f}. kat`);
export const floorCode = (f: number) => (f === 0 ? 'Z' : f < 0 ? `B${-f}` : String(f));
export const kot = (meters: number) =>
  meters === 0 ? '±0.00' : `${meters > 0 ? '+' : '−'}${Math.abs(meters).toFixed(2)}`;

/* ------------------------------------------------------------------ daire tipleri */

export type Room = { name: string; m2: number };
export type UnitType = { key: '1+1' | '2+1' | '3+1'; net: number; brut: number; rooms: Room[] };

const sum = (r: Room[]) => Math.round(r.reduce((a, b) => a + b.m2, 0) * 10) / 10;
const type = (key: UnitType['key'], brut: number, rooms: Room[]): UnitType => ({ key, net: sum(rooms), brut, rooms });

/* ------------------------------------------------------------------ projeler */

export type UnitStatus = 'satista' | 'opsiyon' | 'satildi' | 'malik';
export const statusLabel: Record<UnitStatus, string> = {
  satista: 'Satışta',
  opsiyon: 'Opsiyonlu',
  satildi: 'Satıldı',
  malik: 'Hak sahibi',
};

export type Unit = {
  no: number;
  floor: number; // 0 = zemin
  side: 0 | 1; // 0 = kesitte sol (batı), 1 = sağ (doğu)
  type: UnitType['key'];
  facade: string;
  extra?: string;
  price?: number; // KDV dahil, TL
  status: UnitStatus;
};

export type Stage = 'yakinda' | 'insaatta' | 'teslim';
export const stageLabel: Record<Stage, string> = { yakinda: 'Yakında', insaatta: 'İnşaatta', teslim: 'Teslim edildi' };

export type Project = {
  slug: string;
  code: string;
  name: string;
  district: string;
  neighborhood: string;
  stage: Stage;
  model: string;
  delivery: string;
  progress?: number;
  progressNote?: string;
  summary: string;
  intro: string[];
  building?: { floors: number; basements: number; floorHeight: number };
  types: UnitType[];
  units: Unit[];
  facts: [string, string][];
  docs: [string, string][];
  cover: ImageMetadata;
  coverAlt: string;
  gallery: { img: ImageMetadata; alt: string; group: 'Dış mekân' | 'İç mekân' | 'Şantiye' }[];
  distances: [string, string][];
  mapQuery: string;
  payment: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  placeholder: true;
};

// Esentepe Park: 6 normal kat + zemin, katta 2 daire. Batı daireleri 3+1, doğu daireleri 2+1.
const espTypes = [
  type('1+1', 74, [
    { name: 'Salon ve mutfak', m2: 26.4 },
    { name: 'Yatak odası', m2: 13.2 },
    { name: 'Banyo', m2: 5.1 },
    { name: 'Antre', m2: 6.3 },
    { name: 'Balkon', m2: 7 },
  ]),
  type('2+1', 108, [
    { name: 'Salon', m2: 27.5 },
    { name: 'Mutfak', m2: 10.8 },
    { name: 'Yatak odası', m2: 14.6 },
    { name: 'Çocuk odası', m2: 10.9 },
    { name: 'Banyo', m2: 5.4 },
    { name: 'Antre ve koridor', m2: 8.6 },
    { name: 'Balkon', m2: 8.2 },
  ]),
  type('3+1', 146, [
    { name: 'Salon', m2: 32.4 },
    { name: 'Mutfak', m2: 12.6 },
    { name: 'Ebeveyn yatak odası', m2: 15.8 },
    { name: 'Ebeveyn banyosu', m2: 4.6 },
    { name: 'Yatak odası', m2: 11.9 },
    { name: 'Yatak odası', m2: 10.7 },
    { name: 'Banyo', m2: 5.6 },
    { name: 'Antre ve koridor', m2: 11.2 },
    { name: 'Balkon', m2: 13.2 },
  ]),
];

const espStatus: UnitStatus[] = ['satildi', 'satista', 'satildi', 'satildi', 'satista', 'opsiyon', 'satildi', 'satista', 'satista', 'satildi', 'satildi', 'satista', 'opsiyon', 'satildi'];
const espUnits: Unit[] = [
  { no: 1, floor: 0, side: 0, type: '2+1', facade: 'Güney, batı', extra: 'Özel bahçe 46 m²', price: 9_350_000, status: espStatus[0] },
  { no: 2, floor: 0, side: 1, type: '1+1', facade: 'Doğu', extra: 'Özel bahçe 28 m²', price: 6_240_000, status: espStatus[1] },
  ...Array.from({ length: 6 }, (_, i) => {
    const f = i + 1;
    return [
      { no: 2 * f + 1, floor: f, side: 0 as const, type: '3+1' as const, facade: 'Güney, batı', price: 12_300_000 + i * 180_000, status: espStatus[2 * f] },
      { no: 2 * f + 2, floor: f, side: 1 as const, type: '2+1' as const, facade: 'Güney, doğu', price: 8_900_000 + i * 140_000, status: espStatus[2 * f + 1] },
    ];
  }).flat(),
];

// Göztepe 14: kentsel dönüşüm. 12 dairenin 7'si eski binanın maliklerine ait.
const gztTypes = [
  type('1+1', 70, [
    { name: 'Salon ve mutfak', m2: 25.2 },
    { name: 'Yatak odası', m2: 12.8 },
    { name: 'Banyo', m2: 4.9 },
    { name: 'Antre', m2: 5.6 },
    { name: 'Balkon', m2: 5.5 },
  ]),
  type('2+1', 104, [
    { name: 'Salon', m2: 26.8 },
    { name: 'Mutfak', m2: 10.2 },
    { name: 'Yatak odası', m2: 14.1 },
    { name: 'Çocuk odası', m2: 10.4 },
    { name: 'Banyo', m2: 5.2 },
    { name: 'Antre ve koridor', m2: 8.3 },
    { name: 'Balkon', m2: 7 },
  ]),
  type('3+1', 140, [
    { name: 'Salon', m2: 30.6 },
    { name: 'Mutfak', m2: 11.8 },
    { name: 'Ebeveyn yatak odası', m2: 15.2 },
    { name: 'Ebeveyn banyosu', m2: 4.4 },
    { name: 'Yatak odası', m2: 11.6 },
    { name: 'Yatak odası', m2: 10.2 },
    { name: 'Banyo', m2: 5.4 },
    { name: 'Antre ve koridor', m2: 10.6 },
    { name: 'Balkon', m2: 12.2 },
  ]),
];
const gztStatus: UnitStatus[] = ['malik', 'satildi', 'malik', 'malik', 'malik', 'malik', 'malik', 'malik', 'satista', 'satista', 'opsiyon', 'satista'];
const gztUnits: Unit[] = [
  { no: 1, floor: 0, side: 0, type: '2+1', facade: 'Kuzey, batı', status: gztStatus[0] },
  { no: 2, floor: 0, side: 1, type: '1+1', facade: 'Güney', extra: 'Özel bahçe 22 m²', price: 11_400_000, status: gztStatus[1] },
  ...Array.from({ length: 5 }, (_, i) => {
    const f = i + 1;
    return [
      { no: 2 * f + 1, floor: f, side: 0 as const, type: '3+1' as const, facade: 'Güney, batı', price: 24_750_000 + i * 400_000, status: gztStatus[2 * f] },
      { no: 2 * f + 2, floor: f, side: 1 as const, type: '2+1' as const, facade: 'Güney, doğu', price: 17_900_000 + i * 300_000, status: gztStatus[2 * f + 1] },
    ];
  }).flat(),
];

const cvzUnits: Unit[] = Array.from({ length: 6 }, (_, f) => [
  { no: 2 * f + 1, floor: f, side: 0 as const, type: '3+1' as const, facade: 'Güney, batı', status: 'satildi' as const },
  { no: 2 * f + 2, floor: f, side: 1 as const, type: '2+1' as const, facade: 'Güney, doğu', status: 'satildi' as const },
]).flat();

export const projects: Project[] = [
  {
    slug: 'esentepe-park',
    code: 'ESP',
    name: 'Esentepe Park',
    district: 'Kartal',
    neighborhood: 'Esentepe',
    stage: 'insaatta',
    model: 'Kendi arsamız',
    delivery: 'Eylül 2027',
    progress: 48,
    progressNote: 'Kaba inşaat 5. katta. 6. kat döşemesi aralık ayında dökülecek.',
    summary: 'Kartal Esentepe’de zemin üstü 7 katlı, 14 daireli bir apartman. Batı daireleri 3+1, doğu daireleri 2+1, zemin katta iki bahçeli daire.',
    intro: [
      'Esentepe Park, katta iki daireden oluşan sakin bir apartman. Her dairenin iki cephesi var; salonlar güneye bakıyor ve üst katlardan Adalar görünüyor.',
      'Bodrum katta her daireye bir otopark yeri ve bir depo düşüyor. Ortak alan olarak bahçe, bisiklet odası ve çatıda güneş panelleri var; havuz ya da spor salonu yok, aidat bu yüzden düşük kalıyor.',
    ],
    building: { floors: 6, basements: 1, floorHeight: 3 },
    types: espTypes,
    units: espUnits,
    facts: [
      ['Arsa', '1.240 m²'],
      ['İnşaat alanı', '2.960 m²'],
      ['Daire', '14'],
      ['Kat', 'Bodrum, zemin ve 6 kat'],
      ['Otopark', 'Kapalı, 14 araç'],
      ['Isınma', 'Yerden ısıtma, bireysel kombi'],
    ],
    docs: [
      ['Yapı ruhsatı', '14 Mart 2025'],
      ['Yapı denetim', 'Örnek Yapı Denetim Ltd.'],
      ['Zemin etüdü', 'Yapıldı. Zemin sınıfı ZC'],
      ['Deprem hesabı', '2018 Türkiye Bina Deprem Yönetmeliği'],
      ['Tapu durumu', 'Kat irtifakı kurulu'],
      ['Mimari proje', 'Örnek Mimarlık'],
    ],
    cover: esentepeDis,
    coverAlt: 'Esentepe Park: açık gri sıvalı, ahşap görünümlü dikey panelli, cam korkuluklu balkonları olan yedi katlı apartman ve önündeki zeytin ağaçlı bahçe',
    gallery: [
      { img: esentepeDis, alt: 'Esentepe Park sokak cephesi, gündüz', group: 'Dış mekân' },
      { img: esentepeAksam, alt: 'Esentepe Park akşam, pencerelerde ışık yanıyor', group: 'Dış mekân' },
      { img: esentepeSalon, alt: 'Örnek 3+1 dairenin salonu, yerden tavana pencere ve uzakta Adalar', group: 'İç mekân' },
      { img: esentepeMutfak, alt: 'Örnek dairenin açık mutfağı ve yemek masası', group: 'İç mekân' },
      { img: banyo, alt: 'Örnek dairenin banyosu: duşakabin, ahşap lavabo dolabı, yuvarlak ayna', group: 'İç mekân' },
      { img: balkonManzara, alt: 'Üst kat balkonundan Marmara Denizi ve Adalar manzarası', group: 'İç mekân' },
      { img: santiyeBeton, alt: 'Esentepe Park şantiyesi: döşeme betonu dökülüyor', group: 'Şantiye' },
      { img: santiyeKalip, alt: 'Esentepe Park şantiyesi: kalıptan alınmış kolonlar ve iksa direkleri', group: 'Şantiye' },
    ],
    distances: [
      ['Kartal metro istasyonu (M4)', '1,3 km'],
      ['D-100 bağlantısı', '900 m'],
      ['Kartal sahili', '2,4 km'],
      ['İlkokul', '400 m'],
      ['Devlet hastanesi', '2,1 km'],
      ['Sabiha Gökçen Havalimanı', '19 km'],
    ],
    mapQuery: 'Esentepe Kartal İstanbul',
    payment: [
      { title: 'Peşin', text: 'Fiyat listesindeki tutar. Tapu, kat irtifakıyla imza günü devredilir.' },
      { title: '%40 peşin, 18 ay', text: 'Kalan %60, 18 eşit taksitte ve vade farksız. Taksit sonu teslimden önce biter.' },
      { title: 'Konut kredisi', text: 'Kat irtifakı kurulu olduğu için banka kredisine uygundur. Ekspertizi bankanın kendisi yapar.' },
    ],
    faq: [
      { q: 'Fiyatlara KDV dahil mi?', a: 'Evet. Sitedeki bütün fiyatlar KDV dahildir. Tapu harcı ve döner sermaye ücreti ayrıca ödenir; tutarını imzadan önce yazılı veririz.' },
      { q: 'Net ve brüt metrekare ne demek?', a: 'Net alan, dairenin duvarlar arasında kalan kullanım alanıdır; balkon dahildir. Brüt alan dış duvarları da kapsar, ortak alan payı dahil değildir. İkisini de her dairede ayrı yazıyoruz.' },
      { q: 'Teslim gecikirse ne olur?', a: 'Sözleşmede teslim tarihi ve gecikilen her ay için ödenecek tutar yazar. Ön ödemeli konut satışında yasa da size sözleşmeden dönme hakkı tanır.' },
      { q: 'Daireyi görmeden alabilir miyim?', a: 'Yapım aşamasında örnek daire yok. Şantiyeyi baretle birlikte gezdiriyoruz; randevu için WhatsApp’tan yazmanız yeterli.' },
    ],
    placeholder: true,
  },
  {
    slug: 'goztepe-14',
    code: 'GZT',
    name: 'Göztepe 14',
    district: 'Kadıköy',
    neighborhood: 'Göztepe',
    stage: 'insaatta',
    model: 'Kentsel dönüşüm, kat karşılığı',
    delivery: 'Mart 2027',
    progress: 72,
    progressNote: 'Kaba inşaat bitti. Cephe tuğlası 4. katta, iç sıvalar tamamlandı.',
    summary: 'Göztepe’de 1974 yapımı riskli bir binanın yerine yapılan 12 daireli butik apartman. Yedi daire eski binanın maliklerine ait, beşi satışta.',
    intro: [
      'Eski bina 2023’te riskli yapı raporu aldı. Sekiz malik aynı gün noterde imzaladı; paylaşım şemasında her malikin hangi katta, hangi cephede, kaç metrekare daire alacağı yazıyordu.',
      'Yeni bina el yapımı açık renk tuğla ve brüt beton bantlarla kaplanıyor. Sokağın çınarlarına dokunmamak için bina girişi bir metre içeri çekildi.',
    ],
    building: { floors: 5, basements: 1, floorHeight: 3 },
    types: gztTypes,
    units: gztUnits,
    facts: [
      ['Arsa', '612 m²'],
      ['İnşaat alanı', '1.820 m²'],
      ['Daire', '12'],
      ['Kat', 'Bodrum, zemin ve 5 kat'],
      ['Otopark', 'Kapalı, 8 araç'],
      ['Isınma', 'Yerden ısıtma, bireysel kombi'],
    ],
    docs: [
      ['Yapı ruhsatı', '9 Ocak 2025'],
      ['Yapı denetim', 'Örnek Yapı Denetim Ltd.'],
      ['Zemin etüdü', 'Yapıldı. Zemin sınıfı ZB'],
      ['Deprem hesabı', '2018 Türkiye Bina Deprem Yönetmeliği'],
      ['Tapu durumu', 'Kat irtifakı kurulu'],
      ['Mimari proje', 'Örnek Mimarlık'],
    ],
    cover: goztepeDis,
    coverAlt: 'Göztepe 14: çınar ağaçlı dar sokakta, açık renk tuğla ve beton bantlı beş katlı butik apartman',
    gallery: [
      { img: goztepeDis, alt: 'Göztepe 14 sokak cephesi, temsili görsel', group: 'Dış mekân' },
      { img: goztepeSantiye, alt: 'Göztepe 14 şantiyesi: iskele ve yeşil güvenlik filesi', group: 'Şantiye' },
      { img: esentepeSalon, alt: 'Örnek dairenin salonu, temsili', group: 'İç mekân' },
      { img: banyo, alt: 'Örnek dairenin banyosu, temsili', group: 'İç mekân' },
    ],
    distances: [
      ['Göztepe Marmaray istasyonu', '650 m'],
      ['Bağdat Caddesi', '900 m'],
      ['Göztepe Parkı', '700 m'],
      ['Kadıköy iskelesi', '6,5 km'],
      ['İlkokul', '350 m'],
    ],
    mapQuery: 'Göztepe Kadıköy İstanbul',
    payment: [
      { title: 'Peşin', text: 'Fiyat listesindeki tutar. Tapu, kat irtifakıyla imza günü devredilir.' },
      { title: '%50 peşin, 12 ay', text: 'Kalan %50, 12 eşit taksitte ve vade farksız.' },
      { title: 'Konut kredisi', text: 'Kat irtifakı kurulu olduğu için banka kredisine uygundur.' },
    ],
    faq: [
      { q: 'Hak sahibi daireleri satılık mı?', a: 'Hayır. Hak sahibi yazan daireler eski binanın maliklerine aittir. Malikler satmak isterse kendileri karar verir; biz aracılık yapmıyoruz.' },
      { q: 'Fiyatlara KDV dahil mi?', a: 'Evet. Tapu harcı ve döner sermaye ücreti ayrıca ödenir; tutarını imzadan önce yazılı veririz.' },
      { q: 'Teslim gecikirse ne olur?', a: 'Sözleşmede teslim tarihi ve gecikilen her ay için ödenecek tutar yazar.' },
    ],
    placeholder: true,
  },
  {
    slug: 'cevizli-evleri',
    code: 'CVZ',
    name: 'Cevizli Evleri',
    district: 'Maltepe',
    neighborhood: 'Cevizli',
    stage: 'teslim',
    model: 'Kentsel dönüşüm, kat karşılığı',
    delivery: 'Eylül 2025',
    summary: 'Maltepe Cevizli’de 12 daireli apartman. Eylül 2025’te iskânı alındı ve teslim edildi; bütün daireler satıldı.',
    intro: [
      'Cevizli Evleri bizim teslim ettiğimiz son bina. Söz verdiğimiz tarihten 23 gün önce iskân aldı.',
      'Daireler satıldı. Kat maliklerinden biri dairesini kiraya vermek için bize yetki verdi; ilanı aşağıda.',
    ],
    building: { floors: 5, basements: 1, floorHeight: 3 },
    types: espTypes,
    units: cvzUnits,
    facts: [
      ['Arsa', '890 m²'],
      ['Daire', '12'],
      ['Kat', 'Bodrum, zemin ve 5 kat'],
      ['İskân', 'Eylül 2025'],
    ],
    docs: [
      ['Yapı ruhsatı', '2 Haziran 2023'],
      ['İskân', '8 Eylül 2025'],
      ['Tapu durumu', 'Kat mülkiyeti'],
      ['Deprem hesabı', '2018 Türkiye Bina Deprem Yönetmeliği'],
    ],
    cover: cevizliDis,
    coverAlt: 'Cevizli Evleri: çınar ağaçlarının arasında beyaz ve sıcak gri cepheli, balkonlarında saksılar olan altı katlı apartman',
    gallery: [
      { img: cevizliDis, alt: 'Cevizli Evleri sokak cephesi', group: 'Dış mekân' },
      { img: cevizliYatak, alt: 'Cevizli Evleri’nde bir yatak odası', group: 'İç mekân' },
    ],
    distances: [
      ['Cevizli metro istasyonu (M4)', '800 m'],
      ['Maltepe sahili', '2,2 km'],
      ['D-100 bağlantısı', '600 m'],
    ],
    mapQuery: 'Cevizli Maltepe İstanbul',
    payment: [],
    faq: [],
    placeholder: true,
  },
  {
    slug: 'tasdelen-konaklari',
    code: 'TSD',
    name: 'Taşdelen Konakları',
    district: 'Çekmeköy',
    neighborhood: 'Taşdelen',
    stage: 'yakinda',
    model: 'Kendi arsamız',
    delivery: 'Ruhsattan sonra 20 ay',
    summary: 'Ormanın kenarında, bahçeli 8 sıra ev. Ruhsat başvurusu belediyede; satış ruhsat çıktıktan sonra başlayacak.',
    intro: [
      'Taşdelen Konakları üç katlı, bahçeli sekiz sıra evden oluşacak. Her evin kendi girişi, kendi bahçesi ve iki araçlık otoparkı olacak.',
      'Yasa, yapı ruhsatı olmadan konut satışını yasaklıyor. Bu yüzden şu an fiyat vermiyoruz. Ön bilgi listesine yazılırsanız ruhsat çıktığı gün fiyat listesini ilk siz alırsınız.',
    ],
    types: [],
    units: [],
    facts: [
      ['Ev', '8 sıra ev, 4+1'],
      ['Kat', 'Zemin ve 2 kat'],
      ['Bahçe', 'Her eve 80 ile 140 m² arası'],
      ['Otopark', 'Her eve 2 araç'],
    ],
    docs: [
      ['Yapı ruhsatı', 'Başvuru yapıldı, bekleniyor'],
      ['Zemin etüdü', 'Sondajlar tamamlandı'],
    ],
    cover: tasdelenDis,
    coverAlt: 'Taşdelen Konakları: orman kenarında taş kaideli, ahşap kaplamalı, önleri bahçeli üç katlı sıra evler (temsili görsel)',
    gallery: [{ img: tasdelenDis, alt: 'Taşdelen Konakları sıra evleri, temsili görsel', group: 'Dış mekân' }],
    distances: [
      ['Taşdelen merkezi', '1,1 km'],
      ['Ümraniye metro bağlantısı', '7 km'],
      ['Ömerli ormanı yürüyüş yolu', '300 m'],
    ],
    mapQuery: 'Taşdelen Çekmeköy İstanbul',
    payment: [],
    faq: [],
    placeholder: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)!;
export const unitType = (p: Project, key: string) => p.types.find((t) => t.key === key)!;
export const forSale = (p: Project) => p.units.filter((u) => u.status === 'satista');

/* ------------------------------------------------------------------ ilanlar */

export type Listing = {
  no: string;
  kind: 'satilik' | 'kiralik';
  title: string;
  district: string;
  neighborhood: string;
  project?: string; // proje slug'ı
  unit?: Unit;
  rooms: string;
  net: number;
  brut: number;
  floor: number;
  totalFloors: number;
  age: string;
  heating: string;
  facade: string;
  price: number; // satılık: toplam, kiralık: aylık
  dues?: number; // aidat
  deposit?: string;
  deed: string; // tapu durumu
  credit: boolean;
  furnished: boolean;
  parking: string;
  date: string;
  images: { img: ImageMetadata; alt: string }[];
  text: string[];
  placeholder: true;
};

const portfolio: Listing[] = [
  {
    no: 'KI-2041',
    kind: 'kiralik',
    title: 'Cevizli Evleri’nde 2+1, 4. kat',
    district: 'Maltepe',
    neighborhood: 'Cevizli',
    project: 'cevizli-evleri',
    rooms: '2+1',
    net: 86,
    brut: 108,
    floor: 4,
    totalFloors: 6,
    age: '1 yıl',
    heating: 'Yerden ısıtma, kombi',
    facade: 'Güney, doğu',
    price: 34_000,
    dues: 1_400,
    deposit: '2 kira',
    deed: 'Kat mülkiyeti',
    credit: false,
    furnished: false,
    parking: 'Kapalı otopark, 1 araç',
    date: '18 Kasım 2026',
    images: [
      { img: cevizliDis, alt: 'Cevizli Evleri binası' },
      { img: cevizliYatak, alt: 'Dairenin yatak odası' },
      { img: banyo, alt: 'Dairenin banyosu' },
    ],
    text: [
      'Bir yıllık binada, hiç oturulmamış 2+1. Salon ve mutfak güneye, yatak odaları doğuya bakıyor.',
      'Ev sahibi en az iki yıllık sözleşme istiyor. Evcil hayvana açık. Komisyonu kiracıdan değil ev sahibinden alıyoruz.',
    ],
    placeholder: true,
  },
  {
    no: 'KI-2047',
    kind: 'satilik',
    title: 'Bağlarbaşı’nda yenilenmiş 3+1',
    district: 'Maltepe',
    neighborhood: 'Bağlarbaşı',
    rooms: '3+1',
    net: 115,
    brut: 140,
    floor: 3,
    totalFloors: 7,
    age: '14 yıl',
    heating: 'Kombi, radyatör',
    facade: 'Batı, kuzey',
    price: 8_950_000,
    dues: 1_100,
    deed: 'Kat mülkiyeti',
    credit: true,
    furnished: false,
    parking: 'Açık otopark',
    date: '12 Kasım 2026',
    images: [
      { img: salonYenilenmis, alt: 'Yenilenmiş salon, cumbalı pencere ve balıksırtı parke' },
      { img: banyo, alt: 'Yenilenmiş banyo' },
    ],
    text: [
      '2012 yapımı binada, 2024’te elektrik ve su tesisatı dahil baştan yenilenmiş 3+1. Salonda cumba ve balıksırtı parke var.',
      'Bina 2012 öncesi yönetmeliğe göre yapıldı. Ekspertiz raporunu ve binanın deprem performans analizini isteyene gösteriyoruz.',
    ],
    placeholder: true,
  },
  {
    no: 'KI-2052',
    kind: 'kiralik',
    title: 'Göztepe’de deniz gören eşyalı 1+1',
    district: 'Kadıköy',
    neighborhood: 'Göztepe',
    rooms: '1+1',
    net: 55,
    brut: 68,
    floor: 5,
    totalFloors: 5,
    age: '6 yıl',
    heating: 'Kombi, radyatör',
    facade: 'Güney',
    price: 42_000,
    dues: 950,
    deposit: '2 kira',
    deed: 'Kat mülkiyeti',
    credit: false,
    furnished: true,
    parking: 'Yok',
    date: '20 Kasım 2026',
    images: [
      { img: balkonManzara, alt: 'Balkondan deniz ve Adalar manzarası' },
      { img: esentepeMutfak, alt: 'Açık mutfak ve yemek masası' },
    ],
    text: [
      'En üst katta, balkonundan Adalar görünen eşyalı 1+1. Marmaray’a yürüyerek sekiz dakika.',
      'Asansör yok, beşinci kata merdivenle çıkılıyor. Bunu ilk görüşmede söylüyoruz ki boşuna yol gelmeyin.',
    ],
    placeholder: true,
  },
];

const projectListings: Listing[] = projects.flatMap((p, pi) =>
  forSale(p).map((u, ui) => {
    const t = unitType(p, u.type);
    return {
      no: `${p.code}-${String(u.no).padStart(2, '0')}`,
      kind: 'satilik' as const,
      title: `${p.name}, daire ${u.no}`,
      district: p.district,
      neighborhood: p.neighborhood,
      project: p.slug,
      unit: u,
      rooms: u.type,
      net: t.net,
      brut: t.brut,
      floor: u.floor,
      totalFloors: (p.building?.floors ?? 0) + 1,
      age: 'Yapım aşamasında',
      heating: 'Yerden ısıtma, kombi',
      facade: u.facade,
      price: u.price!,
      deed: 'Kat irtifakı',
      credit: true,
      furnished: false,
      parking: 'Kapalı otopark, 1 araç',
      date: site.updated,
      images: (() => {
        const g = p.gallery.filter((x) => x.group !== 'Şantiye' && (u.floor >= 3 || !/Adalar|Balkon|balkon/.test(x.alt)));
        const k = (ui + (pi === 0 ? 2 : 0)) % g.length; // her dairenin kapak görseli farklı olsun
        return [...g.slice(k), ...g.slice(0, k)].slice(0, 4).map((x) => ({ img: x.img, alt: x.alt }));
      })(),
      text: [
        `${p.name}’in ${floorName(u.floor).toLowerCase()} ${u.side === 0 ? 'batı' : 'doğu'} dairesi. ${u.extra ? `${u.extra}. ` : ''}Teslim ${p.delivery}.`,
        p.intro[0],
      ],
      placeholder: true as const,
    };
  }),
);

export const listings: Listing[] = [...projectListings, ...portfolio];
export const getListing = (no: string) => listings.find((l) => l.no === no)!;
export const listingSlug = (l: Listing) => l.no.toLowerCase();

/* ------------------------------------------------------------------ şantiye günlüğü */

export const log: { date: string; project: string; text: string; img?: ImageMetadata; alt?: string }[] = [
  { date: '21 Kasım 2026', project: 'goztepe-14', text: 'Cephe tuğlası 4. kata ulaştı. İskele batı yarıda sökülmeye başlandı.', img: goztepeSantiye, alt: 'Göztepe 14: iskele ve güvenlik filesiyle kaplı bina' },
  { date: '12 Kasım 2026', project: 'esentepe-park', text: '5. kat döşeme betonu döküldü: C30, 58 m³. Küp numuneleri laboratuvara gitti, 7 günlük sonuçlar geldiğinde buraya yazacağız.', img: santiyeBeton, alt: 'Esentepe Park: donatı üzerine beton dökülüyor' },
  { date: '30 Ekim 2026', project: 'esentepe-park', text: '4. kat kolonları ve perde duvarları kalıptan alındı. Kalıplar 5. kata taşındı.', img: santiyeKalip, alt: 'Esentepe Park: kalıptan alınmış kolonlar ve iksa direkleri' },
  { date: '8 Ekim 2026', project: 'tasdelen-konaklari', text: 'Zemin etüdü sondajları bitti. Rapor ruhsat dosyasıyla birlikte belediyeye verildi.' },
];

/* ------------------------------------------------------------------ kentsel dönüşüm */

export const transformation = {
  steps: [
    { title: 'Ön görüşme ve bina tespiti', from: 0, to: 1, text: 'Binayı geziyor, tapu ve iskân durumunu inceliyoruz. Riskli yapı raporu yoksa nasıl alınacağını anlatıyoruz.' },
    { title: 'Teklif ve paylaşım şeması', from: 1, to: 2, text: 'Her malike düşecek dairenin katını, cephesini ve net metrekaresini yazılı veriyoruz.' },
    { title: 'Noter sözleşmesi', from: 2, to: 3, text: 'Kat karşılığı inşaat sözleşmesi noterde imzalanır. Paylaşım şeması sözleşmenin ekidir.' },
    { title: 'Proje ve ruhsat', from: 3, to: 6, text: 'Mimari ve statik projeyi belediyeye sunuyoruz. Ruhsat çıkana kadar kimse evinden çıkmaz.' },
    { title: 'Tahliye ve yıkım', from: 6, to: 7, text: 'Kira yardımı tahliye günü başlar. Yıkımı lisanslı firma yapar, komşu binalar fotoğraflanır.' },
    { title: 'İnşaat', from: 7, to: 25, text: 'Her ay malik grubuna fotoğraflı ilerleme raporu gönderiyoruz. Şantiyeye istediğiniz gün gelebilirsiniz.' },
    { title: 'İskân ve tapu', from: 25, to: 27, text: 'İskân alınınca kat mülkiyeti kurulur, yeni tapular adınıza çıkar ve anahtarlar teslim edilir.' },
  ],
  months: 27,
  offer: [
    'Size düşen dairenin katı, cephesi ve net metrekaresi',
    'Aylık kira yardımının tutarı ve ödeme günü',
    'Teslim tarihi ve gecikilen her ay için ödenecek tutar',
    'Tapu devrinin hangi inşaat aşamasına bağlı olduğu',
    'Malzeme listesi: marka ve sınıfıyla',
    'Harç, ruhsat ve yapı denetim masraflarının kime ait olduğu',
  ],
  documents: ['Tapu bilgileri (fotokopi ya da e-Devlet çıktısı)', 'Varsa riskli yapı raporu', 'Binanın eski projesi ya da iskânı', 'Kat maliklerinin iletişim listesi'],
  faq: [
    { q: 'Kaç malikin onayı gerekiyor?', a: 'Riskli yapılarda karar, 6306 sayılı Kanun’a göre hisselerin en az üçte iki çoğunluğuyla alınır. Kendi binanız için durumu ön görüşmede birlikte konuşuruz.' },
    { q: 'Tapuyu ne zaman devrediyoruz?', a: 'Devri inşaatın ilerlemesine bağlarız: arsa payının bir kısmı ruhsattan sonra, kalanı kaba inşaat bittiğinde. Oranlar sözleşmede yazılıdır.' },
    { q: 'Ön görüşme ücretli mi?', a: 'Hayır. Binayı gezmek, belgeleri incelemek ve teklif hazırlamak ücretsizdir.' },
    { q: 'Daha fazla metrekare veren müteahhidi mi seçmeliyim?', a: 'Tek ölçü bu olmamalı. Metrekarenin net mi brüt mü olduğuna, teslim tarihine, kira yardımına ve müteahhidin bitirdiği binalara bakın. Bizim bitirdiğimiz binaların adresini veririz; gidip oturanlara sorabilirsiniz.' },
  ],
};
