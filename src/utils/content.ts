import { getCollection, type CollectionEntry } from 'astro:content';

export type ProductEntry = CollectionEntry<'products'>;
export type NewsEntry = CollectionEntry<'news'>;
export type AnliEntry = CollectionEntry<'anli'>;
export type FaqEntry = CollectionEntry<'faq'>;

export function getProductUrl(item: ProductEntry): string {
  return item.data.category === 'other'
    ? `/product/${item.data.slugName}.html`
    : `/product/${item.data.category}/${item.data.slugName}.html`;
}

export function getNewsUrl(item: NewsEntry): string {
  return `/news/${item.data.slugName}.html`;
}

export function getAnliUrl(item: AnliEntry): string {
  return `/anli/${item.data.slugName}.html`;
}

export function getFaqUrl(item: FaqEntry): string {
  return `/faq/${item.data.slugName}.html`;
}

export async function getAllProducts(): Promise<ProductEntry[]> {
  const items = await getCollection('products');
  return items.sort((a, b) => b.data.order - a.data.order);
}

/** 获取全部新闻：优先按发布日期倒序，发新文章只要写最新日期就会自动排第 1 */
export async function getAllNewsRaw(): Promise<NewsEntry[]> {
  const items = await getCollection('news');
  return items.sort(
    (a, b) => b.data.pubDate.localeCompare(a.data.pubDate) || b.data.order - a.data.order
  );
}

/** 获取新闻列表展示数据（自动排除 50_2~50_6 这类文章内部分页碎片） */
export async function getMainNews(): Promise<NewsEntry[]> {
  const all = await getAllNewsRaw();
  return all.filter((item) => !/^\d+_\d+$/.test(item.data.slugName));
}

export async function getAllAnli(): Promise<AnliEntry[]> {
  const items = await getCollection('anli');
  return items.sort((a, b) => b.data.order - a.data.order);
}

export async function getAllFaq(): Promise<FaqEntry[]> {
  const items = await getCollection('faq');
  return items.sort((a, b) => b.data.order - a.data.order);
}

/** 侧边栏“热销商品”：优先显示 Markdown 里标了 hot: true 的产品，不足 6 款用下方默认列表补齐 */
const HOT_SLUGS = ['tance', 'benshizhong', 'tanshizhong', 'stdabolang', 'benpin', 'bensuo'];
export function pickHotProducts(allProducts: ProductEntry[], limit = 6): ProductEntry[] {
  const chosen: ProductEntry[] = allProducts.filter((p) => p.data.hot);
  for (const slug of HOT_SLUGS) {
    if (chosen.length >= limit) break;
    const found = allProducts.find((p) => p.data.slugName === slug);
    if (found && !chosen.includes(found)) chosen.push(found);
  }
  for (const p of allProducts) {
    if (chosen.length >= limit) break;
    if (!chosen.includes(p)) chosen.push(p);
  }
  return chosen.slice(0, limit);
}

/** 产品列表页左侧“商品推荐”（优先还原原站 6 款） */
const FEATURED_SLUGS = ['135', '134', '131', '129', '5mmbenpin', '10mmtanpin'];
export function pickFeaturedProducts(allProducts: ProductEntry[], limit = 6): ProductEntry[] {
  const chosen: ProductEntry[] = [];
  for (const slug of FEATURED_SLUGS) {
    const found = allProducts.find((p) => p.data.slugName === slug);
    if (found) chosen.push(found);
  }
  for (const p of allProducts) {
    if (chosen.length >= limit) break;
    if (!chosen.includes(p)) chosen.push(p);
  }
  return chosen.slice(0, limit);
}

export function formatYearMonth(dateStr: string): string {
  const m = (dateStr || '').match(/(\d{4})-(\d{2})/);
  return m ? `${m[1]}.${m[2]}` : '';
}

export function formatShortDate(dateStr: string): string {
  const m = (dateStr || '').match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : dateStr || '';
}