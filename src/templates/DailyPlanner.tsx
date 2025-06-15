
import React, { useState } from 'react';
import { Plus, Check, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { announceToScreenReader } from '@/utils/accessibilityUtils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  timeEstimate?: string;
}

const DailyPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      timeEstimate: timeEstimate || undefined
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setTimeEstimate('');
    announceToScreenReader(`Task "${newTask}" added to your daily plan`);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updated = { ...task, completed: !task.completed };
        announceToScreenReader(
          `Task "${task.text}" marked as ${updated.completed ? 'completed' : 'incomplete'}`
        );
        return updated;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    if (taskToDelete) {
      announceToScreenReader(`Task "${taskToDelete.text}" removed from your plan`);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-green-600">
          <Calendar className="h-6 w-6" />
          Daily Planner
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{completedTasks} / {tasks.length} tasks completed</span>
          {tasks.length > 0 && (
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                aria-label={`Progress: ${completedTasks} out of ${tasks.length} tasks completed`}
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            aria-label="New task description"
          />
          <div className="flex gap-2">
            <Input
              placeholder="Time estimate (optional)"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(e.target.value)}
              className="flex-1"
              aria-label="Estimated time for task"
            />
            <Button onClick={addTask} disabled={!newTask.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="space-y-2" role="list" aria-label="Daily tasks">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 border rounded-lg flex items-center gap-3 ${
                task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
              role="listitem"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
              />
              
              <div className="flex-1">
                <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                  {task.text}
                </span>
                {task.timeEstimate && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    {task.timeEstimate}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete task "${task.text}"`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPlanner;
