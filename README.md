# ngl_customscripts
Scripts for sharing views of COX2 and STAT3.

# Viewing COX2 and STAT3 in your web browser
 - Go to the NGL Web Application -- http://nglviewer.org/ngl/ -- and load one of the simple-viewer\*.js scripts (you will have downloaded these from this repository)

# Development
## CodePen
Use CodePen, your own hosted ngl for a lot of testing (as opposed to overutilising the main ngl webserver).
- CodePen example is --> https://codepen.io/chrisbarnettster/pen/pojNoWJ
- Some info on embedding ngl in to your own webpage is here --> http://nglviewer.org/ngl/api/manual/usage/embedding.html
For CodePen

HTML
```html
<script src="https://cdn.jsdelivr.net/gh/arose/ngl@v2.0.0-dev.32/dist/ngl.js"></script>
<div id="viewport" style="width:100%; height:100%;"></div>
```
CSS
```css
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
span {
  background-color: #eee;
}

```
JAVASCRIPT
```javascript
// Create NGL Stage object
var stage = new NGL.Stage( "viewport" );
// Now paste in your awesome javascript code
```

## NGL API
- http://nglviewer.org/ngl/api/

## Examples
 - Gallery of scripts and things - http://nglviewer.org/ngl/gallery/index.html

## Dev ideas
 - make a map for all the selections. Iterate.
 - make a way for the selections to become boxes in a sensible way and share data
 - include linkout for drugs ajoene, DP
