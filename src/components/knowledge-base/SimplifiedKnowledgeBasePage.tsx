import React, { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, Filter, Clock, CheckCircle, ArrowRight, Star, Users, Eye, AlertTriangle, HelpCircle, FileText, Edit } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface SimplifiedKnowledgeBasePageProps {
  user: any;
  onNavigate: (page: string, options?: any) => void;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  problem: string;
  solution: string;
  category: string;
  tags: string[];
  rating: number;
  helpfulCount: number;
  lastUpdated: Date;
  author: string;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  estimatedTime: string;
  isPopular: boolean;
}

// Simple, realistic knowledge base articles
const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Computer running slowly after Windows update',
    problem: 'Computer is much slower than usual, especially when starting up or opening programs.',
    solution: 'Try restarting your computer first. If still slow, check for driver updates in Device Manager, run Disk Cleanup to free up space, and consider rolling back the recent Windows update if the problem started right after it.',
    category: 'Performance',
    tags: ['Windows', 'Slow', 'Update', 'Performance'],
    rating: 4.8,
    helpfulCount: 42,
    lastUpdated: new Date('2024-09-20'),
    author: 'IT Support Team',
    difficulty: 'Easy',
    estimatedTime: '10-15 minutes',
    isPopular: true
  },
  {
    id: '2',
    title: 'Cannot connect to WiFi network',
    problem: 'Unable to connect to office WiFi, getting "Can\'t connect to this network" error.',
    solution: 'First, try forgetting and reconnecting to the network. Go to Settings > Network & Internet > WiFi, click on your network name, select "Forget", then reconnect with the password. If that doesn\'t work, restart your WiFi adapter in Device Manager.',
    category: 'Network',
    tags: ['WiFi', 'Network', 'Connection', 'Internet'],
    rating: 4.6,
    helpfulCount: 38,
    lastUpdated: new Date('2024-09-18'),
    author: 'Network Team',
    difficulty: 'Easy',
    estimatedTime: '5-10 minutes',
    isPopular: true
  },
  {
    id: '3',
    title: 'Printer not responding or printing blank pages',
    problem: 'Office printer shows as online but won\'t print anything, or prints blank pages.',
    solution: 'Check if the printer has paper and ink/toner. Try printing a test page from the printer\'s control panel. If that works, restart the print spooler service on your computer: Press Win+R, type "services.msc", find "Print Spooler", right-click and restart it.',
    category: 'Hardware',
    tags: ['Printer', 'Print', 'Hardware', 'Blank pages'],
    rating: 4.5,
    helpfulCount: 31,
    lastUpdated: new Date('2024-09-15'),
    author: 'Hardware Team',
    difficulty: 'Medium',
    estimatedTime: '15-20 minutes',
    isPopular: false
  },
  {
    id: '4',
    title: 'Outlook email not syncing',
    problem: 'Emails are not showing up in Outlook, or new emails aren\'t being received.',
    solution: 'Check your internet connection first. Then try these steps: 1) Click Send/Receive All Folders, 2) Restart Outlook, 3) Check if you\'re in offline mode (click the Send/Receive tab and make sure "Work Offline" is not selected), 4) Clear your Outlook cache by going to File > Account Settings > Account Settings > Data Files.',
    category: 'Email',
    tags: ['Outlook', 'Email', 'Sync', 'Microsoft'],
    rating: 4.3,
    helpfulCount: 26,
    lastUpdated: new Date('2024-09-12'),
    author: 'Email Support',
    difficulty: 'Medium',
    estimatedTime: '10-25 minutes',
    isPopular: false
  },
  {
    id: '5',
    title: 'Password reset for company accounts',
    problem: 'Forgot password for work computer, email, or other company accounts.',
    solution: 'For your computer login: Contact IT support immediately - we can reset this remotely. For email: Use the "Forgot Password" link on the login page or contact IT. For other company apps: Check if there\'s a "Forgot Password" option, or contact IT support with your employee ID ready.',
    category: 'Account Access',
    tags: ['Password', 'Reset', 'Login', 'Account'],
    rating: 4.9,
    helpfulCount: 67,
    lastUpdated: new Date('2024-09-22'),
    author: 'Security Team',
    difficulty: 'Easy',
    estimatedTime: '5-30 minutes',
    isPopular: true
  },
  {
    id: '6',
    title: 'Software installation requests',
    problem: 'Need to install new software for work but getting permission errors.',
    solution: 'Most software installations require admin rights for security. Submit a software request through our IT portal or email IT support with: 1) The exact software name and version, 2) Business justification for why you need it, 3) Your manager\'s approval if it\'s not on the pre-approved list. We typically process requests within 1-2 business days.',
    category: 'Software',
    tags: ['Software', 'Install', 'Permission', 'Request'],
    rating: 4.4,
    helpfulCount: 23,
    lastUpdated: new Date('2024-09-10'),
    author: 'IT Support Team',
    difficulty: 'Easy',
    estimatedTime: '1-2 business days',
    isPopular: false
  }
];

