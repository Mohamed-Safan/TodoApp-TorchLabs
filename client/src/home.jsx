import React, { useEffect, useState } from 'react';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsFilter, BsPencilSquare } from 'react-icons/bs'; //  React Icons
import Create from './create';
import './App.css'; 
import axios from 'axios';

function Home() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [bannerColor, setBannerColor] = useState('#fff'); 

  useEffect(() => {
    const storedBannerColor = localStorage.getItem('bannerColor');
    if (storedBannerColor) {
      setBannerColor(storedBannerColor);
    } else {
      setBannerColor('#fff'); 
    }
  
    axios.get('http://localhost:3001/get')
      .then(result => {
        const initialTodos = result.data.map(todo => ({ ...todo, done: false }));
        setTodos(initialTodos);
      })
      .catch(err => console.log(err))
  }, []);
  
  const handleEdit = (id) => {
    setEditingTaskId(id);
    const taskToEdit = todos.find(todo => todo._id === id);
    setEditTaskName(taskToEdit.task);
  };

  const handleUpdate = (id) => {
    axios.put(`http://localhost:3001/update/${id}`, { task: editTaskName })
      .then(result => {
        const updatedTodos = todos.map(todo => {
          if (todo._id === id) {
            return { ...todo, task: editTaskName };
          }
          return todo;
        });
        setTodos(updatedTodos);
        setEditingTaskId(null);
      })
      .catch(err => console.log(err))
  };

  const handleDelete = (id) => {
    axios.delete('http://localhost:3001/delete/' + id)
      .then(result => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(err => console.log(err))
  };

  const handleTaskStatusChange = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo._id === id) {
        return { ...todo, done: !todo.done }; 
      }
      return todo;
    });
    
    const newBannerColor = updatedTodos.some(todo => todo.done) ? '#ff6f61' : '#63cdda';
    
    setTodos(updatedTodos);
    setBannerColor(newBannerColor);
    localStorage.setItem('bannerColor', newBannerColor);
    
    // Update the status and banner color in the database
    axios.put(`http://localhost:3001/update/${id}`, { done: updatedTodos.find(todo => todo._id === id).done, bannerColor: newBannerColor })
      .catch(err => console.log(err));
  };
  
  const handleChange = (id, done) => {
    setBannerColor('#63cdda'); 
    localStorage.setItem('bannerColor', '#63cdda');
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    const newBannerColor = selectedFilter === 'completed' ? 'red' : '#63cdda';
    setBannerColor(newBannerColor);
    localStorage.setItem('bannerColor', newBannerColor);
  };

  const handleInputChange = (event) => {
    setEditTaskName(event.target.value);
  };

  const handleClearCompleted = () => {
 
    const updatedTodos = todos.filter(todo => !todo.done);
    setTodos(updatedTodos);

    const newBannerColor = updatedTodos.some(todo => todo.done) ? '#ff6f61' : '#63cdda';
    setBannerColor(newBannerColor);
    localStorage.setItem('bannerColor', newBannerColor);
    updatedTodos.forEach(todo => {
      axios.delete(`http://localhost:3001/delete/${todo._id}`)
        .catch(err => console.log(err))
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.done;
    } else if (filter === 'completed') {
      return todo.done;
    }
    return true;
  });

  return (
    <div className="home" style={{ backgroundColor: bannerColor }}>
      <div className="filter">
        <BsFilter className="filter-icon" />
        <div className="filter-options">
          <span onClick={() => handleFilterChange('all')}>All</span>
          <span onClick={() => handleFilterChange('active')}>Active</span>
          <span onClick={() => handleFilterChange('completed')}>Completed</span>
        </div>
      </div>
      <h2>ToDo List</h2>
      <Create />
      {filteredTodos.length === 0 ? (
        <div><h2>No Todos</h2></div>
      ) : filteredTodos.map((todo, index) => (
        <div className={`task ${todo.done ? 'completed' : 'active'}`} key={index}>
          <div className="checkbox" onClick={() => handleTaskStatusChange(todo._id)}>
            {todo.done ? (
              <BsFillCheckCircleFill className='icon' />
            ) : (
              <BsCircleFill className='icon' />
            )}
            {editingTaskId === todo._id ? (
              <input
                type="text"
                value={editTaskName}
                onChange={handleInputChange}
                autoFocus
              />
            ) : (
              <p className={todo.done ? "line_middle" : ""}>{todo.task}</p>
            )}
          </div>
          <div className="task-buttons">
            {editingTaskId === todo._id ? (
              <button
                onClick={() => handleUpdate(todo._id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#48a9a6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                Update
              </button>
            ) : (
              <>
                <BsPencilSquare
                  className='icon'
                  onClick={() => handleEdit(todo._id)}
                  style={{ marginRight: '5px', cursor: 'pointer' }}
                />
                {!todo.done && (
                  <button
                    onClick={() => handleChange(todo._id, true)} 
                    style={{
                      padding: '6px 12px',
                      backgroundColor: todo.done ? 'green' : '#48a9a6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    Active
                  </button>
                )}
                <BsFillTrashFill
                  className='icon'
                  onClick={() => handleDelete(todo._id)}
                  style={{ cursor: 'pointer' }}
                />
              </>
            )}
                  </div>
        </div>
      ))}
      {todos.some(todo => todo.done) && (
        <button className="clear-completed-btn" onClick={handleClearCompleted}>
          Clear Completed Tasks
        </button>
      )}
    </div>
  );
}

export default Home;
