function createMilestone(wrapper, milestone, width) {
  const g = wrapper.append('g')
    .attr('transform', `translate(${width / 2} ${width / 2})`)
    .attr('class', 'milestone');

  g.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', width / 2)
    .attr('fill', '#FFF')
    .attr('stroke', '#74757B')
    .attr('stroke-width', width / 16);

  const icon = g.append('g');
  if (milestone.type === 'graduation') {
    icon.append('path')
      .attr('d', 'M0,10 L15,0 L30,10 L15,20 Z')
      .attr('fill', '#74757B');

    icon.append('path')
      .attr('d', 'M4,15 L15,22 L26,15 L26,26 L4,26 Z')
      .attr('fill', '#74757B');

    icon.attr('transform', `translate(${-width / 2.7}, ${-width / 2.7}) scale(${width / 40})`);
  }
  
  return g;
}

function createMilestoneInfo(wrapper, milestone, x, y, width, height) {
  
}
