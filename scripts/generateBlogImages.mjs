import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(arrayBuffer));
}

async function generateImageForPost(title) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a professional, blog header image for an article titled "${title}".The image should show a realistic setting or image of an object that embodies this concept. Use soft colors and minimal text.`,
      n: 1,
      size: "1792x1024",
      quality: "standard",
    });

    return response.data[0].url;
  } catch (error) {
    console.error(`Error generating image for "${title}":`, error);
    return null;
  }
}

async function processPost(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data, content: postContent } = matter(content);
  
  // Skip if the post has an image and it's not a placeholder
  if (data.heroImage && !data.heroImage.toLowerCase().includes('placeholder')) {
    console.log(`Skipping ${filePath} - already has a custom image`);
    return;
  }

  console.log(`Generating image for: ${data.title}`);
  const imageUrl = await generateImageForPost(data.title);
  
  if (!imageUrl) {
    console.log(`Failed to generate image for ${data.title}`);
    return;
  }

  // Create a unique filename based on the post title
  const sanitizedTitle = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const imageFileName = `${sanitizedTitle}-header.jpg`;
  const imagePath = path.join(PUBLIC_DIR, imageFileName);

  // Download the image
  await downloadImage(imageUrl, imagePath);

  // Update the frontmatter
  data.heroImage = `/${imageFileName}`;
  
  // Write the updated content back to the file
  const updatedContent = matter.stringify(postContent, data);
  await fs.writeFile(filePath, updatedContent);

  console.log(`✓ Generated and updated image for: ${data.title}`);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Please set the OPENAI_API_KEY environment variable');
    process.exit(1);
  }

  try {
    const files = await glob('**/*.md', { cwd: BLOG_DIR });
    
    for (const file of files) {
      await processPost(path.join(BLOG_DIR, file));
    }
    
    console.log('Finished processing all blog posts');
  } catch (error) {
    console.error('Error processing blog posts:', error);
    process.exit(1);
  }
}

main(); 