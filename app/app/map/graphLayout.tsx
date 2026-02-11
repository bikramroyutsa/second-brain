import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceX,
  forceY,
  forceCollide,
  forceRadial
} from 'd3-force';

export function computeLayout(nodes: any[], edges: any[]) {
  const d3Edges = edges.map(e => ({ ...e }))
  const d3Nodes = nodes.map(n => ({ ...n }))

  const simulation = forceSimulation(d3Nodes)
    .force('charge', forceManyBody().strength(-200))
    .force('center', forceCenter(400, 300))
    .force("collision", forceCollide(100))
    .force(
      'link',
      forceLink(d3Edges)
        .id((d: any) => d.id)
        .distance(120)
        .strength(0.8)
    )
    .force("radial", forceRadial(200, 300, 300))
    .stop();

  while (simulation.alpha() > 0.01) simulation.tick()


  return d3Nodes.map(n => ({
    ...n,
    position: { x: n.x ?? 0, y: n.y ?? 0 }
  }));
}