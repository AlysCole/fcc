# AlysCole's FreeCodeCamp Project: Build a Roguelike Game
For this project, I decided to go the ASCII route, the design inspired by games such as Nethack. The game, in the end, should be rendered with no images whatsoever.

The premise of the game is that it will act, in essence, like a regular dungeon crawler. There are HP boosts, monsters, and weapons.

## Installation

Because of the way I've set up my FreeCodeCamp projects' repo, you'll have to do a sparse clone to pull this particular project.

```
mkdir <repo>
cd <repo>
git init
git remote add -f origin https://github.com/AlysCole/freecodecamp.git
git config core.sparseCheckout true
echo "roguelike-game/" >> .git/info/sparse-checkout
git pull origin master
```
