import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function updateFile(filePath, replacements) {
    try {
        let content = await fs.readFile(filePath, 'utf-8');
        for (const [search, replace] of replacements) {
            content = content.replace(search, replace);
        }
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`✅ Updated ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`❌ Error updating ${path.basename(filePath)}:`, error);
    }
}

async function setup(newRepoName) {
    if (!newRepoName) {
        console.error('❌ Please provide a repository name as an argument');
        process.exit(1);
    }

    const files = {
        consts: path.join(rootDir, 'src', 'consts.ts'),
        package: path.join(rootDir, 'package.json'),
    };

    // Update consts.ts
    await updateFile(files.consts, [
        [/export const REPO_NAME = '.*?';/, `export const REPO_NAME = '${newRepoName}';`]
    ]);

    // Update package.json
    await updateFile(files.package, [
        [/"name": ".*?"/, `"name": "${newRepoName}"`]
    ]);

    console.log('✨ Setup complete! Your repository has been configured with the new name.');
}

// Get the repository name from command line arguments
const newRepoName = process.argv[2];
setup(newRepoName); 