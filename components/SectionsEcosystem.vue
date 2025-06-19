<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();

const props = defineProps<{
  section: any;
}>();

const svgRef = ref(null);
const width = ref(1000);
const height = ref(600);

const { data: nodesData } = await useAPI("/api/ecosystem-nodes", {});
const { data: linksData } = await useAPI("/api/ecosystem-links", {
  query: { populate: "*" }
});

const rawNodes = (nodesData.value as any).data;
const links = (linksData.value as any).data;

// Create a new array of nodes with links added
const nodes = rawNodes.map((node: any) => {
  // Find all links where this node is the source
  const nodeLinks = links.filter((link: any) => link.source.id === node.id);
  
  // Return node with links array added
  return {
    ...node,
    links: nodeLinks
  };
});

// Format data for D3
const graphData = {
  nodes: nodes.map(node => ({
    id: node.id,
    name: node.name,
    group: node.group || 0
  })),
  links: links.map(link => ({
    source: link.source.id,
    target: link.target.id,
    value: 1
  }))
};

onMounted(() => {
  createForceGraph();
  
  // Add resize listener
  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const { width: containerWidth } = entry.contentRect;
      width.value = containerWidth;
      createForceGraph();
    }
  });
  
  const container = document.querySelector('.force-graph-container');
  if (container) {
    resizeObserver.observe(container);
  }
});

// Function to create the force-directed graph
const createForceGraph = () => {
  if (!svgRef.value) return;
  
  // Clear previous graph
  d3.select(svgRef.value).selectAll("*").remove();
  
  const svg = d3.select(svgRef.value)
    .attr("width", width.value)
    .attr("height", height.value)
    .attr("viewBox", [0, 0, width.value, height.value])
    .attr("style", "max-width: 100%; height: auto;");
  
  // Define color scale based on groups
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  // Create simulation
  const simulation = d3.forceSimulation(graphData.nodes)
    .force("link", d3.forceLink(graphData.links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width.value / 2, height.value / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
  
  // Create a container for links
  /*
  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(graphData.links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));
  */
const link = svg.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("path")
  .data(graphData.links)
  .join("path")
  .attr("fill", "none")
  .attr("stroke-width", d => Math.sqrt(d.value));

  /*
  const link = svg.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("path")
  .data(graphData.links)
  .join("path")
  .attr("fill", "none")
  .attr("stroke-width", d => Math.sqrt(d.value));
  */
  /*
  const link = svg.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("path")
  .data(graphData.links)
  .join("path")
  .attr("fill", "none")
  .attr("stroke-width", d => Math.sqrt(d.value));
  */

  // Create a container for nodes
  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(graphData.nodes)
    .join("circle")
    .attr("r", 10)
    .attr("fill", d => color(d.group))
    .call(drag(simulation));
  
  // Add hover behavior
  node.on("mouseover", function(event, d) {
    d3.select(this).attr("r", 15);
    tooltip.style("visibility", "visible")
      .html(`<strong>${d.name}</strong>`);
  })
  .on("mousemove", function(event) {
    tooltip.style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  })
  .on("mouseout", function() {
    d3.select(this).attr("r", 10);
    tooltip.style("visibility", "hidden");
  });

  // Add labels to nodes
  const labels = svg.append("g")
    .selectAll("text")
    .data(graphData.nodes)
    .join("text")
    .text(d => d.name)
    .attr("font-size", 12)
    .attr("dx", 15)
    .attr("dy", 4);
  
  // Add tooltip div
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("padding", "24px")
    .style("pointer-events", "none");
  
  // Update positions on each tick of the simulation
  simulation.on("tick", () => {
    /*
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    */
     link.attr("d", d => {
    const midX = (d.source.x + d.target.x) / 2;
    const midY = (d.source.y + d.target.y) / 2;
    
    // Add some randomness to the midpoint
    const offsetX = (0.7 - 0.5) * 30;
    const offsetY = (0.2 - 0.5) * 30;
    
    return `M${d.source.x},${d.source.y} 
            L${midX + offsetX},${midY + offsetY} 
            L${d.target.x},${d.target.y}`;
  });
    /*
      link.attr("d", d => {
    const path = `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
    return sketchy(path, { roughness: 2, bowing: 1 });
    });
    */
    /*
    link.attr("d", d => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      
      // Calculate control points perpendicular to the direct line
      const controlPointX = (d.source.x + d.target.x) / 2 - dy * 0.3;
      const controlPointY = (d.source.y + d.target.y) / 2 + dx * 0.3;
      
      return `M${d.source.x},${d.source.y} Q${controlPointX},${controlPointY} ${d.target.x},${d.target.y}`;
    });
    */

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
    
    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });
  
  // Drag functionality
  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
};
</script>

<template>
  <div class="section-ecosystem">
    <div class="container">
      <h2 v-if="section.title" class="section-title mb-4">{{ section.title }}</h2>
      <div class="force-graph-container">
        <svg ref="svgRef"></svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-ecosystem {
  padding: 2rem 0;
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 500;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .force-graph-container {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f9f9f9;
  }
  
  svg {
    display: block;
    margin: 0 auto;
  }
}

:deep(.tooltip) {
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>