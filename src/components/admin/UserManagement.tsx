import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Shield, 
  Mail, 
  Building,
  Edit2,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { usersApi, adminApi } from '../../utils/supabase/client';
import { LoadingSpinner } from '../SystemStates';
import { toast } from 'sonner';

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Try to fetch real users
      try {
        const response = await usersApi.getAll();
        if (response && response.users) {
          setUsers(response.users);
        } else {
           // Fallback mock data
          throw new Error('No users returned');
        }
      } catch (e) {
        // Fallback mock data
        setUsers([
          { id: '1', name: 'Kevin H', email: 'kevinh@buboiq.com', role: 'owner', org: 'BuboIQ', status: 'active', lastActive: 'Just now' },
          { id: '2', name: 'Sarah Connor', email: 'sarah@techcorp.com', role: 'admin', org: 'TechCorp', status: 'active', lastActive: '2 hours ago' },
          { id: '3', name: 'John Doe', email: 'john@acme.com', role: 'tech', org: 'Acme Inc', status: 'active', lastActive: '1 day ago' },
          { id: '4', name: 'Alice Smith', email: 'alice@wonderland.com', role: 'viewer', org: 'Wonderland', status: 'inactive', lastActive: '5 days ago' },
        ]);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.org && user.org.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
      case 'super_admin':
        return <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">Owner</Badge>;
      case 'admin':
        return <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">Admin</Badge>;
      case 'tech':
        return <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">Tech</Badge>;
      default:
        return <Badge variant="outline" className="text-mist-gray border-slate-gray">User</Badge>;
    }
  };

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mist-gray" />
          <Input 
            placeholder="Search users..." 
            className="pl-10 bg-nocturne-indigo/30 border-slate-gray/30 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="bubo-btn-neon-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="rounded-xl border border-slate-gray/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-nocturne-indigo/50">
            <TableRow className="border-slate-gray/30 hover:bg-transparent">
              <TableHead className="text-mist-gray">User</TableHead>
              <TableHead className="text-mist-gray">Role</TableHead>
              <TableHead className="text-mist-gray">Organization</TableHead>
              <TableHead className="text-mist-gray">Status</TableHead>
              <TableHead className="text-mist-gray text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-slate-gray/30 hover:bg-slate-gray/10">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 bg-slate-gray/30">
                      <AvatarFallback className="text-xs">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : (user.email ? user.email.substring(0, 2).toUpperCase() : 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">{user.name || user.email || 'Unknown User'}</div>
                      <div className="text-xs text-mist-gray flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-mist-gray">
                    <Building className="w-3 h-3 mr-1.5" />
                    {user.org || 'Default'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-iq-neon-green' : 'bg-slate-gray'}`} />
                    <span className="text-sm text-white capitalize">{user.status}</span>
                  </div>
                  <div className="text-xs text-mist-gray mt-0.5">{user.lastActive}</div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-mist-gray hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-dark-midnight border-slate-gray/30 text-white">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="hover:bg-slate-gray/20 cursor-pointer">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-gray/20 cursor-pointer">
                        <Shield className="w-4 h-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-gray/30" />
                      <DropdownMenuItem className="text-crimson-danger hover:bg-crimson-danger/10 cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-mist-gray">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
