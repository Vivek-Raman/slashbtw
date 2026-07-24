import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type CoordinateExtent,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import { Network, Sparkles } from 'lucide-react'

import '@xyflow/react/dist/style.css'

type ConversationTone = 'clay' | 'moss' | 'ochre'

type ConversationData = {
  label: string
  user: string
  assistant: string
  tone: ConversationTone
}

type ConversationNode = Node<ConversationData, 'conversation'>

const nodes: ConversationNode[] = [
  {
    id: 'seed',
    type: 'conversation',
    position: { x: 0, y: 170 },
    data: {
      label: 'Starting point',
      user: 'How should this canvas feel when I first open it?',
      assistant: 'Like a working table: calm at first glance, with every idea close enough to reach.',
      tone: 'ochre',
    },
  },
  {
    id: 'shape',
    type: 'conversation',
    position: { x: 410, y: 50 },
    data: {
      label: 'Structure',
      user: 'Could the path branch without feeling like a flowchart?',
      assistant: 'Use soft curves and generous space. The relationship should feel discovered, not diagrammed.',
      tone: 'clay',
    },
  },
  {
    id: 'resolve',
    type: 'conversation',
    position: { x: 820, y: 285 },
    data: {
      label: 'Direction',
      user: 'What should the finished conversation leave me with?',
      assistant: 'A clear next thought, plus enough open space to keep exploring it.',
      tone: 'moss',
    },
  },
]

const edges: Edge[] = [
  {
    id: 'seed-shape',
    source: 'seed',
    target: 'shape',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'shape-resolve',
    source: 'shape',
    target: 'resolve',
    type: 'smoothstep',
    animated: true,
  },
]

const canvasExtent: CoordinateExtent = [
  [-160, -160],
  [1260, 720],
]

function ConversationCard({ data }: NodeProps<ConversationNode>) {
  return (
    <article className="flow-conversation-card" data-tone={data.tone}>
      <Handle className="flow-handle" type="target" position={Position.Left} />

      <header className="flow-conversation-card__header">
        <span>{data.label}</span>
        <span>Conversation</span>
      </header>

      <div className="flow-snippet">
        <p className="flow-role flow-role--user">You</p>
        <p className="flow-copy flow-copy--user">{data.user}</p>
      </div>

      <div className="flow-snippet flow-snippet--assistant">
        <p className="flow-role">
          <Sparkles aria-hidden="true" />
          Assistant
        </p>
        <p className="flow-copy">{data.assistant}</p>
      </div>

      <Handle className="flow-handle" type="source" position={Position.Right} />
    </article>
  )
}

const nodeTypes = { conversation: ConversationCard }

function CanvasPage() {
  return (
    <main className="canvas-page">
      <header className="canvas-header">
        <div className="canvas-title-group">
          <div className="canvas-mark" aria-hidden="true">
            <Network />
          </div>
          <div>
            <p className="canvas-eyebrow">Conversation study</p>
            <h1>Thinking in branches</h1>
          </div>
        </div>

        <div className="canvas-meta" aria-label="Canvas summary">
          <span>
            <i className="canvas-status-dot" />
            Draft canvas
          </span>
          <span>3 notes</span>
          <span>2 connections</span>
        </div>
      </header>

      <section className="canvas-flow" aria-label="Conversation flow canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.22, maxZoom: 0.9 }}
          minZoom={0.6}
          maxZoom={1.15}
          translateExtent={canvasExtent}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={18} size={1} color="rgba(48, 52, 46, 0.2)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </section>
    </main>
  )
}

export default CanvasPage
