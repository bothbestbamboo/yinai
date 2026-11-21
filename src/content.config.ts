import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    keywords: z.string().default(''),
    description: z.string().default(''),
    category: z.enum(['naiyong', 'naimo', 'naifu', 'naijiu', 'shisu', 'other']),
    categoryName: z.string(),
    slugName: z.string(), // 原文件名（不含 .html），例如 bence、147
    model: z.string().default(''), // 型号，例如 E61036
    tagline: z.string().default(''), // 卖点短语，例如 防水耐磨 不含甲醛
    cover: z.string(),
    gallery: z.array(z.string()).default([]),
    specs: z.object({
      paint: z.string().default(''),      // 油漆
      colorText: z.string().default(''),  // 颜色描述
      surface: z.string().default(''),    // 表面工艺
      eco: z.string().default(''),        // 环保等级
      size: z.string().default(''),       // 单片规格
    }).default({}),
    // 产品筛选 6 大维度
    filters: z.object({
      hd: z.string().default(''), // 厚度: 4mm/5mm/6mm/8mm/9mm/10mm/12mm/14mm/15mm/17mm/20mm/30mm
      yt: z.string().default(''), // 用途: 室内 / 室外
      fg: z.string().default(''), // 风格: 浅色系 / 深色系
      gy: z.string().default(''), // 工艺: 平压 / 侧压 / 重竹 / 石塑
      ys: z.string().default(''), // 颜色: 本色 / 碳化 / 中碳 / 深碳
      wl: z.string().default(''), // 纹理: 细波纹 / 大波浪 / 小沟槽 / 双面平
    }).default({}),
    featured: z.boolean().default(false),
    hot: z.boolean().default(false),
    order: z.number().default(0), // 用于控制列表排序（最新在前）
    pubDate: z.string().default(''),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    keywords: z.string().default(''),
    description: z.string().default(''),
    slugName: z.string(), // 例如 86、20180511
    pubDate: z.string(),
    cover: z.string().default(''),
    excerpt: z.string().default(''),
    order: z.number().default(0),
  }),
});

const anli = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/anli' }),
  schema: z.object({
    title: z.string(),
    keywords: z.string().default(''),
    description: z.string().default(''),
    slugName: z.string(),
    cover: z.string().default(''),
    summary: z.string().default(''),
    pubDate: z.string().default(''),
    order: z.number().default(0),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    title: z.string(),
    keywords: z.string().default(''),
    description: z.string().default(''),
    slugName: z.string(), // beifang, dinuan, shengchong, bianxing
    pubDate: z.string().default(''),
    cover: z.string().default(''),
    excerpt: z.string().default(''),
    order: z.number().default(0),
  }),
});

export const collections = { products, news, anli, faq };