const Workflow = require("../models/workflowModel");
const axios = require("axios");
const path = require("path");
const csvParser = require("csv-parser");
const fs = require("fs");

// Save workflow
const saveWorkflow = async (req, res) => {
  try {
    const newWorkflow = new Workflow(req.body);
    await newWorkflow.save();
    res.status(201).json({ workflowId: newWorkflow._id });
  } catch (error) {
    console.error("Error saving workflow:", error);
    res.status(500).json({ error: "Error saving workflow" });
  }
};

// List workflows
const listWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    res.json(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    res.status(500).json({ error: "Error fetching workflows" });
  }
};

// Endpoint to execute the workflow
const executeWorkflowEndpoint = async (req, res) => {
  try {
    const { workflowId } = req.body;
    const csvData = req.file; // Assuming the uploaded CSV file is provided in req.file

    // Convert the CSV to JSON and execute the workflow
    const jsonData = await executeWorkflow(workflowId, csvData);

    // Return the JSON data as the response
    res.status(200).json({ success: true, data: jsonData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Execute the workflow
const executeWorkflow = async (workflowId, csvData) => {
  try {
    // Fetch the workflow by ID
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      throw new Error("Workflow not found");
    }

    let jsonData = []; // Initialize empty array to hold JSON data

    // Loop through the workflow nodes
    for (let node of workflow.nodes) {
      switch (node.data.label) {
        case "Filter Data":
          jsonData = await filterData(jsonData, node.data.criteria); // Reassign jsonData
          break;
        case "Wait":
          await wait(node.data.delay || 10000); // Use node-specific delay if available
          break;
        case "Convert Format":
          jsonData = await convertCsvToJson(csvData); // Convert CSV to JSON within this case
          break;
        case "Send POST Request":
          await sendPostRequest(jsonData, node.data.url); // URL can be specific to the node
          break;
        case "Start":
          console.log("Starting workflow execution...");
          break;
        case "End":
          console.log("Workflow execution complete.");
          break;
        default:
          console.log(`No action for node type: ${node.data.label}`);
          break;
      }
    }

    return jsonData;
  } catch (error) {
    console.error("Error executing workflow:", error);
    throw error; // Re-throw error for external error handling
  }
};

// Helper function to filter data based on some criteria (assuming node has filter criteria)
const filterData = async (data, criteria = {}) => {
  try {
    return data.map((row) => {
      // Apply filtering based on node-specific criteria (as an example, convert name to lowercase)
      if (criteria.name) {
        row.name = row.name.toLowerCase();
      }
      return row;
    });
  } catch (error) {
    console.error("Error filtering data:", error);
    throw error;
  }
};

// Helper function to convert CSV data to JSON format
const convertCsvToJson = async (csvData) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "../uploads", csvData.filename); // Ensure the correct path

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data)) // Collect each row
      .on("end", () => {
        console.log("CSV to JSON conversion complete.");
        resolve(results); // Return results as JSON array
      })
      .on("error", (err) => {
        console.error("Error converting CSV to JSON:", err);
        reject(err);
      });
  });
};

// Helper function to send POST request with JSON data
const sendPostRequest = async (jsonData, url) => {
  try {
    const response = await axios.post(
      url || "https://requestcatcher.com/test",
      jsonData
    );
    console.log("POST request successful:", response.status);
  } catch (error) {
    console.error("Error sending POST request:", error);
    throw error;
  }
};

// Helper function to wait for a specific amount of time
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Route handlers export
module.exports = {
  saveWorkflow,
  listWorkflows,
  executeWorkflowEndpoint,
};
