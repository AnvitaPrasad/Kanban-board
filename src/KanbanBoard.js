import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';

const KanbanBoard = () => {
  const initialColumns = {
    'to-do': {
      name: 'To Do',
      items: [
        { id: '1', content: 'Task 1' },
        { id: '2', content: 'Task 2' },
      ],
    },
    'in-progress': {
      name: 'In Progress',
      items: [{ id: '3', content: 'Task 3' }],
    },
    done: {
      name: 'Done',
      items: [{ id: '4', content: 'Task 4' }],
    },
  };

  // Load from localStorage or use initial columns if no saved data
  const loadColumns = () => {
    const savedData = localStorage.getItem('kanbanColumns');
    return savedData ? JSON.parse(savedData) : initialColumns;
  };

  const [columns, setColumns] = useState(loadColumns);

  // Save to localStorage whenever columns state changes
  useEffect(() => {
    localStorage.setItem('kanbanColumns', JSON.stringify(columns));
  }, [columns]);

  const handleOnDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: destItems },
      });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
    }
  };

  const handleAddTask = (columnKey, content) => {
    const newTask = {
      id: Date.now().toString(),
      content,
    };
    setColumns((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        items: [...prev[columnKey].items, newTask],
      },
    }));
  };

  const handleDeleteTask = (columnKey, taskId) => {
    setColumns((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        items: prev[columnKey].items.filter((task) => task.id !== taskId),
      },
    }));
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="kanban-board">
        {Object.keys(columns).map((columnKey) => (
          <Column
            key={columnKey}
            columnKey={columnKey}
            column={columns[columnKey]}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

