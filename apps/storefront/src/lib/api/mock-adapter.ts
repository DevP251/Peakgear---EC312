// ─────────────────────────────────────────────────────────────────────────────
// Mock Adapter Layer
// Implements full backend business logic for independent frontend operation.
// Calculates all pricing, discounts, shipping, inventory, and recommendations.
// ─────────────────────────────────────────────────────────────────────────────

import rawCatalog from '@/mocks/catalog.json'
import type {
  Product,
  Collection,
  Bundle,
  BundleComponent,
  FinderQuestion,
  FinderRecommendations,
  FinderRecommendedProduct,
  Cart,
  CartItem,
  Order,
  ShippingOption,
  CheckoutTotals,
} from '@/types/storefront'
import { SITE_LEGAL } from '@/config/site-legal'

const allProducts = rawCatalog as unknown as Product[]

// ─────────────────────────────────────────────────────────────────────────────
// Collections Definition (Matching Specification)
// ─────────────────────────────────────────────────────────────────────────────
const COLLECTIONS: Collection[] = [
  {
    id: 'col-trekking',
    handle: 'trekking',
    title: 'Trang Bị Trekking & Leo Núi',
    description: 'Balo trợ lực, giày cao cổ chống trượt, gậy leo núi carbon và lều kỹ thuật cho các cung đường rừng núi hiểm trở.',
    itemCount: allProducts.filter((p) => p.activities?.includes('trekking') || ['backpacks', 'footwear'].includes(p.category.id)).length,
  },
  {
    id: 'col-hiking',
    handle: 'hiking',
    title: 'Trang Bị Hiking & Đi Bộ Dã Ngoại',
    description: 'Trang phục thoáng khí, balo nhẹ 15–30L và bình nước tiện lợi cho các chuyến đi dạo ngắm cảnh trong ngày.',
    itemCount: allProducts.filter((p) => p.activities?.includes('hiking') || ['apparel', 'equipment-accessories'].includes(p.category.id)).length,
  },
  {
    id: 'col-camping',
    handle: 'camping',
    title: 'Trang Bị Cắm Trại & Basecamp',
    description: 'Lều cắm trại 2–4 người chống mưa, đệm hơi, túi ngủ giữ ấm, bếp gas dã ngoại và đèn pin cho đêm hạ trại trọn vẹn.',
    itemCount: allProducts.filter((p) => p.activities?.includes('camping') || ['camping-tents', 'cooking-tools'].includes(p.category.id)).length,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Pre-Made Bundles Definition (Near Zero Standard)
// ─────────────────────────────────────────────────────────────────────────────
function findAlternatives(prod: Product): Product[] {
  return allProducts.filter((p) => p.category.id === prod.category.id && p.id !== prod.id && p.stock > 0).slice(0, 3)
}

function buildPresetBundles(): Bundle[] {
  const getProd = (pred: (p: Product) => boolean, fallbackIdx: number): Product => {
    return allProducts.find(pred) || allProducts[fallbackIdx]
  }

  const p_pack_day = getProd((p) => p.category.id === 'backpacks' && p.weightGrams < 600, 10)
  const p_bottle = getProd((p) => p.category.id === 'equipment-accessories' && p.name.toLowerCase().includes('bình'), 5)
  const p_lamp = getProd((p) => p.category.id === 'equipment-accessories' && p.name.toLowerCase().includes('đèn'), 8)
  const p_towel = getProd((p) => p.category.id === 'apparel' && p.price < 300000, 2)

  const p_pack_trek = getProd((p) => p.category.id === 'backpacks' && p.price > 800000, 14)
  const p_tent_2p = getProd((p) => p.category.id === 'camping-tents' && p.name.includes('2'), 25)
  const p_mat = getProd((p) => p.name.toLowerCase().includes('đệm') || p.name.toLowerCase().includes('ngủ'), 28)
  const p_stove = getProd((p) => p.category.id === 'cooking-tools' && p.name.toLowerCase().includes('bếp'), 45)
  const p_pole = getProd((p) => p.name.toLowerCase().includes('gậy'), 32)

  const p_pack_pro = getProd((p) => p.category.id === 'backpacks' && p.price > 1500000, 15)
  const p_tent_pro = getProd((p) => p.category.id === 'camping-tents' && p.price > 2000000, 26)
  const p_sleep_pro = getProd((p) => p.name.toLowerCase().includes('túi ngủ') || p.price > 600000, 30)
  const p_cook_pro = getProd((p) => p.category.id === 'cooking-tools' && p.price > 500000, 48)

  const p_tent_fam = getProd((p) => p.category.id === 'camping-tents' && (p.name.includes('4') || p.name.includes('Arpenaz')), 27)
  const p_bag_fam = getProd((p) => p.category.id === 'backpacks' && p.name.includes('Túi'), 18)
  const p_cook_fam = getProd((p) => p.category.id === 'cooking-tools' && p.name.includes('Nồi'), 50)
  const p_lamp_fam = getProd((p) => p.name.toLowerCase().includes('đèn'), 9)

  const b1_prods = [
    { p: p_pack_day, req: true, group: 'pack' as const, groupName: '1. Balo & Mang vác' },
    { p: p_bottle, req: false, group: 'cook' as const, groupName: '4. Bếp & Ẩm thực' },
    { p: p_lamp, req: false, group: 'safety' as const, groupName: '5. An toàn & Phụ kiện' },
    { p: p_towel, req: false, group: 'safety' as const, groupName: '5. An toàn & Phụ kiện' },
  ]
  const b1_orig = b1_prods.reduce((a, b) => a + b.p.price, 0)
  const b1_price = Math.round(b1_orig * 0.90)

  const b2_prods = [
    { p: p_pack_trek, req: true, group: 'pack' as const, groupName: '1. Balo & Mang vác' },
    { p: p_tent_2p, req: true, group: 'shelter' as const, groupName: '2. Nơi trú ẩn & Lều trại' },
    { p: p_mat, req: false, group: 'sleep' as const, groupName: '3. Giấc ngủ & Đệm' },
    { p: p_stove, req: false, group: 'cook' as const, groupName: '4. Bếp & Ẩm thực' },
    { p: p_pole, req: false, group: 'safety' as const, groupName: '5. An toàn & Phụ kiện' },
  ]
  const b2_orig = b2_prods.reduce((a, b) => a + b.p.price, 0)
  const b2_price = Math.round(b2_orig * 0.85)

  const b3_prods = [
    { p: p_pack_pro, req: true, group: 'pack' as const, groupName: '1. Balo & Mang vác' },
    { p: p_tent_pro, req: true, group: 'shelter' as const, groupName: '2. Nơi trú ẩn & Lều trại' },
    { p: p_sleep_pro, req: false, group: 'sleep' as const, groupName: '3. Giấc ngủ & Đệm' },
    { p: p_cook_pro, req: false, group: 'cook' as const, groupName: '4. Bếp & Ẩm thực' },
  ]
  const b3_orig = b3_prods.reduce((a, b) => a + b.p.price, 0)
  const b3_price = Math.round(b3_orig * 0.82)

  const b4_prods = [
    { p: p_tent_fam, req: true, group: 'shelter' as const, groupName: '2. Nơi trú ẩn & Lều trại' },
    { p: p_bag_fam, req: false, group: 'pack' as const, groupName: '1. Balo & Mang vác' },
    { p: p_cook_fam, req: false, group: 'cook' as const, groupName: '4. Bếp & Ẩm thực' },
    { p: p_lamp_fam, req: false, group: 'safety' as const, groupName: '5. An toàn & Phụ kiện' },
  ]
  const b4_orig = b4_prods.reduce((a, b) => a + b.p.price, 0)
  const b4_price = Math.round(b4_orig * 0.88)

  return [
    {
      id: 'bundle-day-hike',
      handle: 'goi-day-hike-gon-nhe',
      title: 'Gói Day-Hike Gọn Nhẹ',
      subtitle: 'Hệ thống thiết yếu cho các chuyến đi bộ và leo đồi trong ngày (dưới 15km).',
      description: 'Gồm balo 20L gọn gàng, bình nước thể thao rảnh tay, đèn pin chiếu sáng và khăn đa năng dã ngoại.',
      useCase: 'Cung đường Hàm Lợn, Mộc Châu, Núi Bà Đen đi và về trong ngày.',
      activity: 'hiking',
      tier: 'day_hike',
      image: p_pack_day.images[0] || '/images/products/decathlon/placeholder.jpg',
      price: b1_price,
      bundlePrice: b1_price,
      originalPrice: b1_orig,
      savings: b1_orig - b1_price,
      savingsAmount: b1_orig - b1_price,
      discountPercentage: 10,
      discountPercent: 10,
      tierDiscountRate: 10,
      totalWeightGrams: b1_prods.reduce((a, b) => a + (b.p.weightGrams || 300), 0),
      totalWeightFormatted: `${(b1_prods.reduce((a, b) => a + (b.p.weightGrams || 300), 0) / 1000).toFixed(1)}kg`,
      isCustomizable: true,
      isAvailable: b1_prods.every((b) => b.p.stockStatus !== 'outofstock'),
      components: b1_prods.map((item) => {
        const alts = findAlternatives(item.p)
        return {
          productId: item.p.id,
          name: item.p.name,
          title: item.p.title || item.p.name,
          image: item.p.thumbnail || item.p.images[0] || '/images/placeholder.svg',
          thumbnail: item.p.thumbnail || item.p.images[0] || '/images/placeholder.svg',
          price: item.p.price,
          originalPrice: item.p.price,
          weightGrams: item.p.weightGrams,
          weightFormatted: item.p.weightFormatted || `${item.p.weightGrams}g`,
          required: item.req,
          quantity: 1,
          categoryGroup: item.group,
          groupName: item.groupName,
          alternativeProductIds: alts.map((a) => a.id),
          alternativeProducts: alts,
        }
      }),
      features: {
        pack: `${p_pack_day.name} (${p_pack_day.weightFormatted || '450g'})`,
        shelter: '— (Không cần lều)',
        sleep: '— (Không cần đệm)',
        cook: `${p_bottle.name}`,
        safety: `${p_lamp.name} & Phụ kiện`,
      },
    },
    {
      id: 'bundle-weekend-trek',
      handle: 'goi-trekking-cuoi-tuan',
      title: 'Gói Trekking Cuối Tuần',
      subtitle: 'Bộ trang bị đầy đủ đạt chuẩn sinh tồn 2 ngày 1 đêm qua đêm trong rừng.',
      description: 'Gồm balo trợ lực 45L, lều chống mưa 2 người, đệm cách nhiệt, bếp gas mini gấp gọn và gậy leo núi.',
      useCase: 'Trekking Tà Năng - Phan Dũng, Bidoup, Tà Xùa; cắm trại qua đêm.',
      activity: 'trekking',
      tier: 'weekend_trek',
      image: p_pack_trek.images[0] || '/images/products/fanfan/placeholder.jpg',
      price: b2_price,
      bundlePrice: b2_price,
      originalPrice: b2_orig,
      savings: b2_orig - b2_price,
      savingsAmount: b2_orig - b2_price,
      discountPercentage: 15,
      discountPercent: 15,
      tierDiscountRate: 15,
      totalWeightGrams: b2_prods.reduce((a, b) => a + (b.p.weightGrams || 800), 0),
      totalWeightFormatted: `${(b2_prods.reduce((a, b) => a + (b.p.weightGrams || 800), 0) / 1000).toFixed(1)}kg`,
      isCustomizable: true,
      isAvailable: b2_prods.every((b) => b.p.stockStatus !== 'outofstock'),
      isPopular: true,
      components: b2_prods.map((item) => {
        const alts = findAlternatives(item.p)
        return {
          productId: item.p.id,
          name: item.p.name,
          title: item.p.title || item.p.name,
          image: item.p.thumbnail || item.p.images[0] || '/images/placeholder.svg',
          thumbnail: item.p.thumbnail || item.p.images[0] || '/images/placeholder.svg',
          price: item.p.price,
          originalPrice: item.p.price,
          weightGrams: item.p.weightGrams,
          weightFormatted: item.p.weightFormatted || `${item.p.weightGrams}g`,
          required: item.req,
          quantity: 1,
          categoryGroup: item.group,
          groupName: item.groupName,
          alternativeProductIds: alts.map((a) => a.id),
          alternativeProducts: alts,
        }
      }),
      features: {
        pack: `${p_pack_trek.name} (Khung trợ lực)`,
        shelter: `${p_tent_2p.name} (Chống mưa PU3000)`,
        sleep: `${p_mat.name} (Cách nhiệt)`,
        cook: `${p_stove.name} (Gấp gọn)`,
        safety: `${p_pole.name} (Hợp kim bền bỉ)`,
      },
    },
    {
      id: 'bundle-alpine-summit',
      handle: 'goi-chinh-phuc-chuyen-sau',
      title: 'Gói Chinh Phục Chuyên Sâu',
      subtitle: 'Cấu hình leo núi 4 mùa, chịu gió giật cấp 7 và thời tiết khắc nghiệt trên 2000m.',
      description: 'Balo 65L chịu tải nặng, lều kỹ thuật chuyên sâu, túi ngủ ấm áp chống rét và bếp dã ngoại công suất cao.',
      useCase: 'Chinh phục Fansipan, Putaleng, Bạch Mộc Lương Tử mùa đông lạnh giá.',
      activity: 'trekking',
      tier: 'alpine_summit',
      image: p_pack_pro.images[0] || '/images/products/decathlon/placeholder.jpg',
      price: b3_price,
      bundlePrice: b3_price,
      originalPrice: b3_orig,
      savings: b3_orig - b3_price,
      savingsAmount: b3_orig - b3_price,
      discountPercentage: 18,
      discountPercent: 18,
      tierDiscountRate: 18,
      totalWeightGrams: b3_prods.reduce((a, b) => a + (b.p.weightGrams || 1000), 0),
      totalWeightFormatted: `${(b3_prods.reduce((a, b) => a + (b.p.weightGrams || 1000), 0) / 1000).toFixed(1)}kg`,
      isCustomizable: true,
      isAvailable: b3_prods.every((b) => b.p.stockStatus !== 'outofstock'),
      components: b3_prods.map((item) => {
        const alts = findAlternatives(item.p)
        return {
          productId: item.p.id,
          name: item.p.name,
          title: item.p.title || item.p.name,
          image: item.p.thumbnail || item.p.images[0] || '/images/placeholder.svg',
          thumbnail: item.p.thumbnail || item.p.images[0] || '/images/placeholder.svg',
          price: item.p.price,
          originalPrice: item.p.price,
          weightGrams: item.p.weightGrams,
          weightFormatted: item.p.weightFormatted || `${item.p.weightGrams}g`,
          required: item.req,
          quantity: 1,
          categoryGroup: item.group,
          groupName: item.groupName,
          alternativeProductIds: alts.map((a) => a.id),
          alternativeProducts: alts,
        }
      }),
      features: {
        pack: `${p_pack_pro.name} (65L Chống xé)`,
        shelter: `${p_tent_pro.name} (Khung nhôm 4 mùa)`,
        sleep: `${p_sleep_pro.name} (Giữ nhiệt 5°C)`,
        cook: `${p_cook_pro.name} (Nồi nhôm cao cấp)`,
        safety: 'Đèn công suất lớn & Gậy trợ lực',
      },
    },
    {
      id: 'bundle-basecamp-comfort',
      handle: 'goi-cam-trai-thu-gian',
      title: 'Gói Cắm Trại Thư Giãn',
      subtitle: 'Không gian sống tiện nghi ven hồ, gia đình và nhóm bạn sum họp dịp cuối tuần.',
      description: 'Lều 4 người thông thoáng, túi chứa hành lý rộng rãi, bộ nồi nấu dã ngoại đầy đủ và đèn lều ấm áp.',
      useCase: 'Hồ Trị An, Hàm Lợn, Ba Vì; cắm trại dã ngoại gia đình thư giãn.',
      activity: 'camping',
      tier: 'basecamp_comfort',
      image: p_tent_fam.images[0] || '/images/products/fanfan/placeholder.jpg',
      price: b4_price,
      bundlePrice: b4_price,
      originalPrice: b4_orig,
      savings: b4_orig - b4_price,
      savingsAmount: b4_orig - b4_price,
      discountPercentage: 12,
      discountPercent: 12,
      tierDiscountRate: 12,
      totalWeightGrams: b4_prods.reduce((a, b) => a + (b.p.weightGrams || 1200), 0),
      totalWeightFormatted: `${(b4_prods.reduce((a, b) => a + (b.p.weightGrams || 1200), 0) / 1000).toFixed(1)}kg`,
      isCustomizable: true,
      isAvailable: b4_prods.every((b) => b.p.stockStatus !== 'outofstock'),
      components: b4_prods.map((item) => {
        const alts = findAlternatives(item.p)
        return {
          productId: item.p.id,
          name: item.p.name,
          title: item.p.title || item.p.name,
          image: item.p.thumbnail || item.p.images[0] || '/images/placeholder.svg',
          thumbnail: item.p.thumbnail || item.p.images[0] || '/images/placeholder.svg',
          price: item.p.price,
          originalPrice: item.p.price,
          weightGrams: item.p.weightGrams,
          weightFormatted: item.p.weightFormatted || `${item.p.weightGrams}g`,
          required: item.req,
          quantity: 1,
          categoryGroup: item.group,
          groupName: item.groupName,
          alternativeProductIds: alts.map((a) => a.id),
          alternativeProducts: alts,
        }
      }),
      features: {
        pack: `${p_bag_fam.name} (Chống thấm 60L)`,
        shelter: `${p_tent_fam.name} (4 người thoáng khí)`,
        sleep: 'Đệm hơi dã ngoại êm ái',
        cook: `${p_cook_fam.name} (Đầy đủ nắp quai)`,
        safety: `${p_lamp_fam.name} (Chiếu sáng rộng)`,
      },
    },
  ]
}

const PRESET_BUNDLES = buildPresetBundles()

// ─────────────────────────────────────────────────────────────────────────────
// Hyperlite Mountain Gear Finder Questions (Config-driven Wizard Schema)
// Supports all 6 types: single_select, multi_select, range, number, boolean, info + dependsOn
// ─────────────────────────────────────────────────────────────────────────────
const FINDER_QUESTIONS: FinderQuestion[] = [
  {
    id: 'activity_terrain',
    step: 1,
    eyebrow: 'BƯỚC 1/8 — LOẠI HÌNH & ĐỊA HÌNH',
    title: 'Cung đường sắp tới của bạn là gì?',
    description: 'Địa hình và thời lượng chuyến đi là yếu tố tiên quyết xác định hệ thống khung tải và thể tích balo.',
    type: 'single_select',
    required: true,
    options: [
      {
        value: 'day_hike',
        label: 'Trekking trong ngày (Day Hike)',
        description: 'Cung đường 10–20km đi và về trong ngày, đồi dốc thoai thoải, không qua đêm.',
        icon: '🥾',
        tag: 'Gọn nhẹ 15–25L',
      },
      {
        value: 'weekend_trek',
        label: 'Leo núi 2–3 ngày (Weekend Trek)',
        description: 'Chinh phục đỉnh núi, rừng quốc gia, ngủ lều qua đêm, tự mang đồ sinh hoạt.',
        icon: '⛺',
        tag: 'Tiêu chuẩn 40–55L',
      },
      {
        value: 'basecamp',
        label: 'Cắm trại gia đình (Basecamp Comfort)',
        description: 'Hạ trại gần xe hoặc ven hồ, ưu tiên không gian sinh hoạt rộng rãi và tiện nghi nấu nướng.',
        icon: '🏕️',
        tag: 'Tiện nghi tối đa',
      },
      {
        value: 'trail_run',
        label: 'Chạy Trail & Fastpacking',
        description: 'Di chuyển tốc độ cao, địa hình hiểm trở, cắt giảm từng gram trọng lượng trên vai.',
        icon: '🏃',
        tag: 'Siêu nhẹ 10–18L',
      },
    ],
  },
  {
    id: 'duration_days',
    step: 2,
    eyebrow: 'BƯỚC 2/8 — THỜI LƯỢNG HÀNH TRÌNH',
    title: 'Chuyến đi dự kiến kéo dài bao nhiêu ngày?',
    description: 'Số ngày quyết định trực tiếp thể tích balo và cơ số lương thực, nước uống cần dự trữ.',
    type: 'number',
    required: true,
    min: 1,
    max: 14,
    unit: 'ngày',
    defaultValue: 2,
  },
  {
    id: 'group_size',
    step: 3,
    eyebrow: 'BƯỚC 3/8 — QUY MÔ ĐOÀN (TÙY CHỌN)',
    title: 'Đoàn của bạn có khoảng bao nhiêu thành viên?',
    description: 'Quy mô nhóm giúp tính toán dung tích lều trại và chia sẻ tải trọng thiết bị dùng chung.',
    type: 'range',
    required: false,
    min: 1,
    max: 12,
    stepSize: 1,
    unit: 'người',
    defaultValue: 2,
  },
  {
    id: 'climate_temp',
    step: 4,
    eyebrow: 'BƯỚC 4/8 — KHÍ HẬU & THỜI TIẾT DỰ KIẾN',
    title: 'Điều kiện thời tiết tại điểm đến ra sao?',
    description: 'Nhiệt độ và độ ẩm quyết định chỉ số chống mưa của lều và nhiệt độ thoải mái của túi ngủ.',
    type: 'single_select',
    required: true,
    options: [
      {
        value: 'dry_hot',
        label: 'Mùa khô & Nắng nóng (> 25°C)',
        description: 'Vùng đồi trọc, duyên hải khô ráo; ưu tiên đồ thoát mồ hôi nhanh, che chắn tia UV.',
        icon: '☀️',
        tag: 'Thoáng khí UV50+',
      },
      {
        value: 'mild_temperate',
        label: 'Mát mẻ ôn đới (15°C – 25°C)',
        description: 'Đà Lạt, Mộc Châu, Ba Vì mùa thu; thời tiết lý tưởng, chênh lệch nhiệt ngày đêm vừa phải.',
        icon: '🌲',
        tag: 'Đa dụng 3 mùa',
      },
      {
        value: 'rainy_humid',
        label: 'Rừng mưa nhiệt đới & Ẩm ướt',
        description: 'Độ ẩm cao, mưa bất chợt; bắt buộc lều PU > 3000mm, balo có áo mưa bọc hoặc kháng nước.',
        icon: '🌧️',
        tag: 'Kháng nước cao',
      },
      {
        value: 'cold_alpine',
        label: 'Rét lạnh núi cao (< 10°C)',
        description: 'Đỉnh Fansipan, Tà Xùa, Putaleng mùa đông; gió rít mạnh, cần túi ngủ bông nén giữ nhiệt.',
        icon: '❄️',
        tag: 'Cách nhiệt chuyên sâu',
      },
    ],
  },
  {
    id: 'need_cooking',
    step: 5,
    eyebrow: 'BƯỚC 5/8 — NHU CẦU ẨM THỰC BÃI TRẠI',
    title: 'Bạn có tự nấu ăn và đun nước nóng tại điểm cắm trại không?',
    description: 'Nếu chọn có, hệ thống sẽ đề xuất hệ thống bếp gas dã ngoại gấp gọn và bộ nồi nhôm tản nhiệt.',
    type: 'boolean',
    required: true,
    defaultValue: true,
  },
  {
    id: 'cooking_preferences',
    step: 6,
    eyebrow: 'BƯỚC 6/8 — TRANG BỊ BẾP ƯU TIÊN (PHÂN NHÁNH)',
    title: 'Những vật dụng nấu nướng nào bạn muốn mang theo?',
    description: 'Tùy chỉnh phân hệ bếp phù hợp với thói quen ẩm thực của bạn giữa thiên nhiên hoang dã.',
    type: 'multi_select',
    required: false,
    dependsOn: {
      questionId: 'need_cooking',
      value: true,
      operator: 'equals',
    },
    options: [
      {
        value: 'pot_set',
        label: 'Bộ nồi nhôm dã ngoại xếp gọn',
        description: 'Nồi có quai gập và nắp đậy, phủ chống dính, dễ dàng vệ sinh bãi trại.',
        icon: '🍲',
      },
      {
        value: 'gas_stove',
        label: 'Bếp gas mini gấp gọn chân nhện',
        description: 'Chống gió tốt, đánh lửa cơ học tích hợp, chịu tải nồi đun lớn.',
        icon: '🔥',
      },
      {
        value: 'camp_cutlery',
        label: 'Bộ muỗng nĩa gấp & Ly cách nhiệt',
        description: 'Vật liệu thép không gỉ/titanium siêu nhẹ, bền chắc tuyệt đối.',
        icon: '🍴',
      },
      {
        value: 'coffee_maker',
        label: 'Bình pha cà phê phin dã ngoại',
        description: 'Thưởng thức cà phê nóng buổi sáng giữa sương sớm vùng cao.',
        icon: '☕',
      },
    ],
  },
  {
    id: 'carry_priority',
    step: 7,
    eyebrow: 'BƯỚC 7/8 — TRIẾT LÝ MANG VÁC',
    title: 'Bạn ưu tiên trải nghiệm mang vác nào hơn?',
    description: 'Phong cách trekking quyết định sự cân bằng giữa trọng lượng hành lý và sự thoải mái khi hạ trại.',
    type: 'single_select',
    required: true,
    options: [
      {
        value: 'ultralight',
        label: 'Siêu nhẹ tối giản (Ultralight / Fast & Light)',
        description: 'Chỉ mang những món sinh tồn cốt lõi, balo dưới 7kg để đôi chân nhẹ nhàng và đi nhanh hơn.',
        icon: '🪶',
        tag: 'Trọng lượng tối thiểu',
      },
      {
        value: 'comfort',
        label: 'Tiện nghi & Bền bỉ (Comfort & Durability)',
        description: 'Đầy đủ đệm êm, bếp nấu ngon, bàn ghế dã ngoại; sẵn sàng mang vác nặng hơn để tối đa trải nghiệm.',
        icon: '🛡️',
        tag: 'Bền chắc & Tiện ích',
      },
    ],
  },
  {
    id: 'safety_advisory',
    step: 8,
    eyebrow: 'BƯỚC 8/8 — CHỈ DẪN KỸ THUẬT QUỐC TẾ',
    title: 'Nguyên Tắc Trọng Lượng Balo Chuẩn (The 20% Rule)',
    description: 'Khuyến cáo y khoa dã ngoại: Tổng trọng lượng toàn bộ balo (bao gồm nước uống và lương thực) không được vượt quá 20% trọng lượng cơ thể người mang để bảo vệ cột sống và khớp gối.',
    type: 'info',
    required: false,
    infoContent: 'PeakGear áp dụng thuật toán cân bằng tải trọng Hyperlite: Tối ưu The Big Three (Balo, Lều, Túi ngủ) để giữ trọng lượng rỗng (Base Weight) dưới 5.5kg cho cung đường dài ngày tại Việt Nam.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Mock Adapter Export Implementation
// ─────────────────────────────────────────────────────────────────────────────
export const mockAdapter = {
  async getProducts(params?: {
    category?: string
    collection?: string
    search?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    stockOnly?: boolean
    sort?: string
    page?: number
    limit?: number
  }): Promise<{ products: Product[]; count: number; totalPages: number }> {
    let list = [...allProducts]

    // Filter by collection / activity
    if (params?.collection) {
      const col = params.collection.toLowerCase()
      if (['trekking', 'hiking', 'camping'].includes(col)) {
        list = list.filter((p) => p.activities?.includes(col))
      } else {
        list = list.filter((p) => p.category.id === col)
      }
    }

    if (params?.category) {
      list = list.filter((p) => p.category.id === params.category)
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      list = list.filter((p) => {
        const hay = `${p.name} ${p.brand} ${p.sku} ${p.category.name} ${p.tags?.join(' ') || ''}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
        return hay.includes(q)
      })
    }

    if (params?.brand) {
      list = list.filter((p) => p.brand.toLowerCase() === params.brand?.toLowerCase())
    }

    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.price >= params.minPrice!)
    }

    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= params.maxPrice!)
    }

    if (params?.stockOnly) {
      list = list.filter((p) => p.stockStatus !== 'outofstock')
    }

    // Sort
    const sort = params?.sort || 'recommended'
    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sort === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    }

    const count = list.length
    const page = Math.max(1, params?.page || 1)
    const limit = params?.limit || 12
    const totalPages = Math.ceil(count / limit) || 1
    const paginated = list.slice((page - 1) * limit, page * limit)

    return { products: paginated, count, totalPages }
  },

  async getProductByHandle(handle: string): Promise<Product | null> {
    const p = allProducts.find((x) => x.handle === handle || x.id === handle || x.slug === handle || x.sku === handle)
    return p || null
  },

  async getCollections(): Promise<Collection[]> {
    return COLLECTIONS
  },

  async getBundles(activity?: string): Promise<Bundle[]> {
    if (!activity) return PRESET_BUNDLES
    return PRESET_BUNDLES.filter((b) => b.activity.toLowerCase() === activity.toLowerCase())
  },

  async getBundleByHandle(handle: string): Promise<Bundle | null> {
    return PRESET_BUNDLES.find((b) => b.handle === handle || b.id === handle) || null
  },

  async getBundlesForProduct(productId: string): Promise<Bundle[]> {
    return PRESET_BUNDLES.filter((b) => b.components.some((c) => c.productId === productId))
  },

  async previewBundleCustomization(bundleId: string, selectedProductIds: string[]): Promise<Bundle> {
    const baseBundle = PRESET_BUNDLES.find((b) => b.id === bundleId || b.handle === bundleId) || PRESET_BUNDLES[0]

    // Mandatory rule: components marked required MUST NOT be omitted
    const requiredProductIds = baseBundle.components.filter((c) => c.required).map((c) => c.productId)
    const effectiveSelectedIds = Array.from(new Set([...requiredProductIds, ...selectedProductIds]))

    const selectedProducts: Product[] = effectiveSelectedIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => !!p)

    const orig = selectedProducts.reduce((acc, p) => acc + p.price, 0)

    // Tiered discount rule: 3 items: 10%, 4 items: 15%, 5+ items: 20%, < 3 items: 0%
    let discRate = 0
    if (selectedProducts.length >= 5) discRate = 0.20
    else if (selectedProducts.length >= 4) discRate = 0.15
    else if (selectedProducts.length >= 3) discRate = 0.10

    const finalPrice = Math.round(orig * (1 - discRate))
    const savings = orig - finalPrice
    const weightGrams = selectedProducts.reduce((acc, p) => acc + (p.weightGrams || 500), 0)
    const weightFormatted = weightGrams >= 1000 ? `${(weightGrams / 1000).toFixed(1)}kg` : `${weightGrams}g`

    const updatedComponents: BundleComponent[] = selectedProducts.map((p) => {
      const existingComp = baseBundle.components.find((c) => c.productId === p.id)
      const alts = findAlternatives(p)
      const catGroup = existingComp?.categoryGroup || (p.category.id === 'backpacks' ? 'pack' : p.category.id === 'camping-tents' ? 'shelter' : p.category.id === 'cooking-tools' ? 'cook' : 'safety')

      return {
        productId: p.id,
        name: p.name,
        title: p.title || p.name,
        image: p.thumbnail || p.images[0] || '/images/placeholder.svg',
        thumbnail: p.thumbnail || p.images[0] || '/images/placeholder.svg',
        price: p.price,
        originalPrice: p.price,
        weightGrams: p.weightGrams,
        weightFormatted: p.weightFormatted || `${p.weightGrams}g`,
        required: existingComp ? existingComp.required : false,
        quantity: existingComp ? existingComp.quantity : 1,
        categoryGroup: catGroup,
        groupName: existingComp?.groupName || (catGroup === 'pack' ? '1. Balo & Mang vác' : catGroup === 'shelter' ? '2. Nơi trú ẩn & Lều trại' : catGroup === 'sleep' ? '3. Giấc ngủ & Đệm' : catGroup === 'cook' ? '4. Bếp & Ẩm thực' : '5. An toàn & Phụ kiện'),
        alternativeProductIds: alts.map((a) => a.id),
        alternativeProducts: alts,
      }
    })

    const isAvailable = selectedProducts.every((p) => p.stock > 0 && p.stockStatus !== 'outofstock')

    return {
      ...baseBundle,
      price: finalPrice,
      bundlePrice: finalPrice,
      originalPrice: orig,
      savings,
      savingsAmount: savings,
      discountPercentage: Math.round(discRate * 100),
      discountPercent: Math.round(discRate * 100),
      tierDiscountRate: Math.round(discRate * 100),
      totalWeightGrams: weightGrams,
      totalWeightFormatted: weightFormatted,
      isAvailable,
      components: updatedComponents,
    }
  },

  async getFinderConfig(activity?: string): Promise<FinderQuestion[]> {
    if (activity) {
      // Reserved for activity-specific filtering when backend is integrated
    }
    return FINDER_QUESTIONS
  },

  async getFinderQuestions(): Promise<FinderQuestion[]> {
    return FINDER_QUESTIONS
  },

  recentRecommendations: {} as Record<string, FinderRecommendations>,

  async getFinderRecommendationsById(id: string): Promise<FinderRecommendations> {
    const found = this.recentRecommendations[id]
    if (found) return found

    // Fallback recommendation session
    const fallback = await this.submitFinderAnswers({})
    fallback.id = id
    this.recentRecommendations[id] = fallback
    return fallback
  },

  async submitFinderAnswers(answers: Record<string, unknown>): Promise<FinderRecommendations> {
    const act = (answers['activity_terrain'] as string) || 'weekend_trek'
    const duration = Number(answers['duration_days']) || 2
    const group = Number(answers['group_size']) || 2
    const climate = (answers['climate_temp'] as string) || 'mild_temperate'
    const priority = (answers['carry_priority'] as string) || 'comfort'
    const needCooking = answers['need_cooking'] !== false

    // Select suitable products for slots
    const packs = allProducts.filter((p) => p.category.id === 'backpacks' && p.stockStatus !== 'outofstock')
    const tents = allProducts.filter((p) => p.category.id === 'camping-tents' && p.stockStatus !== 'outofstock')
    const sleepGears = allProducts.filter((p) => p.stockStatus !== 'outofstock' && (p.name.includes('ngủ') || p.name.includes('đệm') || p.category.id === 'cooking-tools'))
    const cookGears = allProducts.filter((p) => p.category.id === 'cooking-tools' && p.stockStatus !== 'outofstock')
    const accessories = allProducts.filter((p) => p.category.id === 'equipment-accessories' && p.stockStatus !== 'outofstock')

    const pack = (priority === 'ultralight' ? packs.find((p) => p.weightGrams < 900) : packs.find((p) => p.price > 1000000)) || packs[0] || allProducts[0]
    const shelter = tents[0] || allProducts[1]
    const sleep = sleepGears[0] || allProducts[2]
    const cook = cookGears[0] || allProducts[3]
    const safety = accessories[0] || allProducts[4]

    let packVolume = '45L – 55L'
    if (act === 'day_hike') packVolume = '20L – 25L'
    else if (act === 'trail_run') packVolume = '12L – 18L'
    else if (priority === 'ultralight') packVolume = '35L – 45L Siêu nhẹ'

    let weatherFit = 'Kháng mưa & ẩm ướt tốt (PU 3000mm)'
    if (climate === 'dry_hot') weatherFit = 'Thoát nhiệt UV50+ chuyên sâu'
    else if (climate === 'cold_alpine') weatherFit = 'Cách nhiệt chống rét dưới 10°C'

    const totalWeight =
      (pack.weightGrams || 1100) +
      (shelter.weightGrams || 1600) +
      (sleep.weightGrams || 650) +
      (needCooking ? (cook.weightGrams || 450) : 0) +
      (safety.weightGrams || 200)

    const totalWeightFormatted = totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(1)}kg` : `${totalWeight}g`

    const actLabels: Record<string, string> = {
      day_hike: 'Đi trong ngày (Day Hike)',
      weekend_trek: 'Leo núi qua đêm (Weekend Trek)',
      basecamp: 'Cắm trại gia đình (Basecamp)',
      trail_run: 'Chạy Trail & Fastpacking',
    }
    const climateLabels: Record<string, string> = {
      dry_hot: 'Mùa khô nắng nóng',
      mild_temperate: 'Ôn đới mát mẻ',
      rainy_humid: 'Rừng mưa ẩm ướt',
      cold_alpine: 'Rét lạnh núi cao',
    }

    const actLabel = actLabels[act] || 'Trekking dã ngoại'
    const climateLabel = climateLabels[climate] || 'Khí hậu tiêu chuẩn'

    const rationale = `Thuật toán định vị trang bị đã cấu hình hệ thống The Big Three phù hợp với địa hình ${actLabel}, thời lượng ${duration} ngày, nhóm ${group} người, thời tiết ${climateLabel} và phong cách ${priority === 'ultralight' ? 'tối giản siêu nhẹ' : 'tiện nghi bền bỉ'}. Tổng tải trọng thiết yếu kiểm soát ở mức ${totalWeightFormatted}.`

    const userChoices = [
      { label: 'Cung đường', valueText: actLabel, questionId: 'activity_terrain' },
      { label: 'Thời lượng', valueText: `${duration} ngày`, questionId: 'duration_days' },
      { label: 'Nhóm', valueText: `${group} người`, questionId: 'group_size' },
      { label: 'Thời tiết', valueText: climateLabel, questionId: 'climate_temp' },
      { label: 'Nấu nướng', valueText: needCooking ? 'Có nấu tại bãi trại' : 'Không nấu nướng', questionId: 'need_cooking' },
      { label: 'Phong cách', valueText: priority === 'ultralight' ? 'Siêu nhẹ (Ultralight)' : 'Tiện nghi (Comfort)', questionId: 'carry_priority' },
    ]

    const recommendedProducts: FinderRecommendedProduct[] = [
      {
        slotId: 'pack',
        slotName: '1. Balo Chuyên Dụng (The Pack)',
        product: pack,
        reasons: ['Hệ thống khung trợ lực thoáng khí', `Thể tích ${packVolume} tối ưu cho hành trình ${duration} ngày`],
        reasonTags: ['Khung trợ lực', `Thể tích ${packVolume}`, 'Vải chống rách'],
        reasonText: `Balo kỹ thuật đáp ứng hoàn hảo cơ số đồ và trọng lượng cho chuyến đi ${duration} ngày.`,
      },
      {
        slotId: 'shelter',
        slotName: '2. Nơi Trú Ẩn & Lều Trại (The Shelter)',
        product: shelter,
        reasons: ['Chống mưa PU 3000mm tiêu chuẩn', 'Khung nhôm dã ngoại chịu gió giật cấp 6'],
        reasonTags: ['Chống thấm PU 3000mm', 'Khung nhôm bền', 'Dựng nhanh 10p'],
        reasonText: 'Đảm bảo không gian khô ráo, an toàn trước những cơn mưa rừng nhiệt đới bất chợt.',
      },
      {
        slotId: 'sleep',
        slotName: '3. Giấc Ngủ & Đệm Cách Nhiệt (The Sleep System)',
        product: sleep,
        reasons: ['Cách nhiệt ngăn hơi lạnh bốc từ mặt đất', 'Đệm êm giúp phục hồi cơ bắp tối đa'],
        reasonTags: ['Cách nhiệt R-value', 'Gấp gọn nhẹ', 'Chống ẩm mốc'],
        reasonText: 'Giúp duy trì thân nhiệt ổn định và giấc ngủ sâu hồi phục thể lực sau ngày leo dốc.',
      },
      {
        slotId: 'cook',
        slotName: '4. Bếp & Ẩm Thực (The Cook System)',
        product: cook,
        reasons: ['Bếp chân nhện chịu tải nồi tốt', 'Đánh lửa cơ học an toàn tiện lợi'],
        reasonTags: ['Chống gió tốt', 'Siêu gọn nhẹ', 'Đánh lửa nhạy'],
        reasonText: 'Cung cấp bữa ăn nóng sốt và nước uống ấm giữa thiên nhiên hoang dã.',
      },
      {
        slotId: 'safety',
        slotName: '5. Phụ Kiện & An Toàn (The Safety & Essentials)',
        product: safety,
        reasons: ['Chiếu sáng dẫn đường ban đêm an toàn', 'Chống nước IPX4 hoạt động tốt dưới mưa'],
        reasonTags: ['Chống nước IPX4', 'Pin bền bỉ', 'Trọng lượng nhẹ'],
        reasonText: 'Trang bị an toàn thiết yếu không thể thiếu cho mọi tình huống di chuyển ban đêm.',
      },
    ]

    const relevantBundles = PRESET_BUNDLES.slice(0, 3).map((b) => ({
      ...b,
      reasons: ['Đồng bộ trọng lượng', `Tiết kiệm ${b.discountPercent}% trọn bộ`, 'Đã kiểm nghiệm tương thích'],
      reasonTags: [`Tiết kiệm ${b.discountPercent}%`, 'Đồng bộ trọng lượng', 'Đầy đủ 5 món'],
      reasonText: `Gói trang bị trọn bộ được chuyên gia tuyển chọn cho chuyến đi ${actLabel}. Mua cả bộ giúp tiết kiệm đáng kể so với mua lẻ.`,
    }))

    const id = `REC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    const rec: FinderRecommendations = {
      id,
      summary: {
        packVolume,
        totalEstimatedWeightGrams: totalWeight,
        totalEstimatedWeightFormatted: totalWeightFormatted,
        weatherFit,
        rationale,
        userChoices,
      },
      products: recommendedProducts,
      bundles: relevantBundles,
    }

    this.recentRecommendations[id] = rec
    return rec
  },

  calculateCartTotals(items: CartItem[]): Cart {
    const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0)
    const isFreeShipping = subtotal >= SITE_LEGAL.freeShippingThreshold
    const shipping = subtotal === 0 ? 0 : isFreeShipping ? 0 : SITE_LEGAL.flatShippingFee
    const total = subtotal + shipping
    const vatAmount = Math.round((subtotal * SITE_LEGAL.vatRate) / (1 + SITE_LEGAL.vatRate))
    const amountForFreeShipping = Math.max(0, SITE_LEGAL.freeShippingThreshold - subtotal)

    return {
      id: 'cart-session-active',
      items,
      subtotal,
      shipping,
      total,
      freeShippingThreshold: SITE_LEGAL.freeShippingThreshold,
      isFreeShipping,
      amountForFreeShipping,
      vatAmount,
    }
  },

  async getShippingOptions(subtotal: number): Promise<ShippingOption[]> {
    const isFree = subtotal >= SITE_LEGAL.freeShippingThreshold
    return [
      {
        id: 'standard',
        name: 'Giao Tiêu Chuẩn Toàn Quốc',
        description: 'Vận chuyển liên tỉnh 2 - 4 ngày làm việc',
        price: isFree ? 0 : SITE_LEGAL.flatShippingFee,
        estimatedDelivery: '2 - 4 ngày làm việc',
      },
      {
        id: 'express',
        name: 'Giao Hỏa Tốc 2H Nội Thành',
        description: 'Áp dụng cho đơn hàng nội thành Hà Nội & TP.HCM',
        price: 55000,
        estimatedDelivery: 'Nhận hàng trong 2 giờ',
      },
    ]
  },

  calculateCheckoutTotals(cart: Cart, shippingMethodId: 'standard' | 'express' = 'standard'): CheckoutTotals {
    const isFree = cart.subtotal >= SITE_LEGAL.freeShippingThreshold
    const shippingFee = shippingMethodId === 'express' ? 55000 : isFree ? 0 : SITE_LEGAL.flatShippingFee
    const discountTotal = cart.bundleDiscount ?? 0
    const total = cart.subtotal - discountTotal + shippingFee
    const vatAmount = Math.round((total * SITE_LEGAL.vatRate) / (1 + SITE_LEGAL.vatRate))

    return {
      subtotal: cart.subtotal,
      discountTotal,
      shippingTotal: shippingFee,
      total,
      vatAmount,
    }
  },

  recentOrders: [] as Order[],

  async getOrder(id: string): Promise<Order | null> {
    const found = this.recentOrders.find((o) => o.id === id)
    if (found) return found
    return null
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const d = new Date()
    const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    const randomHex = Math.random().toString(36).slice(2, 6).toUpperCase()
    const id = `PG-${ymd}-${randomHex}`

    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: d.toISOString(),
      status: 'confirmed',
    }
    this.recentOrders.push(newOrder)
    return newOrder
  },
}
