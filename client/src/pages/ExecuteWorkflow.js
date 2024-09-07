import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setWorkflows, setSelectedWorkflow } from '../features/workflowSlice';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from 'react-icons/io5'; // Cloud icon from react-icons

const ExecuteWorkflow = () => {
  const dispatch = useDispatch();
  const workflows = useSelector((state) => state.workflow.workflows);
  const selectedWorkflow = useSelector((state) => state.workflow.selectedWorkflow);
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWorkflows = async () => {
      const token = JSON.parse(localStorage.getItem('auth'))?.token; 
      if (!token) {
        setMessage('You must be logged in to view workflows.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/workflow/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        dispatch(setWorkflows(response.data));
      } catch (error) {
        console.error('Error fetching workflows:', error);
        setMessage(`Error fetching workflows: ${error.response ? error.response.data : error.message}`);
      }
    };

    fetchWorkflows();
  }, [dispatch]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv']
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setCsvFile(file);
        setMessage('File uploaded successfully.');
      }
    },
    onDropRejected: (rejectedFiles) => {
      const invalidFile = rejectedFiles[0];
      setMessage(`Invalid file type: ${invalidFile.type}. Please upload a valid CSV file.`);
      setCsvFile(null);
    },
  });

  const handleWorkflowChange = (e) => {
    dispatch(setSelectedWorkflow(e.target.value));
  };

  const handleExecuteWorkflow = async () => {
    if (!csvFile || !selectedWorkflow) {
      setMessage('Please upload a CSV file and select a workflow.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('workflowId', selectedWorkflow);

    const token = JSON.parse(localStorage.getItem('auth'))?.token;

    try {
      const response = await axios.post('http://localhost:5000/api/workflow/execute', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Workflow executed successfully. Check the JSON data on console');
      console.log('JSON Data:', response.data.data);
    } catch (error) {
      setMessage(`Error executing workflow: ${error.response ? error.response.data : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <h2 className="w-50 text-center">Execute Workflow</h2>
      <div className="mb-3">
        <div
          {...getRootProps({ className: 'dropzone' })}
          className={`border p-3 text-center ${isDragActive ? 'bg-light' : ''}`}
          style={{ width: '300px', height: '300px', borderRadius: '8px', position: 'relative' }}
        >
          <input {...getInputProps()} />
          <IoCloudUploadOutline size={50} className="text-primary mb-2" />
          {isDragActive ? <p>Drop the file here ...</p> : <p>Drag 'n' drop a CSV file here, or click to select one</p>}
        </div>
        {csvFile && <p className="mt-2">File: {csvFile.name}</p>}
      </div>
      <div className="mb-3 w-25 mx-auto">
  <select onChange={handleWorkflowChange} value={selectedWorkflow || ''} className="form-select">
    <option value="" disabled>Select a workflow</option>
    {workflows.map((workflow) => (
      <option
        key={workflow._id}
        value={workflow._id}
      >
        {workflow._id}
      </option>
    ))}
  </select>
</div>




      <div>
        <button onClick={handleExecuteWorkflow} className="btn btn-primary" disabled={loading}>
          {loading ? 'Executing...' : 'Execute'}
        </button>
      </div>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default ExecuteWorkflow;
