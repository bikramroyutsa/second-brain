'use client'
import { loadAllNotes } from '@/lib/actions/db';
import {
  ReactFlow,
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  EdgeChange,
  NodeChange,
  addEdge,
  MiniMap,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
];
const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
    type: 'step',
    label: 'connects with'
  },
];
export default function Map() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  async function loadNodesAndEdges(){
    const n = await loadAllNotes()
    const data = n.map((note, index)=>{
      return{
        id: note.id, 
        position: { x: index * 250, y: index * 50 }, 
        data: { 
          label: note.title,
          userId: note.user_id,
          folderId: note.folder_id
        },
      }
    })
    setNodes(data)
  
  }
  useEffect(()=>{
    loadNodesAndEdges()
  },[])
  const onNodesChange = useCallback(
    (changes: NodeChange<{ id: string; position: { x: number; y: number; }; data: { label: string; }; type: string; } | { id: string; position: { x: number; y: number; }; data: { label: string; }; type?: undefined; }>[]) => 
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<{ id: string; source: string; target: string; type: string; label: string; }>[]) => 
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div style={{ width: '100%', height: '100%' }} className='bg-[#ffffff] text-black'>
      <ReactFlow nodes={nodes} edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background  />
        {/* <Panel position ="top-center"> hi </Panel> */}
        <MiniMap  nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
}
