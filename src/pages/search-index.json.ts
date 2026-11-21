import type { APIRoute } from 'astro';
import {
  getAllProducts,
  getMainNews,
  getAllAnli,
  getAllFaq,
  getProductUrl,
  getNewsUrl,
  getAnliUrl,
  getFaqUrl,
} from '../utils/content';

export const GET: APIRoute = async () => {
  const [products, news, anli, faq] = await Promise.all([
    getAllProducts(),
    getMainNews(),
    getAllAnli(),
    getAllFaq(),
  ]);

  const records = [
    ...products.map((p) => ({
      type: 'product',
      typeLabel: p.data.categoryName || '产品',
      title: p.data.title,
      subtitle: [p.data.model, p.data.tagline, p.data.specs.size].filter(Boolean).join(' · '),
      text: `${p.data.title} ${p.data.model} ${p.data.categoryName} ${p.data.tagline} ${p.data.keywords} ${p.data.description} ${p.data.specs.size} ${p.data.specs.surface} ${p.data.specs.colorText}`,
      cover: p.data.cover || '/images/logo.png',
      url: getProductUrl(p),
    })),
    ...news.map((n) => ({
      type: 'news',
      typeLabel: '新闻',
      title: n.data.title,
      subtitle: n.data.excerpt || n.data.description,
      text: `${n.data.title} ${n.data.keywords} ${n.data.description} ${n.data.excerpt}`,
      cover: n.data.cover || '',
      url: getNewsUrl(n),
    })),
    ...anli.map((a) => ({
      type: 'anli',
      typeLabel: '案例',
      title: a.data.title,
      subtitle: a.data.summary || a.data.description,
      text: `${a.data.title} ${a.data.summary} ${a.data.description}`,
      cover: a.data.cover || '',
      url: getAnliUrl(a),
    })),
    ...faq.map((f) => ({
      type: 'faq',
      typeLabel: '问答',
      title: f.data.title,
      subtitle: f.data.excerpt || f.data.description,
      text: `${f.data.title} ${f.data.keywords} ${f.data.description}`,
      cover: f.data.cover || '',
      url: getFaqUrl(f),
    })),
  ];

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};