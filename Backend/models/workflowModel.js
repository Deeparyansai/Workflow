const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  data: {
    label: { type: String, required: true },
  },
  width: { type: Number },
  height: { type: Number },
  selected: { type: Boolean },
  positionAbsolute: {
    x: { type: Number },
    y: { type: Number },
  },
  dragging: { type: Boolean },
});

const edgeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  sourceHandle: { type: String, default: null },
  target: { type: String, required: true },
  targetHandle: { type: String, default: null },
  id: { type: String, required: true },
});

const workflowSchema = new mongoose.Schema({
  nodes: [nodeSchema],
  edges: [edgeSchema],
});

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
