
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getTaskById, getProjectById, users } from "../data/mockData";
import {
  ArrowLeft, MessageSquare, Paperclip, Calendar, Check, X,
  AlignLeft, Edit, MoreHorizontal, Trash2, Share
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import Avatar from "../components/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const task = getTaskById(id || "");
  const project = task ? getProjectById(task.projectId) : null;

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [newComment, setNewComment] = useState("");

  if (!task || !project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Task not found</p>
      </div>
    );
  }

  const handleSaveDescription = () => {
    setIsEditingDescription(false);
    toast({
      title: "Description updated",
      description: "The task description has been updated.",
    });
    // In a real app, we would save the description to the server here
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    toast({
      title: "Status updated",
      description: `Task status changed to ${value}.`,
    });
    // In a real app, we would save the status to the server here
  };

  const handleAssigneeChange = (value: string) => {
    setAssigneeId(value);
    const newAssignee = users.find(user => user.id === value);
    toast({
      title: "Assignee updated",
      description: `Task assigned to ${newAssignee?.name}.`,
    });
    // In a real app, we would save the assignee to the server here
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    toast({
      title: "Comment added",
      description: "Your comment has been added to the task.",
    });
    setNewComment("");
    // In a real app, we would save the comment to the server here
  };

  return (
    <>
      <Helmet>
        <title>{task.title} | NexTechVision</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to project
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
                <span className="px-2 py-1 text-xs font-medium bg-secondary rounded-md">
                  {project.key}-{task.id.split("-")[1]}
                </span>
              </div>
              <p className="text-muted-foreground">
                Created on {format(new Date(task.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit task
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center">
                  <AlignLeft className="h-5 w-5 mr-2" />
                  Description
                </h3>
                {!isEditingDescription && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditingDescription ? (
                <div className="space-y-4">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Describe the task..."
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDescription(task.description);
                        setIsEditingDescription(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveDescription}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground whitespace-pre-line">
                  {task.description}
                </p>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Comments
                </h3>
              </div>

              <div className="space-y-4">
                {task.comments.length > 0 ? (
                  <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar user={comment.user} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{comment.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                            </p>
                          </div>
                          <p className="mt-1 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No comments yet
                  </p>
                )}

                <Separator />

                <div className="flex gap-4">
                  <Avatar user={users[0]} size="sm" />
                  <div className="flex-1 space-y-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment}>Add Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-medium mb-4">Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue>{status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Assignee</p>
                  <Select value={assigneeId} onValueChange={handleAssigneeChange}>
                    <SelectTrigger>
                      <SelectValue>
                        {assigneeId ? users.find(u => u.id === assigneeId)?.name || "Unassigned" : "Unassigned"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <PriorityBadge priority={task.priority} />
                </div>
                
                {task.dueDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(new Date(task.dueDate), "MMMM d, yyyy")}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center">
                  <Paperclip className="h-5 w-5 mr-2" />
                  Attachments
                </h3>
                <Button variant="outline" size="sm">
                  Add Files
                </Button>
              </div>
              
              {task.attachments.length > 0 ? (
                <div className="space-y-3">
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded mr-3">
                          <Paperclip className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(attachment.size / 1024).toFixed(0)} KB • Uploaded by {users.find(u => u.id === attachment.uploadedBy)?.name}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No attachments yet
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetail;
