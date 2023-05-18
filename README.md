# Pathfinding and Maze Generation Visualization
This is my first attempt at visualizing the beauty of pathfinding algorithms. You can modify all major features of the algorithm through the 'control panel'. While testing the search algorithms, drawing new walls and creating new mazes got tiresome, so I decided to also add some basic random maze generation. Later on I will add some more interesting maze generation algorithms like Prim's and Kruskall's algorithms. Here I will go through the major features of this program. 

## Demo

## Basic Controls
The map is automatically created to fit the size of the browser window, so if you would like the change the size of the grid, simply enlarge/reduce the size of the window, or zoom in/out(grid breaks at 25% zoom).
The start node is green, end node is red and the walls are white

To move start or end node:
- click on the respective node to remove it from the grid and simply press anythere else. Rinse and repeat.

## Variable speed
You may change the speed of the visualization during runtime.
- By default, the speed is set to 75%.

## Creating and Moving Walls
By default, right clicking on the grid creates walls. To remove walls, press the 'Delete Wall' button on the control panel, which will remove walls when right clicking the grid. Rinse and Repeat.

## Pathfinding algorithms
- A*
  - Manhattan heuristic used
  - F Cost, G cost, H cost is displayed
- Breadth First Search
- Depth First Search
- "Random Search"
  - A basic spinoff of DFS, where neighbours of a given node are added to the stack in random order.


## Maze Generation Algorithms
- Random Maze
  - Sparse --> 15% chance any given node becomes a wall
  - Dense  --> 33% chance any given node becomes a wall
- (Not complete) Recursive division
- (Not implemented) Prim's algorithm
- (Not implemented) Kruskall's Algorithm