export const SimplifiedKnowledgeBasePage: React.FC<SimplifiedKnowledgeBasePageProps> = ({ user, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeArticle[]>(knowledgeArticles);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    problem: '',
    solution: '',
    category: '',
    tags: '',
    difficulty: 'Easy' as const
  });

  useEffect(() => {
    let filtered = knowledgeArticles.filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.solution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || article.difficulty === difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort by popularity and rating
    filtered.sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return b.rating - a.rating;
    });

    setFilteredArticles(filtered);
  }, [searchQuery, categoryFilter, difficultyFilter]);

  const categories = ['Performance', 'Network', 'Hardware', 'Email', 'Account Access', 'Software'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      case 'Medium': return 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30';
      case 'Expert': return 'bg-electric-blue/20 text-electric-blue border-electric-blue/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const handleCreateArticle = () => {
    // In a real app, this would save to the database
    console.log('Creating new article:', newArticle);
    setIsCreateModalOpen(false);
    setNewArticle({
      title: '',
      problem: '',
      solution: '',
      category: '',
      tags: '',
      difficulty: 'Easy'
    });
    // Show success message
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h1 className="font-space-grotesk text-3xl text-pure-white mb-1">
                Knowledge
              </h1>
              <p className="text-mist-gray">Find fixes to common problems or share what worked</p>
            </div>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bubo-btn-neon-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add fix
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bubo-glass-bright border border-iq-neon-green/30">
              <DialogHeader>
                <DialogTitle className="text-pure-white font-space-grotesk text-xl">
                  Share a fix
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div>
                  <Label htmlFor="title" className="text-cloud-white mb-2 block">What problem does this solve?</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Computer won't start after power outage"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    className="bg-surface-dark/50 border-slate-gray/30 text-pure-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="problem" className="text-cloud-white mb-2 block">Describe the problem</Label>
                  <Textarea
                    id="problem"
                    placeholder="Explain what symptoms or issues people might experience..."
                    value={newArticle.problem}
                    onChange={(e) => setNewArticle({...newArticle, problem: e.target.value})}
                    className="bg-surface-dark/50 border-slate-gray/30 text-pure-white min-h-20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="solution" className="text-cloud-white mb-2 block">Step-by-step solution</Label>
                  <Textarea
                    id="solution"
                    placeholder="Write clear, step-by-step instructions to solve this problem..."
                    value={newArticle.solution}
                    onChange={(e) => setNewArticle({...newArticle, solution: e.target.value})}
                    className="bg-surface-dark/50 border-slate-gray/30 text-pure-white min-h-32"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-cloud-white mb-2 block">Category</Label>
                    <Select value={newArticle.category} onValueChange={(value) => setNewArticle({...newArticle, category: value})}>
                      <SelectTrigger className="bg-surface-dark/50 border-slate-gray/30">
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty" className="text-cloud-white mb-2 block">Difficulty</Label>
                    <Select value={newArticle.difficulty} onValueChange={(value: any) => setNewArticle({...newArticle, difficulty: value})}>
                      <SelectTrigger className="bg-surface-dark/50 border-slate-gray/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tags" className="text-cloud-white mb-2 block">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., Windows, Power, Hardware"
                    value={newArticle.tags}
                    onChange={(e) => setNewArticle({...newArticle, tags: e.target.value})}
                    className="bg-surface-dark/50 border-slate-gray/30 text-pure-white"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-mist-gray hover:text-pure-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateArticle}
                    className="bubo-btn-neon-primary"
                    disabled={!newArticle.title || !newArticle.problem || !newArticle.solution}
                  >
                    Save Solution
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mist-gray" />
            <Input
              placeholder="Search fixes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 bg-surface-dark/80 border-slate-gray/50 text-pure-white placeholder-mist-gray rounded-xl backdrop-blur-sm focus:border-iq-neon-green/50 transition-all duration-300 text-lg"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                  {filteredArticles.length} found
                </Badge>
              </div>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-mist-gray" />
              <span className="text-mist-gray">Filter by:</span>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-surface-dark/50 border-slate-gray/30">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-40 bg-surface-dark/50 border-slate-gray/30">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            {(categoryFilter !== 'all' || difficultyFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter('all');
                  setDifficultyFilter('all');
                }}
                className="text-mist-gray hover:text-pure-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {filteredArticles.length === 0 ? (
          <Card className="bubo-glass p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-mist-gray/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-mist-gray" />
            </div>
            <h3 className="text-xl text-pure-white mb-2">No fixes found</h3>
            <p className="text-mist-gray mb-6">
              {searchQuery ? 
                `No solutions match "${searchQuery}" with your current filters.` :
                'No solutions match your current filters.'
              }
            </p>
            <div className="flex justify-center gap-3">
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery('')}
                  className="bubo-btn-secondary"
                >
                  Clear Search
                </Button>
              )}
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bubo-btn-neon-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add the First Solution
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Popular Solutions */}
            {!searchQuery && !categoryFilter && filteredArticles.some(a => a.isPopular) && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-signal-yellow" />
                  <h2 className="font-space-grotesk text-xl text-pure-white">Popular Solutions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.filter(article => article.isPopular).slice(0, 3).map((article) => (
                    <Card 
                      key={article.id}
                      className="bubo-glass hover:bubo-glow-green transition-all duration-300 cursor-pointer group"
                      onClick={() => onNavigate('article-detail', { articleId: article.id })}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {article.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-signal-yellow">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm">{article.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-pure-white mb-2 group-hover:text-iq-neon-green transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-mist-gray text-sm mb-4 line-clamp-2">
                          {article.problem}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-mist-gray">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{article.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{article.helpfulCount} helped</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Separator className="my-8 bg-slate-gray/30" />
              </div>
            )}

            {/* All Solutions */}
            <div>
              <h2 className="font-space-grotesk text-xl text-pure-white mb-6">
                {searchQuery ? `Search Results (${filteredArticles.length})` : 'All Solutions'}
              </h2>
              
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card 
                    key={article.id}
                    className="bubo-glass hover:bubo-glow-green transition-all duration-300 cursor-pointer group"
                    onClick={() => onNavigate('article-detail', { articleId: article.id })}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-pure-white group-hover:text-iq-neon-green transition-colors">
                              {article.title}
                            </h3>
                            {article.isPopular && (
                              <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-mist-gray mb-4 leading-relaxed">
                            {article.problem}
                          </p>
                          
                          <div className="flex items-center gap-4 flex-wrap">
                            <Badge className={getDifficultyColor(article.difficulty)}>
                              {article.difficulty}
                            </Badge>
                            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                              {article.category}
                            </Badge>
                            {article.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} className="bg-surface-dark/50 text-cloud-white border-slate-gray/30">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className="flex items-center gap-1 text-signal-yellow mb-2">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{article.rating}</span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-mist-gray">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{article.helpfulCount} helped</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-gray/20">
                        <div className="text-sm text-mist-gray">
                          Updated {article.lastUpdated.toLocaleDateString()} by {article.author}
                        </div>
                        <div className="flex items-center gap-2 text-iq-neon-green opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">Read Solution</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};