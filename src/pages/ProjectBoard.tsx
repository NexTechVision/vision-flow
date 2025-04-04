
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { projects, getProjectById, tasks } from "../data/mockData";
import TaskCard from "../components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const ProjectBoard = () => {
  const { id } = useParams<{ id: string }>();
  const project = getProjectById(id || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [board, setBoard] = useState(project?.board || { columns: {}, columnOrder: [] });
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item is dropped back to its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const sourceColumn = board.columns[source.droppableId];
    const destColumn = board.columns[destination.droppableId];
    
    // If moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      
      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };
      
      setBoard({
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      });
      
      return;
    }
    
    // Moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };
    
    const destTaskIds = Array.from(destColumn.taskIds);
    destTaskIds.splice(destination.index, 0, draggableId);
    const newDestColumn = {
      ...destColumn,
      taskIds: destTaskIds,
    };
    
    setBoard({
      ...board,
      columns: {
        ...board.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      },
    });
    
    // Show a toast message about the task status change
    const task = tasks.find(task => task.id === draggableId);
    if (task) {
      toast({
        title: "Task status updated",
        description: `"${task.title}" moved to ${destColumn.title}`,
      });
    }
  };

  const filteredTasks = (columnId: string) => {
    const column = board.columns[columnId];
    if (!column) return [];
    
    return column.taskIds
      .map(taskId => tasks.find(task => task.id === taskId))
      .filter(task => {
        if (!task) return false;
        if (!searchTerm) return true;
        return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      });
  };

  const exportData = (format: string) => {
    toast({
      title: "Export started",
      description: `Exporting project data as ${format.toUpperCase()}...`,
    });
    
    // In a real app, this would trigger the actual export functionality
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Project data has been exported as ${format.toUpperCase()}.`,
      });
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>{project.name} | NexTechVision</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <span className="px-2 py-1 text-xs font-medium bg-secondary rounded-md">
                {project.key}
              </span>
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
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <Tabs defaultValue="board">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="board">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-16rem)]">
                {board.columnOrder.map((columnId) => {
                  const column = board.columns[columnId];
                  const columnTasks = filteredTasks(columnId) as any[];
                  
                  return (
                    <Droppable key={column.id} droppableId={column.id}>
                      {(provided) => (
                        <div
                          className="kanban-column"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-sm">{column.title}</h3>
                            <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                              {columnTasks.length}
                            </span>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto">
                            {columnTasks.map((task, index) => (
                              <Draggable 
                                key={task.id} 
                                draggableId={task.id} 
                                index={index}
                              >
                                {(provided) => (
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
                          
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-muted-foreground mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add task
                          </Button>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </DragDropContext>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="bg-card rounded-md border shadow-sm p-6">
              <p className="text-muted-foreground">List view will be implemented in a future update.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="bg-card rounded-md border shadow-sm p-6">
              <p className="text-muted-foreground">Calendar view will be implemented in a future update.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProjectBoard;
