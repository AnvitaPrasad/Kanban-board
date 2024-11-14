import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const Column = ({ columnKey, column, onAddTask, onDeleteTask }) => {
  const [newTaskContent, setNewTaskContent] = useState('');

  const handleAddClick = () => {
    if (newTaskContent.trim()) {
      onAddTask(columnKey, newTaskContent);
      setNewTaskContent('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddClick();
    }
  };

  return (
    <div className="column">
      <h2>{column.name}</h2>
      <Droppable droppableId={columnKey}>
        {(provided) => (
          <div
            className="column-cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    className="card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item.content}
                    <button
                      className="delete-button"
                      onClick={() => onDeleteTask(columnKey, item.id)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="add-task">
        <input
          type="text"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          onKeyDown={handleKeyDown}  // Trigger add on Enter
          placeholder="New task..."
        />
        <button onClick={handleAddClick}>Add Task</button>
      </div>
    </div>
  );
};

export default Column;







