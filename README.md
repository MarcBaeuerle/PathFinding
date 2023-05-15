# Pathfinding and Maze Generation Visualization
This is my first attempt at visualizing the beauty of pathfinding algorithms. You can modify all major features of the algorithm through the 'control panel'. While testing the search algorithms, drawing new walls and creating new mazes got tiresome, so I decided to also add a variety of maze creation algorithms which I found interesting. Here I will go through the major features of this program.

## Basic Controls
The map is automatically created to fit the size of the browser window, so if you would like the change the size of the grid, simply enlarge/reduce the size of the window, or zoom in/out(grid breaks at 25% zoom).
The start node is green, end node is red and the walls are white

To move start or end node:
- click on the respective node to remove it from the grid and simply press anythere else. Rinse and repeat.

## (TODO) Diagonal Movement
Both diagonal and non-diagonal movement is supported, simply check the 'diagonal' box at the left side of the control panel.

## Variable speed
You may change the speed of the bisualization during runtime.
- By default, the speed is set to 75%.


## Pathfinding algorithms
- A*
- Breadth First Search
- Depth First Search
- "Random Search"
  - A basic spinoff of DFS, where neigbhours of a given node are added to the stack in random order.s


## Maze Generation Algorithms
- Random Maze
  - Sparse --> 15% chance any given node becomes a wall
  - Dense  --> 33% chance any given node becomes a wall
- (TODO) Recursive division
- (TODO) Prim's algorithm
- (TODO) Kruskalls Algorithm
