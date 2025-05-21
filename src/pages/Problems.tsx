import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search,
  Filter,
  ArrowDownUp, 
  LayoutGrid, 
  List as ListIcon,
  Terminal,
  X,
  Globe,
  Code2,
  Database,
  Laptop
} from 'lucide-react';
import { useEvolution } from '../context/EvolutionContext';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { ProblemCard } from '../components/evolution/ProblemCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { problems } = useEvolution();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'type'>('newest');
  
  // Extract all unique tags
  const allTags = Array.from(
    new Set(problems.flatMap(problem => problem.tags))
  ).sort();
  
  // Project types
  const projectTypes = [
    'Web Application',
    'API Service',
    'CLI Tool',
    'Machine Learning',
    'Database',
    'Mobile App',
    'Desktop App'
  ];
  
  // Filter problems based on search, tags, and type
  const filteredProjects = problems.filter(project => {
    const matchesSearch = 
      searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every(tag => project.tags.includes(tag));
    
    const matchesType = 
      !selectedType || 
      project.type === selectedType;
    
    return matchesSearch && matchesTags && matchesType;
  });
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });
  
  // Example projects
  const exampleProjects = [
    {
      title: "Next.js E-commerce",
      description: "A modern e-commerce platform built with Next.js, Tailwind CSS, and Stripe integration",
      type: "Web Application",
      tags: ["next.js", "react", "typescript", "stripe"],
      icon: Globe
    },
    {
      title: "FastAPI Backend",
      description: "RESTful API service with FastAPI, SQLAlchemy, and JWT authentication",
      type: "API Service",
      tags: ["python", "fastapi", "postgresql"],
      icon: Code2
    },
    {
      title: "SQLite Query Builder",
      description: "A type-safe SQLite query builder with migrations and schema management",
      type: "Database",
      tags: ["typescript", "sqlite", "orm"],
      icon: Database
    },
    {
      title: "Electron Desktop App",
      description: "Cross-platform desktop application with Electron and React",
      type: "Desktop App",
      tags: ["electron", "react", "typescript"],
      icon: Laptop
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <Header 
        title="Projects"
        subtitle="Evolve and enhance your projects"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => navigate('/import')}
              className="mr-2"
            >
              Import Project
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => { /* Open create project modal */ }}
            >
              New Project
            </Button>
          </>
        }
      />
      
      <div className="p-6">
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" size={16} />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-md overflow-hidden">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <ListIcon size={18} />
                </button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Filter size={14} />}
              >
                Filter
              </Button>
              
              <select
                className="input text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="type">Project Type</option>
              </select>
            </div>
          </div>
          
          {(selectedTags.length > 0 || selectedType) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-foreground/70">Filters:</span>
              
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                >
                  {tag}
                  <X size={12} />
                </Badge>
              ))}
              
              {selectedType && (
                <Badge
                  variant="primary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setSelectedType(null)}
                >
                  {selectedType}
                  <X size={12} />
                </Badge>
              )}
              
              <button
                className="text-xs text-primary-600 hover:text-primary-700"
                onClick={() => {
                  setSelectedTags([]);
                  setSelectedType(null);
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </Card>
        
        {/* Filter sidebar for larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 hidden md:block">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Project Type</h4>
                <div className="space-y-2">
                  {projectTypes.map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`type-${type}`}
                        name="type"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(
                          selectedType === type ? null : type
                        )}
                        className="mr-2"
                      />
                      <label htmlFor={`type-${type}`} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Technologies</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allTags.map(tag => (
                    <div key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onChange={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(prev => prev.filter(t => t !== tag));
                          } else {
                            setSelectedTags(prev => [...prev, tag]);
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`tag-${tag}`} className="text-sm">
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {sortedProjects.length > 0 ? (
              viewMode === 'grid' ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {sortedProjects.map(project => (
                    <motion.div key={project.id} variants={itemVariants}>
                      <ProblemCard 
                        problem={project} 
                        onClick={() => navigate(`/lab/${project.id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {sortedProjects.map(project => (
                    <motion.div key={project.id} variants={itemVariants}>
                      <Card 
                        variant="interactive" 
                        className="flex flex-col sm:flex-row sm:items-center gap-4"
                        onClick={() => navigate(`/lab/${project.id}`)}
                      >
                        <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-md">
                          <Terminal size={24} className="text-primary-700 dark:text-primary-400" />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{project.title}</h3>
                            <Badge 
                              variant="primary"
                              size="sm"
                            >
                              {project.type}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-foreground/70 mb-2 line-clamp-1">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" size="sm">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 3 && (
                              <Badge variant="secondary" size="sm">
                                +{project.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-foreground/70 self-start sm:self-center mt-2 sm:mt-0">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : (
              <Card className="text-center py-12">
                <p className="text-foreground/70 mb-6">
                  {searchTerm || selectedTags.length > 0 || selectedType
                    ? 'No projects match your filters'
                    : 'No projects yet. Get started by importing a project or creating a new one!'}
                </p>
                
                {!(searchTerm || selectedTags.length > 0 || selectedType) && (
                  <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <Card className="bg-primary-50/50 dark:bg-primary-900/20 p-6 text-left">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <Plus size={20} className="mr-2 text-primary-600" />
                          Create New Project
                        </h3>
                        <p className="text-sm text-foreground/70 mb-4">
                          Start from scratch with a new project template
                        </p>
                        <Button 
                          variant="primary"
                          leftIcon={<Plus size={16} />}
                          onClick={() => { /* Open create project modal */ }}
                        >
                          Create Project
                        </Button>
                      </Card>
                      
                      <Card className="bg-secondary-50/50 dark:bg-secondary-900/20 p-6 text-left">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <FolderGit2 size={20} className="mr-2 text-secondary-600" />
                          Import Existing Project
                        </h3>
                        <p className="text-sm text-foreground/70 mb-4">
                          Import from GitHub or your local machine
                        </p>
                        <Button 
                          variant="secondary"
                          leftIcon={<FolderGit2 size={16} />}
                          onClick={() => navigate('/import')}
                        >
                          Import Project
                        </Button>
                      </Card>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">Example Projects</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {exampleProjects.map((project, index) => (
                        <Card 
                          key={index}
                          variant="interactive"
                          className="p-4"
                          onClick={() => { /* Clone example project */ }}
                        >
                          <div className="flex items-start">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-md mr-3">
                              <project.icon size={20} className="text-primary-700 dark:text-primary-400" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">{project.title}</h4>
                              <p className="text-sm text-foreground/70 mb-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="primary" size="sm">
                                  {project.type}
                                </Badge>
                                {project.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" size="sm">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;