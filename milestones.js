function createMilestone(wrapper, milestone, width) {
  const g = wrapper.append('g')
    .attr('transform', `translate(${width / 2} ${width / 2})`)
    .attr('class', 'milestone');

  g.append('clipPath')
    .attr('id', 'clipping')
    .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', width / 2);

  const icon = g.append('g');

  function appendOuterCircle(icon) {
    return icon.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', width / 2)
      .attr('fill', '#FFF')
      .attr('stroke', '#74757B')
      .attr('stroke-width', width / 16);
  }

  if (milestone.type === 'graduation') {
    appendOuterCircle(icon);

    const inner = icon.append('g');

    inner.append('path')
      .attr('d', 'M0,10 L15,0 L30,10 L15,20 Z')
      .attr('fill', '#74757B');

    inner.append('path')
      .attr('d', 'M4,15 L15,22 L26,15 L26,26 L4,26 Z')
      .attr('fill', '#74757B');

    inner.attr('transform', `translate(${-width / 2.7}, ${-width / 2.7}) scale(${width / 40})`);
  }

  if (milestone.type === 'countrychange') {
    icon.attr('clip-path', 'url(#clipping)')
    if (milestone.name === 'Germany') {
      icon.append('rect')
        .attr('x', -20)
        .attr('y', -width / 3 - width / 6)
        .attr('width', 40)
        .attr('height', width / 3)
        .attr('fill', 'black');
      icon.append('rect')
        .attr('x', -20)
        .attr('y', -width / 6)
        .attr('width', 40)
        .attr('height', width / 3)
        .attr('fill', '#D00');
      icon.append('rect')
        .attr('x', -20)
        .attr('y', width / 3 - width / 6)
        .attr('width', 40)
        .attr('height', width / 3)
        .attr('fill', '#FFCE00');
      icon.attr('transform', `scale(${width / 40})`)
    } else if (milestone.name === 'Sweden') {
      icon.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', width / 2)
        .attr('fill', '#006aa7')
        .attr('stroke', 'none');
      icon.append('rect')
        .attr('x', -6)
        .attr('y', -width / 2)
        .attr('width', 6)
        .attr('height', width)
        .attr('fill', '#fecc00');
      icon.append('rect')
        .attr('x', -width / 2)
        .attr('y', -3)
        .attr('width', width)
        .attr('height', 6)
        .attr('fill', '#fecc00');
      icon.attr('transform', `scale(${width / 40})`);
    }
  }

  if (milestone.type === 'award') {
    appendOuterCircle(icon);

    icon.append('path')
      .attr('d', 'm25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z')
      .attr('stroke', 'none')
      .attr('fill', '#74757B')
      .attr('transform', `translate(${-width / 2.2}, ${-width / 2.1}) scale(${width / 55})`)
  }

  if (milestone.type === 'voluntary') {
    appendOuterCircle(icon);

    icon.append('path')
      .attr('d', 'm100 44.189c0-6.796-10.63-11.822-24.783-14.529 1.155-3.322 2.105-6.538 2.764-9.541 2.193-10.025 1.133-16.856-2.981-19.231-1.019-0.588-2.193-0.888-3.49-0.888-5.62 0-13.46 5.665-21.509 15-8.046-9.335-15.886-15-21.511-15-1.294 0-2.47 0.3-3.491 0.888-5.891 3.4-4.918 15.141-0.175 28.767-14.173 2.701-24.824 7.731-24.824 14.534 0 6.799 10.634 11.822 24.79 14.531-1.161 3.323-2.11 6.536-2.767 9.539-2.194 10.027-1.136 16.857 2.976 19.231 1.021 0.589 2.197 0.886 3.491 0.886 5.625 0 13.464-5.667 21.511-14.998 8.047 9.331 15.886 15 21.509 15 1.297 0 2.472-0.299 3.49-0.888 4.114-2.374 5.174-9.204 2.98-19.231-0.658-3.003-1.608-6.216-2.766-9.539 14.156-2.708 24.786-7.732 24.786-14.531zm-28.49-41.605c0.838 0 1.579 0.187 2.199 0.543 3.016 1.741 3.651 7.733 1.747 16.44-0.661 3.022-1.628 6.264-2.814 9.63-4.166-0.695-8.585-1.194-13.096-1.49-2.572-3.887-5.206-7.464-7.834-10.67 7.581-8.861 14.934-14.453 19.798-14.453zm-9.198 48.71c-1.375 2.379-2.794 4.684-4.242 6.9-2.597 0.132-5.287 0.206-8.069 0.206s-5.474-0.074-8.067-0.206c-1.452-2.217-2.87-4.521-4.242-6.9-1.388-2.406-2.669-4.771-3.849-7.081 1.204-2.369 2.477-4.753 3.851-7.13 1.37-2.377 2.79-4.68 4.24-6.901 2.593-0.131 5.285-0.205 8.067-0.205s5.473 0.074 8.069 0.205c1.448 2.222 2.866 4.524 4.239 6.901 1.37 2.37 2.64 4.747 3.842 7.106-1.202 2.362-2.471 4.739-3.839 7.105zm5.259-4.225c1.587 3.303 3 6.558 4.2 9.72-3.25 0.521-6.758 0.926-10.488 1.203 1.104-1.75 2.194-3.554 3.265-5.404 1.062-1.837 2.059-3.681 3.023-5.519zm-11.277 13.78c-2.068 3.019-4.182 5.854-6.293 8.444-2.109-2.591-4.22-5.426-6.294-8.444 2.095 0.088 4.196 0.138 6.294 0.138 2.099-0.001 4.201-0.05 6.293-0.138zm-17.573-2.857c-3.733-0.277-7.241-0.683-10.49-1.203 1.202-3.157 2.611-6.414 4.197-9.72 0.97 1.858 1.979 3.701 3.026 5.519 1.071 1.85 2.161 3.654 3.267 5.404zm-6.304-16.654c-1.636-3.389-3.046-6.653-4.226-9.741 3.26-0.52 6.781-0.931 10.53-1.212-1.107 1.751-2.197 3.553-3.268 5.407-1.067 1.847-2.065 3.701-3.036 5.546zm11.294-13.805c2.07-3.019 4.181-5.855 6.29-8.449 2.111 2.594 4.225 5.43 6.293 8.449-2.093-0.091-4.194-0.14-6.293-0.14-2.098 0.001-4.199 0.049-6.29 0.14zm20.837 8.259c-1.07-1.859-2.16-3.656-3.265-5.407 3.73 0.281 7.238 0.687 10.488 1.205-1.2 3.157-2.613 6.419-4.2 9.722-0.964-1.838-1.961-3.683-3.023-5.52zm-38.254-32.665c0.619-0.359 1.36-0.543 2.196-0.543 4.864 0 12.217 5.592 19.8 14.453-2.626 3.206-5.262 6.783-7.834 10.67-4.526 0.296-8.962 0.802-13.144 1.5-4.886-13.794-5.036-23.762-1.018-26.08zm-23.709 41.062c0-4.637 8.707-9.493 23.096-12.159 1.487 3.974 3.268 8.069 5.277 12.14-2.061 4.14-3.843 8.229-5.323 12.167-14.364-2.664-23.05-7.516-23.05-12.148zm25.905 41.605c-0.848 0-1.564-0.178-2.196-0.538-3.015-1.742-3.652-7.734-1.746-16.442 0.662-3.023 1.626-6.269 2.814-9.633 4.166 0.696 8.586 1.195 13.092 1.491 2.574 3.885 5.207 7.462 7.834 10.671-7.58 8.86-14.934 14.451-19.798 14.451zm46.962-16.981c1.907 8.708 1.272 14.7-1.743 16.442-0.623 0.355-1.361 0.539-2.199 0.539-4.864 0-12.217-5.592-19.798-14.452 2.628-3.209 5.262-6.786 7.837-10.671 4.508-0.296 8.927-0.795 13.093-1.491 1.186 3.365 2.153 6.61 2.81 9.633zm-1.086-12.475c-1.476-3.933-3.254-8.014-5.31-12.148 2.056-4.135 3.834-8.217 5.312-12.148 14.361 2.665 23.049 7.519 23.049 12.148 0 4.631-8.688 9.483-23.051 12.148z')
      .attr('stroke', '#74757B')
      .attr('stroke-width', width / 10)
      .attr('fill', '#74757B')
      .attr('transform', `translate(${-width / 2.4}, ${-width / 2.7}) scale(${width / 120})`)
  }
  
  return g;
}

function createMilestoneInfo(wrapper, milestone, x, y, width, height) {
  
}
