'use client'
import { loadAllNotes, loadLinks } from '@/lib/actions/db';
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
import { computeLayout } from './graphLayout';
import { redirect } from 'next/navigation';

export default function Map() {
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])

  async function loadNodesAndEdges(){
    let [notes, links] = await Promise.all([loadAllNotes(), loadLinks()])
    notes = notes.map((note, index)=>{
      return{
        id: String(note.id), 
        position: { x: 0, y: 0 }, 
        data: { 
          label: note.title,
          userId: note.user_id,
          folderId: note.folder_id
        },
      }
    })
    // console.log(links)
    const edges = links.map((link, index)=>{
      return{
        id: `${link.from_note}-${link.to_note}`,
        source: String(link.from_note),
        target: String(link.to_note),
        type: 'simplebezier'
      }
    })
    // console.log(edges)
    const layoutedNodes = computeLayout(notes, edges);
    setEdges(edges);
    setNodes(layoutedNodes);
  
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
  function onDoubleClick(event, node){
    redirect(`/app/notes/${node.id}`)
  }
  // function onSingleClick(event, node){
  //   console.log(node.id)
  // }
  return (
    
    <div style={{ width: '100%', height: '100%' }} className='bg-[#ffffff] text-black'>
      
      <ReactFlow nodes={nodes} edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodesDraggable
        // nodesConnectable= {false
        // onNodeClick={onSingleClick}
        onNodeDoubleClick={onDoubleClick}
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
