import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useApp } from '../App';
import Sidebar from './Sidebar';
import { ArrowLeft, MessageSquare, Clock, User, Tag, AlertCircle, Paperclip, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function TicketDetail() {
  const { user, selectedTicket, setCurrentPage, updateTicket, addComment } = useApp();
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  if (!selectedTicket) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No ticket selected</h2>
            <p className="text-gray-600">Please select a ticket to view its details.</p>
            <Button 
              className="mt-4" 
              onClick={() => setCurrentPage('tickets')}
              style={{ backgroundColor: '#00C48C' }}
            >
              View All Tickets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: string) => {
    updateTicket(selectedTicket.id, { status: newStatus as any });
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment(selectedTicket.id, {
      content: newComment,
      author: user!,
      isInternal
    });

    setNewComment('');
    toast.success('Comment added successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage('tickets')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tickets
              </Button>
              <div>
                <h1 className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-500">{selectedTicket.id}</span>
                  {selectedTicket.subject}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Created {formatDate(selectedTicket.createdAt)} by {selectedTicket.createdBy.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={selectedTicket.status} onValueChange={handleStatusUpdate}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ticket Details</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedTicket.subject}</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedTicket.description}</p>
                </div>
                
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attachments
                    </h4>
                    <div className="space-y-2">
                      {selectedTicket.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                          <Paperclip className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-700">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Activity ({selectedTicket.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All Activity</TabsTrigger>
                    <TabsTrigger value="internal">Internal Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4 mt-6">
                    {selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback style={{ backgroundColor: '#00C48C', color: 'white' }}>
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm text-gray-900">
                                {comment.author.name}
                              </span>
                              <div className="flex items-center space-x-2">
                                {comment.isInternal && (
                                  <Badge variant="secondary" className="text-xs">Internal</Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="internal" className="space-y-4 mt-6">
                    {selectedTicket.comments.filter(c => c.isInternal).map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback style={{ backgroundColor: '#00C48C', color: 'white' }}>
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm text-gray-900">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                {/* Add Comment */}
                <div className="mt-6 border-t pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="internal"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="internal" className="text-sm text-gray-700">
                        Internal note (not visible to client)
                      </label>
                    </div>
                    
                    <Textarea
                      placeholder="Add a comment or update..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        style={{ backgroundColor: '#00C48C' }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created by</p>
                    <p className="font-medium">{selectedTicket.createdBy.name}</p>
                  </div>
                </div>

                {selectedTicket.assignedTo && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Assigned to</p>
                      <p className="font-medium">{selectedTicket.assignedTo.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedTicket.category}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last updated</p>
                    <p className="font-medium">{formatDate(selectedTicket.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Escalate Ticket
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Reassign
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Add Attachment
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <span>Close Ticket</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}