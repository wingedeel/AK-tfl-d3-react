import d3 from 'd3';

export default class SimpleComponentD3 {
  constructor(el, props = {}) {

    // this.svg is the container svg
    this.svg = d3.select(el).append('svg')
      .style('overflow', 'visible')

    // this.html is the div holding text of all the bubbles
    this.html = d3.select(el).append('div')
      .attr('class', 'bubble-chart-text')
      .style('position', 'absolute')
      .style('left', 0)           // center horizontally
      .style('right', 0)
      .style('margin-left', 'auto')
      .style('margin-right', 'auto');

    // Update the Chart with the props
    this.update(el, props);
 
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
  }


  adjustSize(el) {

    // Centrally position Chart svg
    this.diameter = Math.min(el.offsetWidth, el.offsetHeight);
    const top  = Math.max((el.offsetHeight - this.diameter)/2, 0);
    this.svg.attr('width', this.diameter)
      .attr('height', this.diameter)
      .style('position', 'relative')
      .style('top', top + 'px'); 

    // Centrally position Text div
    this.html.style('width', this.diameter + 'px')
      .style('height', this.diameter + 'px')
      .style('top', top + 'px');   

    // Create D3 bubble layout
    this.bubble = d3.layout.pack()
      .sort(null)
      .size([this.diameter, this.diameter])
      .padding(3);
  }


  update(el, props) {

    this.adjustSize(el);

    const duration = 500;
    const delay = 0;
    const { data, colorLegend } = props;
    
    // ----- COLOR --------
    // Define a color scale for our colorValues
    const color = d3.scale.quantize()
      .domain([
        d3.min(data, d => d.colorValue),
        d3.max(data, d => d.colorValue)
      ])
      .range(colorLegend);

    // ----- ADD DATA--------
    // Get our D3 bubble layout data
    const nodes = this.bubble.nodes(data.length ? {children: data} : data)
      .filter(d => d.depth); // filter out the outer bubble

    // Link our nodes to d3
    const circles = this.svg.selectAll('circle')
      .data(nodes, d => 'g' + d._id)
      .on('mouseover', this.handleMouseover )
      .on('mouseout', this.handleMouseout )
      //this._tooltipMouseOver.bind(this, color, el)

    const labels = this.html.selectAll('.bubble-label')
      .data(nodes, d => 'g' + d._id)

    // ----- TRANSITION --------
    // Move any existing nodes to their new location
    circles.transition()
      .duration(duration)
      .delay((d, i) => i * 7)
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .attr('r', d => d.r)
      .style('opacity', 1)
      .style('fill', d => color(d.colorValue));

    labels
      .on('mouseover', this._tooltipMouseOver.bind(this, color, el))
      .transition()
      .duration(duration)
      .delay((d, i) => i * 7)
      .style('height', d => 2 * d.r + 'px')
      .style('width', d => 2 * d.r + 'px')
      .style('left', d =>  d.x - d.r + 'px')
      .style('top', d =>  d.y - d.r + 'px')
      .style('opacity', 1);

    // ----- ENTER --------
    // Create any new nodes and postion them
    circles.enter().append('circle')
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .attr('r', 0)
      .style('fill', d => color(d.colorValue))
      .transition()
      .duration(duration * 1.2)
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .attr('r', d => d.r)
      .style('opacity', 1);

    labels.enter().append('div')
        .attr('class', 'bubble-label')
        .text(d => d.displayText || d._id)
        .style('position', 'absolute')
        .style('height', d => 2 * d.r + 'px')
        .style('width', d => 2 * d.r + 'px')
        .style('left', d =>  d.x - d.r + 'px')
        .style('top', d =>  d.y - d.r + 'px')
        .style('opacity', 0)
        .transition()
        .duration(duration * 1.2)
        .style('opacity', 1);

    // ----- EXIT / REMOVE --------
    // Remove any nodes that need to go
    circles.exit()
      .transition()
      .duration(duration)
      .attr('transform', d => {
        const dy = d.y - this.diameter/2;
        const dx = d.x - this.diameter/2;
        const theta = Math.atan2(dy,dx);
        const destX = this.diameter * (1 + Math.cos(theta) )/ 2;
        const destY = this.diameter * (1 + Math.sin(theta) )/ 2; 
        return 'translate(' + destX + ',' + destY + ')'; })
      .attr('r', 0)
      .remove();

    labels.exit()
      .transition()
      .duration(duration)
      .style('top', d => {
        const dy = d.y - this.diameter/2;
        const dx = d.x - this.diameter/2;
        const theta = Math.atan2(dy,dx);
        const destY = this.diameter * (1 + Math.sin(theta) )/ 2; 
        return destY + 'px'; })
      .style('left', d => { 
        const dy = d.y - this.diameter/2;
        const dx = d.x - this.diameter/2;
        const theta = Math.atan2(dy,dx);
        const destX = this.diameter * (1 + Math.cos(theta) )/ 2;
        return destX + 'px'; })
      .style('opacity', 0)
      .style('width', 0)
      .style('height', 0)
      .remove();

  }

  _tooltipMouseOver(color, el, d, i) {
    console.log('tooltip mouse over ')
  }

  handleMouseover() {
    console.log('tooltip mouse over ')
  }

  handleMouseout() {
    console.log('tooltip mouse out')
  }

  /** Any necessary cleanup */
  destroy(el) { }
}
