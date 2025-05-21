import axios from 'axios';
import JSZip from 'jszip';

export interface ProjectFile {
  path: string;
  content: string;
}

export async function importFromGitHub(url: string): Promise<ProjectFile[]> {
  try {
    // Extract owner and repo from GitHub URL
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }
    
    const [_, owner, repo] = match;
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/zipball/main`);
    
    const zip = await JSZip.loadAsync(response.data);
    const files: ProjectFile[] = [];
    
    await Promise.all(
      Object.keys(zip.files).map(async (filename) => {
        const file = zip.files[filename];
        if (!file.dir) {
          const content = await file.async('string');
          files.push({
            path: filename,
            content
          });
        }
      })
    );
    
    return files;
  } catch (error) {
    console.error('Error importing from GitHub:', error);
    throw error;
  }
}

export function projectToPrompt(files: ProjectFile[]): string {
  let prompt = 'Project Structure:\n\n';
  
  // Add file tree
  const fileTree = files.map(file => `- ${file.path}`).join('\n');
  prompt += fileTree + '\n\nFile Contents:\n\n';
  
  // Add file contents
  files.forEach(file => {
    prompt += `${file.path}:\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
  });
  
  return prompt;
}

export async function importFromFolder(files: FileList): Promise<ProjectFile[]> {
  const projectFiles: ProjectFile[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const content = await file.text();
    projectFiles.push({
      path: file.name,
      content
    });
  }
  
  return projectFiles;
}