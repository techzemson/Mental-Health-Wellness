import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, X, AlertCircle, StickyNote } from 'lucide-react';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, addTodo, updateTodo, deleteTodo }) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newTodoText.trim()) return;
    addTodo({
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      priority: newTodoPriority,
      createdAt: Date.now()
    });
    setNewTodoText('');
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) return b.createdAt - a.createdAt;
    return a.completed ? 1 : -1;
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'low': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="shrink-0">
         <h2 className="text-2xl font-bold text-slate-800">Tasks & Notes</h2>
         <p className="text-slate-500">Organize your thoughts and goals.</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {/* Input Area */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
           <div className="flex gap-3 mb-3">
             <input 
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Add a new task..."
                className="flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
             />
             <button 
                onClick={handleAdd}
                className="bg-slate-900 text-white px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors"
             >
                Add
             </button>
           </div>
           <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setNewTodoPriority(p)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                        newTodoPriority === p 
                        ? getPriorityColor(p) 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
              ))}
           </div>
        </div>

        {/* List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
           {todos.length === 0 && (
               <div className="text-center py-20 text-slate-400">
                   <p>No tasks yet. Clear your mind.</p>
               </div>
           )}
           {sortedTodos.map(todo => (
               <div key={todo.id} className={`group rounded-2xl border transition-all ${todo.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}>
                   <div className="p-4 flex items-start gap-3">
                       <button 
                         onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                         className={`mt-1 shrink-0 ${todo.completed ? 'text-slate-400' : 'text-blue-500'}`}
                       >
                           {todo.completed ? <CheckCircle2 /> : <Circle />}
                       </button>
                       
                       <div className="flex-1">
                           <div className="flex justify-between items-start">
                               <span className={`text-base font-medium transition-all ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                   {todo.text}
                               </span>
                               <div className="flex items-center gap-2">
                                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getPriorityColor(todo.priority)}`}>
                                       {todo.priority}
                                   </span>
                                   <button 
                                      onClick={() => setActiveNoteId(activeNoteId === todo.id ? null : todo.id)}
                                      className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${todo.note ? 'text-blue-500' : 'text-slate-300'}`}
                                   >
                                       <StickyNote size={16} />
                                   </button>
                                   <button 
                                      onClick={() => deleteTodo(todo.id)}
                                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                   >
                                       <X size={16} />
                                   </button>
                               </div>
                           </div>
                           
                           {/* Note Section */}
                           {(activeNoteId === todo.id || todo.note) && (
                               <div className={`mt-3 pt-3 border-t border-slate-100 ${activeNoteId !== todo.id && !todo.note ? 'hidden' : 'block'}`}>
                                   <textarea
                                       value={todo.note || ''}
                                       onChange={(e) => updateTodo(todo.id, { note: e.target.value })}
                                       placeholder="Add details or notes..."
                                       className="w-full text-sm text-slate-600 bg-transparent outline-none resize-none placeholder:text-slate-300"
                                       rows={3}
                                   />
                               </div>
                           )}
                       </div>
                   </div>
               </div>
           ))}
        </div>
      </div>
    </div>
  );
};