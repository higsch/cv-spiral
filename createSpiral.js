function createSpiral(periods, milestones, width = 300, height = 100) {
  
  // ========= Constants and properties ========= //
  const pi2 = 2 * Math.PI;
  const yearParser = d3.timeParse('%Y');
  const padding = 100;
  const minYear = d3.timeYear.floor(d3.min(periods, (d) => d.start));
  const maxYear = yearParser(d3.timeYear.floor(d3.max(periods, (d) => d.end)).getFullYear() + 2);
  
  // ========= Path generators ========= //
  const spiralLine = d3.lineRadial()
    .angle((d) => d.angle)
    .radius((d) => d.radius)
    .curve(d3.curveCardinal);

  // ========= Color scale ========= //
  const typesPeriods = ['stipend', 'stipend2', 'stipend3', 'education', 'work', 'path'];
  const typesMilestones = ['graduation', 'countrychange', 'award', 'voluntary']

  const typeColors = d3.scaleOrdinal()
    .domain(typesPeriods)
    .range(['#A5D8FF', '#A5D8FF', '#A5D8FF', '#99A9C4', '#D7C0D0']);

  // ========= Offset scale ========= //
  const offsetScale = d3.scaleOrdinal()
    .domain([...typesPeriods, ...typesMilestones])
    .range([-17, -20, -23, -10, -10, 1, -10, -10, 7, 7]);

  // ========= Chart definition ========= //
  function chart(selection) {
    // ========= Clear ========= //
    selection.selectAll('svg').remove();

    // ========= Create SVG ========= //
    const svg = selection.append('svg')
      .attr('class', 'cv')
      .attr('width', width)
      .attr('height', height);
    
    const defs = svg.append('defs');

    // ========= Build base spiral ========= //
    const spiralData = generateSpiralData({
      startAngle: -Math.PI / 2,
      endAngle: 4.5 * Math.PI / 2,
      startRadius: Math.min(width, height) / 10,
      endRadius: Math.min(width, height) / 2 - padding
    });

    const spiralBase = svg.append('g')
      .attr('class', 'spiral-base')
      .attr('transform', `translate(${width / 2} ${height / 2})`)
      .append('path')
      .datum(spiralData)
      .attr('id', 'spiral-base-path')
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 0)
      .attr('stroke-linecap', 'round')
      .attr('d', spiralLine);

    // ========= Spiral scales ========= //

    // stroke-width
    const w = width / 180;
    const strokeWidthScale = d3.scaleOrdinal()
      .domain(typesPeriods)
      .range([w, w, w, w * 1.6, w * 1.6, w]);

    // year to spiral length
    const lengthScale = d3.scaleTime()
      .domain([minYear, maxYear])
      .range([0, spiralBase.node().getTotalLength()]);

    // length to point on spiral
    const pointScale = function(time) {
      return spiralBase.node().getPointAtLength(lengthScale(time) || 0);
    };

    function getDatePoint(date, offset) {
      const point = pointScale(date);

      // The helper points are around the period end points
      const days = 5;
      function createHelperPoint(time, dir = 1) {
        return pointScale(new Date(time.getTime() + dir * 1000 * 60 * 60 * 24 * days));
      }

      const helper1 = createHelperPoint(date, 1);
      const helper2 = createHelperPoint(date, -1);

      // With the helper points, we can calculate the normals at each period end
      const normal = {
        x: helper2.y - helper1.y,
        y: -helper2.x + helper1.x
      };

      // The normals are shifted by the offset and mark the new starting points for a period
      point.x += normal.x * offset;
      point.y += normal.y * offset;
      
      return point;
    }

    // period to points
    const periodScale = function({ start, end, type }) {
      const offset = offsetScale(type);
      const startPoint = getDatePoint(start, offset);
      const endPoint = getDatePoint(end, offset);

      const startRadius = Math.sqrt(startPoint.x * startPoint.x + startPoint.y * startPoint.y);
      const endRadius = Math.sqrt(endPoint.x * endPoint.x + endPoint.y * endPoint.y);

      let startAngle, endAngle;
      startAngle = Math.asin(startPoint.x / startRadius);
      endAngle = Math.asin(endPoint.x / endRadius);

      if (startPoint.y > 0) startAngle = -Math.PI - startAngle;
      if (endPoint.y > 0) endAngle = -Math.PI - endAngle;

      if (startAngle > endAngle) startAngle -= pi2;

      return {
        startAngle,
        endAngle,
        startRadius,
        endRadius
      };
    };

    // ========= Year circles ========= //
    let year = minYear.getFullYear();
    const endYear = maxYear.getFullYear();
    const years = [];
    while (year <= endYear) {
      years.push(yearParser(year));
      year += 1;
    }

    svg.append('g')
      .attr('class', 'years')
      .attr('transform', `translate(${width / 2} ${height / 2})`)
      .selectAll('.year-circles')
      .data(years)
      .join('circle')
      .attr('class', 'year-circles')
      .attr('cx', (d) => pointScale(d).x)
      .attr('cy', (d) => pointScale(d).y)
      .attr('r', strokeWidthScale('work') / 2)
      .attr('fill', '#74757B')
      .attr('fill-opacity', 0.2);

    // ========= Year labels ========= // 
    defs.selectAll('.year-labels-path')
      .data(years)
      .join('path')
        .attr('id', (d) => `year-labels-path-${d}`)
        .attr('d', (d) => {
          const year = d.getFullYear();
          const month = d.getMonth();
          const day = d.getDate();
          const nextDate = new Date(year + 1, month, day);
          return spiralLine(generateSpiralData(periodScale({ start: d, end: nextDate, type: 'path' })));
        })
        .attr('stroke', 'none')
        .attr('fill', 'none');

    d3.select('g.years')
      .selectAll('.year-label')
      .data(years.slice(0, years.length - 1))
      .join('text')
        .attr('class', 'year-label')
        .attr('fill', '#74757B')
        .attr('fill-opacity', 0.5)
        .attr('font-family', 'PT Sans')
        .attr('font-size', '1rem')
        .attr('text-anchor', 'middle')
        .append('textPath')
          .attr('href', (d) => `#year-labels-path-${d}`)
          .attr('startOffset', '50%')
          .text((d) => d.getFullYear());

    // ========= Periods ========= //
    svg.append('g')
      .attr('class', 'periods')
      .attr('transform', `translate(${width / 2} ${height / 2})`)
      .selectAll('.period')
      .data(periods)
      .join('path')
        .attr('class', 'period')
        .attr('fill', 'none')
        .attr('stroke', (d) => typeColors(d.type))
        .attr('stroke-width', (d) => strokeWidthScale(d.type))
        .attr('stroke-linecap', 'round')
        .attr('d', (d) => spiralLine(generateSpiralData(periodScale(d))));

    // ============ Milestones ========= //
    const milestonesWrapper = svg.append('g')
      .attr('class', 'milestones')
      .attr('transform', `translate(${width / 2} ${height / 2})`);

    milestones.forEach(milestone => {
      const wrapper = milestonesWrapper.append('g');
      const iconWidth = width / 35;
      const icon = createMilestone(wrapper, milestone, iconWidth);
      const {x, y} = getDatePoint(milestone.date, offsetScale(milestone.type));
      icon
        .attr('transform', `translate(${x} ${y})`)
        .on('mouseenter', () => createMilestoneInfo(milestonesWrapper, milestone, x, y, width, height));
    });
  }

  // ========= Generate data for base spiral ========= //
  function generateSpiralData({ startAngle, endAngle, startRadius, endRadius }) {
    const steps = 50;

    let angles;
    const diff = Math.abs(endAngle - startAngle);
    if (startAngle < endAngle) {
      angles = d3.range(startAngle, endAngle, diff / steps);
      angles.push(endAngle);
    } else {
      angles = d3.range(endAngle, startAngle, diff / steps);
      angles.push(startAngle);
    }

    const radiusScale = d3.scaleLinear()
      .domain(d3.extent(angles))
      .range([startRadius, endRadius]);

    const spiralData = angles.map((angle) => {
      const radius = radiusScale(angle);
      return {
        angle,
        radius
      };
    });

    return spiralData;
  }

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  return chart;
}
