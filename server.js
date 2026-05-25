import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  next();
});

function getCategories() {
  const apiDir = path.join(__dirname, 'api');
  const categories = {};

  if (!fs.existsSync(apiDir)) return categories;

  const dirs = fs.readdirSync(apiDir, { withFileTypes: true });

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;

    const catName = dir.name;
    const catPath = path.join(apiDir, catName);
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));

    if (files.length > 0) {
      categories[catName] = {
        name: catName.charAt(0).toUpperCase() + catName.slice(1),
        desc: catName.charAt(0).toUpperCase() + catName.slice(1) + ' APIs',
        endpoints: files.map(f => f.replace('.js', ''))
      };
    }
  }

  return categories;
}

app.get('/api/categories', (req, res) => {
  const cats = getCategories();
  const result = Object.keys(cats).map(k => ({
    slug: k,
    name: cats[k].name,
    desc: cats[k].desc,
    count: cats[k].endpoints.length
  }));
  res.json({status: true, categories: result});
});

app.get('/api/endpoints', (req, res) => {
  const { category } = req.query;
  const cats = getCategories();

  if (!cats[category]) return res.status(404).json({status: false, error: 'Category not found'});

  const endpoints = cats[category].endpoints.map(name => ({
    method: 'GET',
    path: `/api/${category}/${name}`,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    desc: `Use ${name} API`,
    params: [{name: 'text', required: false, desc: 'Input text'}]
  }));

  res.json({status: true, category: cats[category].name, endpoints});
});

app.get('/api/:category/:endpoint', async (req, res) => {
  const { category, endpoint } = req.params;
  const filePath = path.join(__dirname, 'api', category, `${endpoint}.js`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({status: false, error: 'Endpoint not found'});
  }

  try {
    const module = await import(filePath);
    await module.default(req, res);
  } catch (e) {
    res.status(500).json({status: false, error: e.message});
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
