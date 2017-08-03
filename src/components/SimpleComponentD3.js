import d3 from 'd3';

class SimpleComponentD3 {
  
  constructor(el, props = {}) {
    // Create an svg in specified parent element
    this.svg = d3.select(el).append('svg')
      .attr('class', 'bubble-chart-d3')
      .style('overflow', 'visible');
    this.update(el, props);
  }

  adjustSize(el) {

    // Establish dimensions of bubble chart based on parent element.
    this.diameter = Math.min(el.offsetWidth, el.offsetHeight);
    const top = Math.max((el.offsetHeight - this.diameter)/2, 0);

    // Position svg
    this.svg.attr('width', this.diameter)
      .attr('height', this.diameter)
      .style('position', 'relative')
      .style('top', top + 'px');    // center vertically

    // Create D3 bubble layout that we will use to position our bubbles
    this.bubble = d3.layout.pack()
      .sort(null)
      .size([this.diameter, this.diameter])
      .padding(3);
  }

  update(el, props) {

    this.adjustSize(el);
    
    const { data } = props;
    // get our layout data
    const nodes = this.bubble.nodes(data.length ? {children: data} : data)
      .filter(d => d.depth); // filter out the outer bubble

    // link our nodes to d3
    const circles = this.svg.selectAll('circle')
      .data(nodes, d => 'g' + d._id);

    // move any existing nodes to their new location
    circles.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .attr('r', d => d.r);

    // create any new nodes and postion them
    circles.enter().append('circle')
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .attr('r', d => d.r);

    // remove any nodes that ain't there
    circles.exit()
      .remove();
  }

  destroy(el) { }

}

export default SimpleComponentD3;
