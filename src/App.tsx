/* eslint-disable max-len */
import React, { useEffect, useState, useMemo } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodosList } from './components/TodosList.tsx';
import { TodoFilter } from './components/TodoFilter.tsx';
import { TodoModal } from './components/TodoModal.tsx';
import { Loader } from './components/Loader.tsx';

import { Todo } from './types/Todo';
import { User } from './types/User';
import { getTodos, getUser } from './api';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setLoadingTodos(true);
    getTodos()
      .then(setTodos)
      .finally(() => setLoadingTodos(false));
  }, []);

  useEffect(() => {
    if (selectedTodo) {
      setLoadingUser(true);
      getUser(selectedTodo.userId)
        .then(setUser)
        .finally(() => setLoadingUser(false));
    } else {
      setUser(null);
      setLoadingUser(false); // сброс при закрытии модалки
    }
  }, [selectedTodo]);

  const visibleTodos = useMemo(() => {
    return todos
      .filter(todo => {
        if (status === 'completed') {
          return todo.completed;
        }

        if (status === 'active') {
          return !todo.completed;
        }

        return true;
      })
      .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()));
  }, [todos, status, query]);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                status={status}
                onStatusChange={setStatus}
                query={query}
                onQueryChange={setQuery}
              />
            </div>

            <div className="block">
              {loadingTodos ? (
                <Loader />
              ) : (
                <TodosList
                  todos={visibleTodos}
                  onSelect={setSelectedTodo}
                  selectedTodo={selectedTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          user={user}
          loading={loadingUser}
          onClose={() => setSelectedTodo(null)}
        />
      )}
    </>
  );
};
