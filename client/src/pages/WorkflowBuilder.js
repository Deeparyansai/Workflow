import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { addEdge, Background, Controls, ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { setWorkflowId, setError } from '../features/workflowSlice';

const nodeTypes = [
  { id: 'start', label: 'Start' },
  { id: 'filterData', label: 'Filter Data' },
  { id: 'wait', label: 'Wait' },
  { id: 'convertFormat', label: 'Convert Format' },
  { id: 'sendPostRequest', label: 'Send POST Request' },
  { id: 'end', label: 'End' },
];

const WorkflowBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const workflowId = useSelector((state) => state.workflow.workflowId);
  const error = useSelector((state) => state.workflow.error);
  const { isLoggedIn } = useSelector((state) => state.auth); // Authentication state from Redux
  const token = JSON.parse(localStorage.getItem('auth'))?.token;

  const [menuVisible, setMenuVisible] = useState(false);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const handleSaveWorkflow = async () => {
    if (!token) {
      dispatch(setError('Token is missing. Please log in again.'));
      return;
    }

    if (!isLoggedIn) {
      dispatch(setError('You must be logged in to save a workflow.'));
      return;
    }

    try {
      const workflow = { nodes, edges };
      const response = await fetch('http://localhost:5000/api/workflow/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(setError('Unauthorized access. Please log in again.'));
        } else if (response.status === 500) {
          dispatch(setError('Server error. Please try again later.'));
        } else {
          dispatch(setError('Failed to save workflow. Please try again.'));
        }
        return;
      }

      const data = await response.json();
      dispatch(setWorkflowId(data.workflowId));
      dispatch(setError(null));
      navigate('/execute');
    } catch (err) {
      console.error('Error saving workflow:', err);
      dispatch(setError('Network error. Please check your connection and try again.'));
    }
  };

  const handleNodeDrop = (event) => {
    if (!isLoggedIn) {
      dispatch(setError('You must be logged in to drag and drop nodes.'));
      return;
    }

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().left,
      y: event.clientY - event.currentTarget.getBoundingClientRect().top,
    };

    const newNode = {
      id: `${type}-${nodes.length + 1}`,
      type: 'default',
      position,
      data: { label: nodeTypes.find((nt) => nt.id === type).label },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const onDragStart = (event, nodeType) => {
    if (!isLoggedIn) {
      event.preventDefault(); // Prevent drag if not logged in
      dispatch(setError('You must be logged in to drag nodes.'));
      return;
    }
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <ReactFlowProvider>
      <div className="container-fluid vh-100">
        <div className="row h-100">
          {/* Left panel for node types */}
          <div className="col-3 bg-light p-3 border-end">
            <h4>Workflow Nodes</h4>
            {nodeTypes.map((node) => (
              <div
                key={node.id}
                onDragStart={(event) => onDragStart(event, node.id)}
                draggable={isLoggedIn} // Only draggable if logged in
                className={`mb-2 p-2 rounded border ${isLoggedIn ? 'bg-light' : 'bg-secondary'} ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                style={{
                  cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                }}
              >
                {node.label}
              </div>
            ))}
          </div>

          {/* Main workflow area */}
          <div
            className="col-9 position-relative"
            onDrop={handleNodeDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              style={{ width: '100%', height: '100%' }}
            >
              <Background variant="dots" gap={12} size={1} />
              <Controls />
            </ReactFlow>

            {/* Save workflow button and error messages */}
            <div className="position-absolute top-0 end-0 p-3">
              {isLoggedIn ? (
                <>
                  <button className="btn btn-primary mb-2" onClick={handleSaveWorkflow}>
                    Save Workflow
                  </button>
                  {workflowId && (
                    <div className="text-muted">Workflow ID: {workflowId}</div>
                  )}
                </>
              ) : (
                <div className="text-danger">You must be logged in. For Login or Signup, click on Menu</div>
              )}
              {error && <div className="text-danger">{error}</div>}
            </div>

            {/* Dropdown Menu for Login and Signup */}
            <div className="position-absolute top-0 start-0 p-3">
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleMenu}>
                  Menu
                </button>
                {menuVisible && (
                  <ul className="dropdown-menu show">
                    <li className="dropdown-item" onClick={() => navigate('/login')}>
                      Login
                    </li>
                    <li className="dropdown-item" onClick={() => navigate('/signup')}>
                      Signup
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
