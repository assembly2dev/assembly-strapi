import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

type Product = {
  id: number;
  slug: string;
  title: string;
  sku: string;
  category: string;
  instructor: string;
  price: number;
  salePrice: number | null;
  status: 'Published' | 'Draft' | 'Archived' | string;
  stock: 'In stock' | 'Limited stock' | 'Out of stock' | string;
  stockQuantity: number;
  students: number;
  type: 'Course' | 'Book' | 'Event' | 'Webinar' | 'Masterclass' | 'Workshop' | string;
  image: string; // path like "/making-the-right-move.jpg"
  datePublished: string; // e.g. "2023-05-15"
  virtual: boolean;
  downloadable: boolean;
};

const products: Product[] = [
  {
    id: 1,
    slug: 'making-the-right-move',
    title: 'Making The Right Move',
    sku: 'COURSE-001',
    category: 'HDB Investment',
    instructor: 'George Peng',
    price: 149.99,
    salePrice: 129.99,
    status: 'Published',
    stock: 'In stock',
    stockQuantity: 116,
    students: 245,
    type: 'Course',
    image: '/making-the-right-move.jpg',
    datePublished: '2023-05-15',
    virtual: true,
    downloadable: false,
  },
  {
    id: 2,
    slug: 'property-summit-2024',
    title: 'Property Summit 2024',
    sku: 'EVENT-001',
    category: 'Market Analysis',
    instructor: 'Adrian Lim',
    price: 299.99,
    salePrice: null,
    status: 'Published',
    stock: 'Limited stock',
    stockQuantity: 25,
    students: 89,
    type: 'Event',
    image: '/property-summit-2024.jpg',
    datePublished: '2023-06-22',
    virtual: false,
    downloadable: true,
  },
  {
    id: 3,
    slug: 'property-investment-book',
    title: 'Property Investment Guide - Physical Book',
    sku: 'BOOK-001',
    category: 'Investment Strategy',
    instructor: 'Beatrice Lim',
    price: 39.99,
    salePrice: 29.99,
    status: 'Published',
    stock: 'In stock',
    stockQuantity: 500,
    students: 0,
    type: 'Book',
    image: '/property-investment-book.jpg',
    datePublished: '2023-07-10',
    virtual: false,
    downloadable: false,
  },
  {
    id: 4,
    slug: 'module-1-of-niche-positioning-masterclass',
    title: 'Module 1 of Niche Positioning Masterclass',
    sku: 'COURSE-002',
    category: 'Strategic Investment',
    instructor: 'Marc Chan',
    price: 199.99,
    salePrice: null,
    status: 'Draft',
    stock: 'Out of stock',
    stockQuantity: 0,
    students: 132,
    type: 'Course',
    image: '/module-1-of-niche-positioning-masterclass.jpg',
    datePublished: '2023-04-30',
    virtual: true,
    downloadable: true,
  },
  {
    id: 5,
    slug: 'webinar-market-trends',
    title: 'Live Webinar: Market Trends 2024',
    sku: 'WEBINAR-001',
    category: 'Market Analysis',
    instructor: 'Shawn Tay',
    price: 0,
    salePrice: null,
    status: 'Published',
    stock: 'In stock',
    stockQuantity: 1000,
    students: 456,
    type: 'Webinar',
    image: '/webinar-market-trends.jpg',
    datePublished: '2023-08-05',
    virtual: true,
    downloadable: false,
  },
];

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_EMAIL = process.env.STRAPI_EMAIL || '';
const STRAPI_PASSWORD = process.env.STRAPI_PASSWORD || '';

async function login(): Promise<string> {
  if (!STRAPI_EMAIL || !STRAPI_PASSWORD) {
    throw new Error('Set STRAPI_EMAIL and STRAPI_PASSWORD env vars to login.');
  }
  const res = await axios.post(`${STRAPI_URL}/api/auth/local`, {
    identifier: STRAPI_EMAIL,
    password: STRAPI_PASSWORD,
  });
  return res.data.jwt as string;
}

async function ensureInstructor(name: string, token: string): Promise<number> {
  // Try exact name match
  const search = await axios.get(
    `${STRAPI_URL}/api/instructors`,
    {
      params: { 'filters[name][$eq]': name, 'pagination[pageSize]': 1 },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const existing = search.data?.data?.[0];
  if (existing) return existing.id;

  // Create if not found
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const created = await axios.post(
    `${STRAPI_URL}/api/instructors`,
    {
      data: {
        name,
        slug,
        role: 'Instructor',
        bio: `${name} (auto-created)`,
        specialty: 'General',
        experience: 'N/A',
        showOnFacilitatorsPage: false,
      },
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return created.data.data.id as number;
}

async function uploadImage(preferredPath: string, token: string): Promise<number> {
  // Normalize and search for image in a few common places
  const clean = preferredPath.startsWith('/') ? preferredPath.slice(1) : preferredPath;
  const candidates = [
    path.resolve(process.cwd(), 'public', clean),
    path.resolve(process.cwd(), 'public', 'uploads', path.basename(clean)),
    path.resolve(process.cwd(), clean),
  ];

  let filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    filePath = path.resolve(process.cwd(), 'favicon.png');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fallback image not found at ${filePath}`);
    }
  }

  const form = new FormData();
  form.append('files', fs.createReadStream(filePath));

  const res = await axios.post(`${STRAPI_URL}/api/upload`, form, {
    headers: {
      ...(form as any).getHeaders(),
      Authorization: `Bearer ${token}`,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  const uploaded = res.data?.[0];
  if (!uploaded?.id) throw new Error('Upload failed: no file id returned');
  return uploaded.id as number;
}

async function createCourseFromProduct(product: Product, token: string, instructorId: number, imageId: number) {
  const description = `Auto-imported placeholder for ${product.title}.`;
  const shortDescription = `Imported ${product.type} in category ${product.category}.`;

  const payload = {
    data: {
      title: product.title,
      slug: product.slug,
      description,
      shortDescription,
      sku: product.sku,
      price: product.price,
      salePrice: product.salePrice,
      status: product.status,
      type: product.type,
      category: product.category,
      categories: [product.category],
      level: 'All Levels',
      duration: 'Self-paced',
      totalHours: null,
      image: imageId,
      featured: false,
      virtual: product.virtual,
      downloadable: product.downloadable,
      stock: product.stock,
      stockQuantity: product.stockQuantity,
      students: product.students,
      rating: 0,
      reviewCount: 0,
      tags: [],
      instructors: [instructorId],
      highlights: [],
      requirements: [],
      targetAudience: [],
      whatYouWillLearn: [],
      previewUrl: null,
      datePublished: new Date(product.datePublished).toISOString(),
    },
  };

  await axios.post(`${STRAPI_URL}/api/courses`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function main() {
  try {
    const token = await login();

    for (const p of products) {
      try {
        const instructorId = await ensureInstructor(p.instructor, token);
        const imageId = await uploadImage(p.image, token);
        await createCourseFromProduct(p, token, instructorId, imageId);
        // eslint-disable-next-line no-console
        console.log(`✅ Imported: ${p.title}`);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(`❌ Failed to import ${p.title}:`, e?.response?.data || e?.message || e);
      }
    }

    // eslint-disable-next-line no-console
    console.log('🎉 Import completed');
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('Import aborted:', e?.response?.data || e?.message || e);
    process.exit(1);
  }
}

// Execute when run directly
if (require.main === module) {
  main();
}


