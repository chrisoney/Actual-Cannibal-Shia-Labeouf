# Actual Cannibal Shia Labeouf

A tile-based escape game based on the tabletop system by the same name, which was based on the [song](https://www.youtube.com/watch?v=o0u4M6vppCI) by the same name.

[Live Link](https://chrisoney.github.io/Actual-Cannibal-Shia-Labeouf)

Escape each randomly-generated level by searching through logs and locating your keys. Find medicine to heal yourself and "meat" to distract Shia Labeouf. Be wary, for Shia is always ready to attack if you're unlucky. Once you've located your keys, find your car and escape to the next level.

<img src="./images/gifs/full.png" width=800 height=auto>

----------------------

### Technologies

* Javascript
* HTML5
* CSS3

----------------------

### About

**General**
Actual Cannibal Shia Labeouf was built on HTML5 canvas, and uses vector movement for the player and instances of Shia. The game contains custom pixel animations a variety of different items with unique effects. Each level is randomly generated and larger than the last, with faster and more numerous attacks from Shia. Non-essential items are randomly added to or left out of each level.

**Controls**
The player can move with either the WASD keys or the arrow keys. The spacebar is used for searching logs, interacting with the car, or switching to a new tip under the view screen. If the player has found "meat" on the level, they can use the E key to distract Shia with it. The M key can be used to mute and unmute the music.

**Difficulty**
Each level is randomly generated, though the size increases at a rate of 3 rows and columns each time. Medicine and "meat" bait are randomly added to the list of effects searching logs can have. There are more logs to search and thus more Shia Surprises for each level, and Shia's speed increases with each level as well. Currently there are ten levels, but more can be added easily using the existing functionality.

**Previews**

Distracting Shia with some "meat" the player picked up:
![](https://i.imgur.com/snlDCdC.gif)

Levels are dynamically generated:
<img src="./images/gifs/next-level.gif" width=800 height=auto>

```
while (maxTunnels && dimensions && maxLength) {
  do {
    randomDirection = directions[Math.floor(Math.random() * directions.length)];
  } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) ||
           (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));

  var randomLength = Math.ceil(Math.random() * maxLength),
      tunnelLength = 0;

  while (tunnelLength < randomLength) {
    if (((currentRow === 0) && (randomDirection[0] === -1)) ||
        ((currentColumn === 0) && (randomDirection[1] === -1)) ||
        ((currentRow === dimensions - 1) && (randomDirection[0] === 1)) ||
        ((currentColumn === dimensions - 1) && (randomDirection[1] === 1))) {
      break;
    } else {
      map[currentRow][currentColumn] = 0;
      currentRow += randomDirection[0];
      currentColumn += randomDirection[1];
      tunnelLength++;
    }
  }

  if (tunnelLength) {
    lastDirection = randomDirection;
    maxTunnels--;
  }
}
```
Utilizing the top down view of the game to consider the map from a different perspective, level generation uses a "tunnel" creation method to ensure that open spaces are all connected. This ensures that both the player and the randomly generated items are never trapped within an inaccessible space. 
