const VIDEO_GAME_SALES =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 940,
  height = 550,
  padding = {
    right: 20,
    left: 20,
    bottom: 20,
    top: 20
  };

const body = d3.select("body");

const heading = body.append("heading").attr("class", "heading");

const title = heading
  .append("h1")
  .text("Video Game Sales")
  .attr("id", "title");

const description = heading
  .append("h2")
  .text("Top 100 Most Sold Video Games Grouped by Platform")
  .attr("id", "description");

const tooltip = body
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const svg = body
  .append("svg")
  .attr("id", "viz")
  .attr("width", width + padding.left + padding.right)
  .attr("height", height + padding.top + padding.bottom);

const treemap = d3
  .treemap()
  .size([width, height])
  .paddingInner(1);

d3.json(VIDEO_GAME_SALES)
  .then(data => {
    console.log(data);

    const root = d3
      .hierarchy(data)
      .eachBefore(d => {
        d.data.id = d.parent ? `${d.parent.data.id}.` : d.data.name;
      })
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);

    const cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

    const tile = cell
      .append("rect")
      .attr("id", d => d.data.id)
      .attr("class", "tile")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("fill", "green");
  })
  .catch(error => console.error(error.message));
