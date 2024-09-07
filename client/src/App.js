import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WorkflowBuilder from './pages/WorkflowBuilder';
import ExecuteWorkflow from './pages/ExecuteWorkflow';
import Login from './pages/Login'; // Import Login component
import Signup from './pages/Signup'; // Import Signup component
import './App.css';


const App = () => {
  const error = useSelector((state) => state.workflow.error);

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Routes>
          <Route path="/" element={<WorkflowBuilder />} />
          <Route path="/execute" element={<ExecuteWorkflow />} />
          <Route path="/login" element={<Login />} /> {/* Add route for login */}
          <Route path="/signup" element={<Signup />} /> {/* Add route for signup */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
