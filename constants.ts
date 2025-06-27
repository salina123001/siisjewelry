import { Product } from './types';

export const NAV_LINKS = [
  { href: '#', label: '首頁' },
  { href: '#products', label: '產品' },
  { href: '#about', label: '關於我們' },
  { href: '#contact', label: '聯繫我們' },
];

export const PRODUCTS: Product[] = [
  { id: 1, name: '紫水晶能量項鍊', price: 298.00, images: ['https://picsum.photos/id/157/800/800', 'https://picsum.photos/id/257/800/800', 'https://picsum.photos/id/357/800/800'], rating: 4.5, reviews: 42, description: '這款精緻的紫水晶項鍊選用頂級巴西紫水晶，以其深邃的紫色調和卓越的淨度而聞名。紫水晶被認為能夠開啟智慧、提升專注力並帶來內心的平靜。適合冥想、工作或日常佩戴，為您的能量場注入穩定與和諧。', tag: { text: '新品', color: 'bg-primary' }, category: '紫水晶' },
  { id: 2, name: '粉水晶愛情手鍊', price: 198.00, images: ['https://picsum.photos/id/158/800/800', 'https://picsum.photos/id/258/800/800', 'https://picsum.photos/id/358/800/800'], rating: 5, reviews: 78, description: '溫潤的馬達加斯加粉水晶，是愛的化身。這款手鍊能溫柔地打開您的心輪，增進人際關係，吸引愛情與友誼。每一顆珠子都經過精心打磨，觸感溫和，是提升個人魅力的最佳選擇。', tag: { text: '熱賣', color: 'bg-secondary' }, category: '粉水晶' },
  { id: 3, name: '綠幽靈財富吊墜', price: 328.00, images: ['https://picsum.photos/id/159/800/800', 'https://picsum.photos/id/259/800/800', 'https://picsum.photos/id/359/800/800'], rating: 4, reviews: 36, description: '綠幽靈水晶，又稱「事業水晶」，其內部的火山泥礦物形成了獨特的層次感。它被認為能吸引正財，幫助事業發展，並帶來好運與機會。這款吊墜設計簡潔大方，能彰顯您的專業與品味。', category: '綠幽靈' },
  { id: 4, name: '黑曜石守護手鍊', price: 258.00, images: ['https://picsum.photos/id/160/800/800', 'https://picsum.photos/id/260/800/800', 'https://picsum.photos/id/360/800/800'], rating: 4.5, reviews: 51, description: '來自墨西哥的黑曜石，具有強大的保護能量，能有效吸收負能量，形成一道堅實的能量屏障。這款手鍊適合時常出入複雜環境的人士佩戴，為您提供穩定與安全的守護力量。', tag: { text: '限量', color: 'bg-accent text-dark' }, category: '其他' },
  { id: 5, name: '黃水晶財富吊墜', price: 368.00, images: ['https://picsum.photos/id/161/800/800', 'https://picsum.photos/id/261/800/800', 'https://picsum.photos/id/361/800/800'], rating: 3, reviews: 24, description: '閃耀著太陽般光芒的黃水晶，是著名的財富之石。它對應太陽輪，能增強自信與決策力，並吸引意想不到的財富機會（偏財）。佩戴此吊墜，為您的生活注入滿滿的活力與豐盛。', category: '其他' },
  { id: 6, name: '白水晶淨化手鍊', price: 218.00, images: ['https://picsum.photos/id/162/800/800', 'https://picsum.photos/id/262/800/800', 'https://picsum.photos/id/362/800/800'], rating: 4, reviews: 32, description: '白水晶被譽為「水晶之王」，具有淨化、平衡和放大能量的功效。它可以清理個人和環境的負能量，提升思緒清晰度。這款手鍊設計簡約，是水晶入門者和能量療癒師的必備單品。', category: '其他' },
  { id: 7, name: '紅紋石愛情吊墜', price: 348.00, images: ['https://picsum.photos/id/163/800/800', 'https://picsum.photos/id/263/800/800', 'https://picsum.photos/id/363/800/800'], rating: 5, reviews: 67, description: '嬌豔的紅紋石是療癒情感創傷、尋找靈魂伴侶的強力夥伴。它能引導您釋放過去的傷痛，用愛填滿內心，並鼓勵您以更開放和包容的態度面對愛情。', tag: { text: '熱賣', color: 'bg-secondary' }, category: '粉水晶' },
  { id: 8, name: '海藍寶溝通手鍊', price: 278.00, images: ['https://picsum.photos/id/164/800/800', 'https://picsum.photos/id/264/800/800', 'https://picsum.photos/id/364/800/800'], rating: 3.5, reviews: 45, description: '如海洋般清澈的海藍寶，對應喉輪，能提升溝通與表達能力。它有助於清晰、冷靜地表達自己的想法，非常適合需要公開演講或頻繁溝通的專業人士。', category: '其他' }
];

export const INTERACTIVE_EXPERIENCES = [
    { 
        title: '自己設計手串', 
        description: '發揮您的創意，親手搭配設計出獨一無二的能量水晶手串。',
        image: 'https://picsum.photos/id/1011/600/400',
        url: 'https://salina123001.github.io/bead-designer/' 
    },
    { 
        title: 'AI流年運勢', 
        description: '結合古老智慧與現代AI，為您解析流年運勢，找到您的守護水晶。',
        image: 'https://picsum.photos/id/10/600/400',
        url: 'https://richweb-black.vercel.app/' 
    },
    { 
        title: '水晶快手遊戲', 
        description: '考驗您的眼力與速度，在充滿樂趣的遊戲中認識更多美麗水晶。',
        image: 'https://picsum.photos/id/102/600/400',
        url: 'https://salina123001.github.io/crystal-game/' 
    }
];

export const FEATURES = [
    { icon: 'fa-certificate', title: '100% 純天然水晶', description: '我們承諾所有水晶產品均為天然材質，未經人工染色或處理，保留其原始能量與美感。' },
    { icon: 'fa-globe', title: '全球精選', description: '從巴西的紫水晶到馬達加斯加的孔雀石，我們精心挑選來自世界各地的優質水晶資源。' },
    { icon: 'fa-heart', title: '能量加持', description: '每件水晶飾品都經過專業淨化與能量激活，為您帶來身心平衡與積極能量。' }
];