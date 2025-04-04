import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getProjectById, tasks } from "../data/mockData";
import TaskCard from "../components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download, Users, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import Layout from "../components/Layout";

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = getProjectById(id || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    projectId: id || "",
    priority: "medium"
  });
  
  const [board, setBoard] = useState(project?.board || {
    columns: {},
    columnOrder: []
  });

  if (!project) {
    return (
      <Layout>
        <div className="p-4 md:p-6 flex items-center justify-center h-full">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </Layout>
    );
  }

  const onDragEnd = (result) => {
    const {
      destination,
      source,
      draggableId
    } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoard(newBoard);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setBoard(newBoard);
  };

  const filteredTasks = (columnId) => {
    const column = board.columns[columnId];
    const taskIds = column.taskIds;

    return taskIds
      .map(taskId => tasks.find(task => task.id === taskId))
      .filter(task => task && task.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(task => task !== undefined);
  };

  const exportData = (format) => {
    let dataStr = "";
    if (format === 'csv') {
      // CSV Export
      dataStr = "Task Id,Title,Status,Assignee\n";
      tasks.forEach(task => {
        dataStr += `${task.id},${task.title},${task.status},${task.assigneeId}\n`;
      });
    } else if (format === 'pdf') {
      // PDF Export (basic - requires a library like jsPDF for real PDF generation)
      dataStr = "PDF Export is not fully implemented in this example.";
    } else if (format === 'xlsx') {
      // XLSX Export (basic - requires a library like SheetJS for real XLSX generation)
      dataStr = "XLSX Export is not fully implemented in this example.";
    }

    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `tasks.${format}`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Missing information",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be an API call to create a task
    toast({
      title: "Task created",
      description: `"${newTask.title}" has been added successfully`
    });
    
    // Reset form and close dialog
    setNewTask({
      title: "",
      description: "",
      projectId: id || "",
      priority: "medium"
    });
    setIsNewTaskDialogOpen(false);
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <Helmet>
          <title>{project.name} | NexTechVision</title>
        </Helmet>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate("/")}
                  className="mr-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                <span className="px-2 py-1 text-xs font-medium bg-secondary rounded-md">{project.key}</span>
              </div>
              
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportData('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportData('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportData('xlsx')}>
                    Export as XLSX
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Team
              </Button>
              
              <Button onClick={() => setIsNewTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          <Tabs defaultValue="board">
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
            <TabsContent value="board" className="space-y-4">
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="sm" className="ml-2">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-x-auto">
                  {project.board.columnOrder.map((columnId) => {
                    const column = project.board.columns[columnId];
                    return (
                      <Droppable droppableId={columnId} key={columnId}>
                        {(provided, snapshot) => (
                          <div
                            className="kanban-column"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <h2 className="text-lg font-semibold mb-2 px-3">{column.title}</h2>
                            {filteredTasks(columnId).map((task, index) => (
                              <Draggable draggableId={task.id} index={index} key={task.id}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TaskCard task={task} />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </div>
              </DragDropContext>
            </TabsContent>
            <TabsContent value="list" className="space-y-4">
              <p>List view will be implemented here.</p>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="taskTitle">Title</Label>
                <Input 
                  id="taskTitle" 
                  placeholder="Task title" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDescription">Description</Label>
                <Textarea 
                  id="taskDescription" 
                  placeholder="Task description" 
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="taskPriority">Priority</Label>
                  <Select 
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({...newTask, priority: value})}
                  >
                    <SelectTrigger id="taskPriority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ProjectBoard;
