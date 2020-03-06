const VIDEO_GAME_SALES =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 900,
  height = 400,
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

const fader = color => d3.interpolateRgb(color, "#fff")(0.2),
  color = d3.scaleOrdinal(d3.schemeCategory10.map(fader)),
  format = d3.format(",d");

const treemap = d3
  .treemap()
  .size([
    width + padding.left + padding.right,
    height + padding.top + padding.bottom
  ])
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
      .attr("fill", d => color(d.data.category))
      .on("mousemove", d => {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);

        tooltip
          .html(
            `
                Name: ${d.data.name}
                <br/>
                Category: ${d.data.category}
                <br />
                Value: ${d.data.value}
                `
          )
          .attr("data-value", d.data.value)
          .style("left", `${d3.event.pageX + 10}px`)
          .style("top", `${d3.event.pageY - 28}px`);
      })
      .on("mouseout", d => {
        tooltip.style("opacity", 0);
      });

    cell
      .append("text")
      .attr("class", "tile-text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 10)
      .text(d => d);

    const categories = root.leaves().map(nodes => nodes.data.category);
    console.log(categories);

    const filteredCat = [...new Set(categories)];

    console.log(filteredCat);

    const legend = body
      .append("svg")
      .attr("id", "legend")
      .attr("width", 500);

    const legendWidth = 500;
    const LEGEND_OFFSET = 10;
    const LEGEND_RECT_SIZE = 10;
    const LEGEND_H_SPACING = 150;
    const LEGEND_V_SPACING = 10;
    const LEGEND_TEXT_X_OFFSET = 5;
    const LEGEND_TEXT_Y_OFFSET = -2;
    const legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

    const legendElem = legend
      .append("g")
      .attr("transform", "translate(60," + LEGEND_OFFSET + ")")
      .selectAll("g")
      .data(filteredCat)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        return (
          "translate(" +
          (i % legendElemsPerRow) * LEGEND_H_SPACING +
          "," +
          (Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
            LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
          ")"
        );
      });

    legendElem
      .append("rect")
      .attr("width", LEGEND_RECT_SIZE)
      .attr("height", LEGEND_RECT_SIZE)
      .attr("class", "legend-item")
      .attr("fill", d => color(d));

    legendElem
      .append("text")
      .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
      .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
      .text(d => d);
  })
  .catch(error => console.error(error));
