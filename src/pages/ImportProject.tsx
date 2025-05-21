import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderGit2, Upload, Github, FileCode } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { importFromGitHub, importFromFolder, ProjectFile } from '../utils/projectImport';

const ImportProject: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGitHubImport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const files = await importFromGitHub(githubUrl);
      // Handle the imported files (e.g., store in context, navigate to project setup)
      console.log('Imported files:', files);
      navigate('/projects/setup', { state: { files } });
    } catch (err) {
      setError('Failed to import from GitHub. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFolderImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      try {
        setIsLoading(true);
        setError(null);
        const files = await importFromFolder(event.target.files);
        navigate('/projects/setup', { state: { files } });
      } catch (err) {
        setError('Failed to import files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <>
      <Header 
        title="Import Project"
        subtitle="Import an existing project to evolve"
      />
      
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Github size={20} className="mr-2 text-primary-600" />
              Import from GitHub
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="input"
                />
              </div>
              
              <Button
                variant="primary"
                onClick={handleGitHubImport}
                isLoading={isLoading}
                leftIcon={<Github size={16} />}
              >
                Import from GitHub
              </Button>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FolderGit2 size={20} className="mr-2 text-primary-600" />
              Import from Local Folder
            </h2>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFolderImport}
              webkitdirectory=""
              directory=""
              multiple
              className="hidden"
            />
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="mb-4">
                <Upload size={40} className="mx-auto text-foreground/40" />
              </div>
              
              <p className="text-foreground/70 mb-4">
                Drag and drop your project folder here, or click to select
              </p>
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<FileCode size={16} />}
              >
                Select Folder
              </Button>
            </div>
          </Card>
          
          {error && (
            <div className="mt-4 p-4 bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImportProject;