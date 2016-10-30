angular.module('myApp.directives')
.directive('d3Tree', function(d3) {
  return {
    restrict: 'EA',
    scope: {
      data: "=",
      label: "@",
      onClick: "&"
    },
    link: function(scope, iElement, iAttrs) {
      var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 960 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

      var i = 0,
        duration = 750,
        root;

      var tree = d3.layout.tree()
        .size([height, width]);

      var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

      var svg = d3.select(iElement[0])
          .append("svg")
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // on window resize, re-render d3 canvas
      window.onresize = function() {
        return scope.render(scope.data);
      };

      scope.$watch(function(){
          return angular.element(window)[0].innerWidth;
        }, function(){
          return scope.render(scope.data);
        }
      );

      // watch for data changes and re-render
      // scope.$watch('data', function(data) {
      //   // console.log(newVals , oldVals)
      //   return scope.render(data[0]);
      // }, true);

      // Render the current

      // d3.select(self.frameElement).style("height", "500px");
      root = scope.data;
      root.x0 = height / 2;
      root.y0 = 0;
      // -------------------------

      // Toggle children display on click
      var click = function (d) {
        if (d.children) {
        d._children = d.children;
        d.children = null;
        } else {
        d.children = d._children;
        d._children = null;
        }
        scope.render(d);
      };

      // -------------------------------------------------------------------------------------------------
      // define render function
      // -------------------------------------------------------------------------------------------------
      scope.render = function(source){

          // Compute the new tree layout.
          var nodes = tree.nodes(root),
          links = tree.links(nodes);

          // Normalize for fixed-depth
          nodes.forEach(function(d) { d.y = d.depth * 180; });

          // Update the nodes
          var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

          // Enter any new nodes at the parent's previous position
          var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function(d){
              // render immediate children
              click(d);
              // pass the item that was clicked as input argument to the 'on-click' callback function
              // defined in the d3-tree directive
              return scope.onClick({item: d});
            });

          nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", "#fff");
            // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

          nodeEnter.append("text")
            .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.title; })
            .style("fill-opacity", 1e-6);

          // Transition nodes to their new position
          var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

          nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function(d) {
              if (d.completed) {
                return "green";
              } else {
                return "#fff";
              }
            });

          nodeUpdate.select("text")
            .style("fill-opacity", 1);

          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

          nodeExit.select("circle")
            .attr("r", 1e-6);

          nodeExit.select("text")
            .style("fill-opacity", 1e-6);

          // Update the links…
          var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

          // Enter any new links at the parent's previous position.
          link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
            });

          // Transition links to their new position
          link.transition()
            .duration(duration)
            .attr("d", diagonal);

          // Transition exiting nodes to the parent's new position
          link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
            })
            .remove();

          // Stash the old positions for transition
          nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
          });
        }
        //----------------------------------------------------------------------------------------------

      scope.render(root);

    } // end of link
  }; // end of return
}); // end of directive


