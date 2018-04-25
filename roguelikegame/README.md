# AlysCole's FreeCodeCamp Project: Build a Roguelike Game
For this project, I decided to go the ASCII route, the design inspired by games such as Nethack. The game, in the end, should be rendered with no images whatsoever.

The premise of the game is that it will act, in essence, like a regular dungeon crawler. There are HP boosts, monsters, and weapons.

## Installation

Because of the way I've set up my FreeCodeCamp projects' repo, you'll have to do a sparse clone to pull this particular project.

```
mkdir roguelike-game 
cd roguelike-game
git init
git remote add -f origin https://github.com/AlysCole/freecodecamp.git
git config core.sparseCheckout true
echo "roguelike-game/" >> .git/info/sparse-checkout
git pull origin master
```

## Running

You'll need to have the dependencies installed through `npm`. Make sure you have [`npm`](https://github.com/npm/npm) installed before proceeding.

Once `npm` is installed, you can install the dependencies through this command:

```
npm install
```

This will install the dependencies locally.

Make sure you have `npm` in your `PATH` before running:

```
webpack -p
```

Open your favorite web browser and navigate to the `index.html` in the project folder.

The game can also be viewed through Github Pages at [https://alyscole.github.io/freecodecamp/roguelike-game].
