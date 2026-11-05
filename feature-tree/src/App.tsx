import { useCallback, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from 'reactflow'
import {
  Bot,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  FlaskConical,
  Layers,
  LayoutDashboard,
  RotateCcw,
  Search,
  ShieldCheck,
  Users,
  Vote,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  ALL_STORIES,
  EPICS,
  EPIC_BY_ID,
  EPIC_BY_STORY,
  STORY_BY_ID,
  type Epic,
  type Priority,
  type Story,
} from './data/backlog'

/* ------------------------------------------------------------------ */
/* Config visuelle                                                     */
/* ------------------------------------------------------------------ */

const PRIORITY_COLORS: Record<Priority, string> = {
  P0: '#ef4444',
  P1: '#f59e0b',
  P2: '#38bdf8',
}

const EPIC_ICONS: Record<string, LucideIcon> = {
  E1: ShieldCheck,
  E2: Users,
  E3: Code2,
  E4: Vote,
  E5: Bot,
  E6: LayoutDashboard,
  E7: FlaskConical,
}

/* ------------------------------------------------------------------ */
/* Layout (colonnes : racine → épiques → User Stories)                 */
/* ------------------------------------------------------------------ */

const STORY_STEP = 98
const X_ROOT = 0
const X_EPIC = 360
const X_STORY = 780

const epicY: Record<string, number> = {}
const storyPos: Record<string, { x: number; y: number }> = {}
let cursor = 0

for (const epic of EPICS) {
  const blockHeight = epic.stories.length * STORY_STEP
  epicY[epic.id] = cursor + blockHeight / 2 - 34
  epic.stories.forEach((story, index) => {
    storyPos[story.id] = { x: X_STORY, y: cursor + index * STORY_STEP }
  })
  cursor += blockHeight + 48
}

const totalHeight = cursor
const rootY = totalHeight / 2 - 34

/* ------------------------------------------------------------------ */
/* Données des nœuds / arêtes                                          */
/* ------------------------------------------------------------------ */

type RootData = {
  kind: 'root'
  total: number
  epics: number
  p0: number
  p1: number
  p2: number
}

type EpicData = { kind: 'epic'; epic: Epic }
type StoryData = { kind: 'story'; story: Story }
type AppNodeData = RootData | EpicData | StoryData

const priorityCounts = ALL_STORIES.reduce(
  (acc, story) => {
    acc[story.priority] += 1
    return acc
  },
  { P0: 0, P1: 0, P2: 0 } as Record<Priority, number>,
)

const initialNodes: Node<AppNodeData>[] = [
  {
    id: 'root',
    type: 'app',
    position: { x: X_ROOT, y: rootY },
    data: {
      kind: 'root',
      total: ALL_STORIES.length,
      epics: EPICS.length,
      p0: priorityCounts.P0,
      p1: priorityCounts.P1,
      p2: priorityCounts.P2,
    },
  },
  ...EPICS.map((epic) => ({
    id: epic.id,
    type: 'app',
    position: { x: X_EPIC, y: epicY[epic.id] },
    data: { kind: 'epic' as const, epic },
  })),
  ...ALL_STORIES.map((story) => ({
    id: story.id,
    type: 'app',
    position: storyPos[story.id],
    data: { kind: 'story' as const, story },
  })),
]

const hierarchyEdges: Edge[] = [
  ...EPICS.map((epic) => ({
    id: `root-${epic.id}`,
    source: 'root',
    target: epic.id,
    type: 'smoothstep',
    animated: true,
    style: { stroke: epic.color, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: epic.color, width: 18, height: 18 },
  })),
  ...EPICS.flatMap((epic) =>
    epic.stories.map((story) => ({
      id: `${epic.id}-${story.id}`,
      source: epic.id,
      target: story.id,
      type: 'smoothstep',
      style: { stroke: '#3a3f5c', strokeWidth: 1.4 },
    })),
  ),
]

const dependencyEdges: Edge[] = ALL_STORIES.flatMap((story) =>
  story.deps.map((dep) => ({
    id: `dep-${dep}-${story.id}`,
    source: dep,
    target: story.id,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#a855f7', strokeWidth: 1.4, strokeDasharray: '6 4' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7', width: 16, height: 16 },
  })),
)

/* ------------------------------------------------------------------ */
/* Nœud personnalisé                                                   */
/* ------------------------------------------------------------------ */

function TreeNode({ data, selected }: NodeProps<AppNodeData>) {
  if (data.kind === 'root') {
    return (
      <div className={`tn tn-root ${selected ? 'is-selected' : ''}`}>
        <Handle type="source" position={Position.Right} id="r" className="tn-handle" />
        <div className="tn-root-icon">
          <Layers size={20} />
        </div>
        <div>
          <div className="tn-root-title">CodeArena</div>
          <div className="tn-root-sub">
            {data.total} US · {data.epics} épiques · tout en TO DO
          </div>
        </div>
      </div>
    )
  }

  if (data.kind === 'epic') {
    const Icon = EPIC_ICONS[data.epic.id] ?? Layers
    return (
      <div
        className={`tn tn-epic ${selected ? 'is-selected' : ''}`}
        style={{ borderColor: `${data.epic.color}66` }}
      >
        <Handle type="target" position={Position.Left} id="l" className="tn-handle" />
        <Handle type="source" position={Position.Right} id="r" className="tn-handle" />
        <div
          className="tn-epic-icon"
          style={{ background: `${data.epic.color}22`, color: data.epic.color }}
        >
          <Icon size={18} />
        </div>
        <div className="tn-epic-body">
          <div className="tn-epic-title">{data.epic.title}</div>
          <div className="tn-epic-meta">{data.epic.stories.length} User Stories</div>
        </div>
        <ChevronRight size={16} className="tn-epic-chevron" />
      </div>
    )
  }

  const { story } = data

  return (
    <div
      className={`tn tn-story ${selected ? 'is-selected' : ''}`}
      style={{ ['--prio-color' as string]: PRIORITY_COLORS[story.priority] }}
    >
      <Handle type="target" position={Position.Left} id="l" className="tn-handle" />
      <Handle type="source" position={Position.Right} id="r" className="tn-handle" />
      <div className="tn-story-top">
        <span className="tn-story-id">{story.id}</span>
        <span className={`tn-prio prio-${story.priority.toLowerCase()}`}>{story.priority}</span>
        <span className="tn-todo">
          <Circle size={7} /> TO DO
        </span>
      </div>
      <div className="tn-story-title">{story.title}</div>
      <div className="tn-story-role">{story.role}</div>
    </div>
  )
}

const nodeTypes = { app: TreeNode }

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

function storyMatches(story: Story, query: string): boolean {
  if (!query) return true
  return [story.id, story.title, story.role, story.goal, story.value].some((value) =>
    value.toLowerCase().includes(query),
  )
}

/* ------------------------------------------------------------------ */
/* Application                                                         */
/* ------------------------------------------------------------------ */

function FeatureTree() {
  const [nodes, , onNodesChange] = useNodesState<AppNodeData>(initialNodes)
  const { fitView } = useReactFlow()

  const [search, setSearch] = useState('')
  // Épiques repliés par défaut pour une vue d'ensemble lisible.
  const [collapsed, setCollapsed] = useState<Set<string>>(
    new Set<string>(EPICS.map((epic) => epic.id)),
  )
  const [showDeps, setShowDeps] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const query = search.trim().toLowerCase()

  const toggleCollapsed = (epicId: string) => {
    setCollapsed((previous) => {
      const next = new Set(previous)
      if (next.has(epicId)) next.delete(epicId)
      else next.add(epicId)
      return next
    })
  }

  const epicMatchesQuery = (epicId: string): boolean => {
    if (!query) return false
    return EPIC_BY_ID[epicId].stories.some((story) => storyMatches(story, query))
  }

  const displayNodes = useMemo(() => {
    return nodes
      .filter((node) => {
        const data = node.data
        if (data.kind !== 'story') return true
        const epicId = EPIC_BY_STORY[data.story.id]
        if (collapsed.has(epicId) && !epicMatchesQuery(epicId)) return false
        return true
      })
      .map((node) => {
        const data = node.data
        let dimmed = false
        if (data.kind === 'story') dimmed = !storyMatches(data.story, query)
        if (data.kind === 'epic') {
          dimmed =
            query !== '' &&
            !data.epic.title.toLowerCase().includes(query) &&
            !data.epic.stories.some((story) => storyMatches(story, query))
        }
        return {
          ...node,
          style: { ...node.style, opacity: dimmed ? 0.16 : 1, transition: 'opacity .2s' },
        }
      })
  }, [nodes, query, collapsed])

  const displayEdges = useMemo(() => {
    const hidden = new Set<string>()
    for (const story of ALL_STORIES) {
      const epicId = EPIC_BY_STORY[story.id]
      if (collapsed.has(epicId) && !epicMatchesQuery(epicId)) hidden.add(story.id)
    }
    const source = showDeps ? [...hierarchyEdges, ...dependencyEdges] : hierarchyEdges
    return source.filter((edge) => !hidden.has(edge.source) && !hidden.has(edge.target))
  }, [showDeps, collapsed, query])

  const minimapColor = useCallback((node: Node) => {
    const data = node.data as AppNodeData
    if (data.kind === 'root') return '#6c63ff'
    if (data.kind === 'epic') return data.epic.color
    return PRIORITY_COLORS[data.story.priority]
  }, [])

  const selectedStory = selectedId && STORY_BY_ID[selectedId] ? STORY_BY_ID[selectedId] : null
  const selectedEpic = selectedId && EPIC_BY_ID[selectedId] ? EPIC_BY_ID[selectedId] : null

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <Layers size={20} />
          </div>
          <div>
            <h1>CodeArena — Arbre fonctionnel</h1>
            <p>
              {ALL_STORIES.length} User Stories · {EPICS.length} épiques · toutes en{' '}
              <strong>TO DO</strong>
            </p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-value">{ALL_STORIES.length}</span>
            <span className="stat-label">US</span>
          </div>
          <div className="stat">
            <span className="stat-value">{EPICS.length}</span>
            <span className="stat-label">Épiques</span>
          </div>
          <div className="stat">
            <span className="stat-value p0">{priorityCounts.P0}</span>
            <span className="stat-label">P0</span>
          </div>
          <div className="stat">
            <span className="stat-value p1">{priorityCounts.P1}</span>
            <span className="stat-label">P1</span>
          </div>
          <div className="stat">
            <span className="stat-value p2">{priorityCounts.P2}</span>
            <span className="stat-label">P2</span>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <label className="search">
          <Search size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une US, un rôle, un objectif…"
          />
          {search && (
            <button type="button" className="icon-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </label>

        <button
          type="button"
          className={`toggle-btn ${showDeps ? 'active' : ''}`}
          onClick={() => setShowDeps((value) => !value)}
        >
          {showDeps ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          Dépendances
        </button>

        <button
          type="button"
          className="toggle-btn"
          onClick={() =>
            setCollapsed((previous) =>
              previous.size > 0 ? new Set<string>() : new Set<string>(EPICS.map((epic) => epic.id)),
            )
          }
        >
          {collapsed.size > 0 ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          {collapsed.size > 0 ? 'Tout déplier' : 'Tout replier'}
        </button>

        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            setCollapsed(new Set<string>(EPICS.map((epic) => epic.id)))
            setSearch('')
            fitView({ padding: 0.2, duration: 450 })
          }}
        >
          <RotateCcw size={15} />
          Recentrer
        </button>
      </div>

      <div className="content">
        <main className="canvas">
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.12}
            maxZoom={1.8}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            onNodeDoubleClick={(_, node) => {
              const data = node.data as AppNodeData
              if (data.kind === 'epic') toggleCollapsed(data.epic.id)
            }}
            onPaneClick={() => setSelectedId(null)}
          >
            <Background color="#252a3d" gap={24} size={1} />
            <MiniMap
              pannable
              zoomable
              nodeColor={minimapColor}
              maskColor="rgba(8, 10, 16, 0.78)"
            />
            <Controls showInteractive={false} />
          </ReactFlow>

          <div className="legend">
            <span className="legend-item">
              <span className="legend-dot todo" />
              TO DO
            </span>
            <span className="legend-hint">Double-clic sur un épique pour replier</span>
          </div>
        </main>

        <aside className={`panel ${selectedId ? 'open' : ''}`}>
          {selectedStory && (
            <>
              <div className="panel-header">
                <span className="panel-id">{selectedStory.id}</span>
                <button type="button" className="icon-btn" onClick={() => setSelectedId(null)}>
                  <X size={16} />
                </button>
              </div>
              <h2 className="panel-title">{selectedStory.title}</h2>

              <div className="panel-badges">
                <span className={`tn-prio prio-${selectedStory.priority.toLowerCase()}`}>
                  {selectedStory.priority}
                </span>
                <span className="todo-pill">
                  <Circle size={7} /> TO DO
                </span>
              </div>

              <dl className="panel-dl">
                <dt>En tant que</dt>
                <dd>{selectedStory.role}</dd>
                <dt>Je veux</dt>
                <dd>{selectedStory.goal}</dd>
                <dt>Afin de</dt>
                <dd>{selectedStory.value}</dd>
              </dl>

              <div className="panel-section">
                <h3>Dépendances</h3>
                {selectedStory.deps.length === 0 ? (
                  <p className="muted">Aucune</p>
                ) : (
                  <div className="chips">
                    {selectedStory.deps.map((dep) => (
                      <button
                        key={dep}
                        type="button"
                        className="chip"
                        onClick={() => setSelectedId(dep)}
                      >
                        {dep}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="panel-section">
                <h3>Source</h3>
                <p className="source">.backlog/{selectedStory.id}.md</p>
              </div>
            </>
          )}

          {selectedEpic && (
            <>
              <div className="panel-header">
                <span className="panel-id">{selectedEpic.id}</span>
                <button type="button" className="icon-btn" onClick={() => setSelectedId(null)}>
                  <X size={16} />
                </button>
              </div>
              <h2 className="panel-title">{selectedEpic.title}</h2>
              <p className="muted">{selectedEpic.stories.length} User Stories · toutes en TO DO</p>

              <div className="panel-breakdown">
                {(['P0', 'P1', 'P2'] as Priority[]).map((priority) => {
                  const total = selectedEpic.stories.filter(
                    (story) => story.priority === priority,
                  ).length
                  return (
                    <div key={priority} className="breakdown-item">
                      <span
                        className="legend-dot"
                        style={{ background: PRIORITY_COLORS[priority] }}
                      />
                      <span>{priority}</span>
                      <strong>{total}</strong>
                    </div>
                  )
                })}
              </div>

              <div className="panel-section">
                <h3>User Stories</h3>
                <ul className="panel-list">
                  {selectedEpic.stories.map((story) => (
                    <li key={story.id}>
                      <button
                        type="button"
                        className="panel-list-item"
                        onClick={() => setSelectedId(story.id)}
                      >
                        <span
                          className="legend-dot"
                          style={{ background: PRIORITY_COLORS[story.priority] }}
                        />
                        <span className="panel-list-id">{story.id}</span>
                        <span className="panel-list-title">{story.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="toggle-btn wide"
                onClick={() => toggleCollapsed(selectedEpic.id)}
              >
                {collapsed.has(selectedEpic.id) ? 'Déplier' : 'Replier'} cet épique
              </button>
            </>
          )}

          {!selectedStory && !selectedEpic && (
            <div className="panel-empty">
              <Layers size={26} />
              <p>Sélectionnez un nœud pour voir le détail d’une User Story.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FeatureTree />
    </ReactFlowProvider>
  )
}
