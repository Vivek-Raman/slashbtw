import {
  Focus,
  Maximize2,
  Minus,
  Network,
  Plus,
  Sparkles,
} from 'lucide-react'
import type { CSSProperties } from 'react'

type ConversationTone = 'clay' | 'moss' | 'ochre' | 'ink'

type ConversationNode = {
  id: string
  label: string
  user: string
  assistant: string
  x: number
  y: number
  angle: number
  tone: ConversationTone
}

type ConversationConnection = {
  from: ConversationNode['id']
  to: ConversationNode['id']
}

const CARD_WIDTH = 292
const CARD_CENTER_Y = 92

const conversationNodes: ConversationNode[] = [
  {
    id: 'origin',
    label: 'Starting point',
    user: 'How should this canvas feel when I first open it?',
    assistant:
      'Like a working table: calm at first glance, with every idea close enough to reach.',
    x: 76,
    y: 274,
    angle: -0.4,
    tone: 'ink',
  },
  {
    id: 'structure',
    label: 'Structure',
    user: 'Could the paths branch without feeling like a flowchart?',
    assistant:
      'Use soft, hand-drawn curves. The branches should feel discovered, not diagrammed.',
    x: 438,
    y: 76,
    angle: 0.5,
    tone: 'clay',
  },
  {
    id: 'tone',
    label: 'Atmosphere',
    user: 'I want it to feel thoughtful, but not too precious.',
    assistant:
      'Keep the paper warm, the ink dark, and let small imperfections soften the precision.',
    x: 438,
    y: 442,
    angle: -0.6,
    tone: 'moss',
  },
  {
    id: 'hierarchy',
    label: 'Reading order',
    user: 'How much of each conversation should a card reveal?',
    assistant:
      'One exchange is enough: the question creates tension, and the answer points forward.',
    x: 800,
    y: 24,
    angle: -0.5,
    tone: 'ochre',
  },
  {
    id: 'signals',
    label: 'Wayfinding',
    user: 'What helps me tell one line of thought from another?',
    assistant:
      'Use quiet color signals and generous spacing—the relationships can do the explaining.',
    x: 800,
    y: 254,
    angle: 0.4,
    tone: 'clay',
  },
  {
    id: 'respite',
    label: 'Pacing',
    user: 'Can the empty areas be part of the interface?',
    assistant:
      'Yes. Space is a pause between thoughts; it gives each branch room to become legible.',
    x: 800,
    y: 484,
    angle: -0.3,
    tone: 'moss',
  },
  {
    id: 'synthesis',
    label: 'Synthesis',
    user: 'What does the finished direction look like?',
    assistant:
      'A quiet constellation of choices—structured enough to follow, open enough to explore.',
    x: 1162,
    y: 254,
    angle: 0.5,
    tone: 'ink',
  },
]

const connections: ConversationConnection[] = [
  { from: 'origin', to: 'structure' },
  { from: 'origin', to: 'tone' },
  { from: 'structure', to: 'hierarchy' },
  { from: 'structure', to: 'signals' },
  { from: 'tone', to: 'signals' },
  { from: 'tone', to: 'respite' },
  { from: 'hierarchy', to: 'synthesis' },
  { from: 'signals', to: 'synthesis' },
]

const nodesById = new Map(conversationNodes.map((node) => [node.id, node]))

function connectorPath(connection: ConversationConnection) {
  const from = nodesById.get(connection.from)
  const to = nodesById.get(connection.to)

  if (!from || !to) {
    return ''
  }

  const startX = from.x + CARD_WIDTH
  const startY = from.y + CARD_CENTER_Y
  const endX = to.x
  const endY = to.y + CARD_CENTER_Y
  const curve = Math.max(64, (endX - startX) * 0.48)

  return `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`
}

function ConversationCard({
  node,
  index,
}: {
  node: ConversationNode
  index: number
}) {
  const cardStyle = {
    '--card-x': `${node.x}px`,
    '--card-y': `${node.y}px`,
    '--card-angle': `${node.angle}deg`,
    '--card-delay': `${120 + index * 65}ms`,
  } as CSSProperties

  return (
    <article
      className="conversation-card"
      data-tone={node.tone}
      style={cardStyle}
    >
      <header className="conversation-card__header">
        <span>{node.label}</span>
        <span className="conversation-card__number">
          {String(index + 1).padStart(2, '0')}
        </span>
      </header>

      <div className="conversation-snippet">
        <p className="conversation-role conversation-role--user">You</p>
        <p className="conversation-copy conversation-copy--user">{node.user}</p>
      </div>

      <div className="conversation-snippet conversation-snippet--assistant">
        <p className="conversation-role">
          <Sparkles aria-hidden="true" />
          Assistant
        </p>
        <p className="conversation-copy">{node.assistant}</p>
      </div>
    </article>
  )
}

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
          <span>{conversationNodes.length} notes</span>
          <span>{connections.length} connections</span>
        </div>
      </header>

      <section
        className="canvas-viewport"
        aria-label="Static conversation tree canvas"
      >
        <div className="canvas-grid" aria-hidden="true" />
        <div className="canvas-board">
          <svg
            className="canvas-connections"
            viewBox="0 0 1510 720"
            aria-hidden="true"
          >
            {connections.map((connection, index) => (
              <g key={`${connection.from}-${connection.to}`}>
                <path
                  className="canvas-connection-shadow"
                  d={connectorPath(connection)}
                />
                <path
                  className="canvas-connection"
                  d={connectorPath(connection)}
                  pathLength={1}
                  style={{ animationDelay: `${80 + index * 70}ms` }}
                />
              </g>
            ))}
          </svg>

          {conversationNodes.map((node, index) => (
            <ConversationCard key={node.id} node={node} index={index} />
          ))}

          <div className="canvas-entry-point" aria-hidden="true">
            <span />
            Begin here
          </div>
        </div>

        <aside className="canvas-legend" aria-label="Canvas legend">
          <span>
            <i className="legend-mark legend-mark--active" />
            Current path
          </span>
          <span>
            <i className="legend-mark" />
            Alternate thought
          </span>
        </aside>

        <div className="canvas-toolbar" role="group" aria-label="Canvas controls">
          <button type="button" disabled aria-label="Zoom out">
            <Minus />
          </button>
          <span aria-label="Current zoom">82%</span>
          <button type="button" disabled aria-label="Zoom in">
            <Plus />
          </button>
          <i aria-hidden="true" />
          <button type="button" disabled aria-label="Center canvas">
            <Focus />
          </button>
          <button type="button" disabled aria-label="Fit canvas">
            <Maximize2 />
          </button>
        </div>

        <aside className="canvas-minimap" aria-label="Canvas minimap">
          <div className="minimap-tree" aria-hidden="true">
            <i className="mini-line mini-line--one" />
            <i className="mini-line mini-line--two" />
            {conversationNodes.map((node) => (
              <span
                key={node.id}
                style={{
                  left: `${node.x / 15.1}px`,
                  top: `${node.y / 12}px`,
                }}
              />
            ))}
            <b />
          </div>
          <p>Overview</p>
        </aside>
      </section>
    </main>
  )
}

export default CanvasPage
