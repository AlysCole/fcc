!function(n){function t(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var e={};t.m=n,t.c=e,t.i=function(n){return n},t.d=function(n,e,r){t.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:r})},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="/mnt/DATA/Programming/FreeCodeCamp/roguelike-game/assets",t(t.s=28)}({28:function(n,t,e){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},o="function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?function(n){return void 0===n?"undefined":r(n)}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":void 0===n?"undefined":r(n)},i={};i.getAdjacentCells=function(n,t,e,r){var o=[];return e[t-1]&&null!=e[t-1][n]&&o.push({x:n,y:t-1,cell:e[t-1][n],direction:"n"}),e[t]&&null!=e[t][n+1]&&o.push({x:n+1,y:t,cell:e[t][n+1],direction:"e"}),e[t+1]&&null!=e[t+1][n]&&o.push({x:n,y:t+1,cell:e[t+1][n],direction:"s"}),e[t]&&null!=e[t][n-1]&&o.push({x:n-1,y:t,cell:e[t][n-1],direction:"w"}),r||(e[t-1]&&null!=e[t-1][n-1]&&o.push({x:n-1,y:t-1,cell:e[t-1][n-1],direction:"nw"}),e[t-1]&&null!=e[t-1][n+1]&&o.push({x:n+1,y:t-1,cell:e[t-1][n+1],direction:"ne"}),e[t+1]&&null!=e[t+1][n+1]&&o.push({x:n+1,y:t+1,cell:e[t+1][n+1],direction:"se"}),e[t+1]&&null!=e[t+1][n-1]&&o.push({x:n-1,y:t+1,cell:e[t+1][n-1],direction:"sw"})),o},i.getRandomPointWithin=function(n,t,e,r){return{x:Math.randomBetween(n,t),y:Math.randomBetween(e,r)}},i.getRandomMatchingCellWithin=function(n,t,e,r,o,i){for(var u={x:Math.randomBetween(n,t),y:Math.randomBetween(e,r)};i[u.y][u.x].type!=o;)u={x:Math.randomBetween(n,t),y:Math.randomBetween(e,r)};return u},i.randomDirection=function(){return Math.randomBetween(0,1)?"x":"y"},i.calculateApproxDistance=function(n,t,e,r){return Math.sqrt(Math.pow(e-n,2)+Math.pow(r-t,2))},i.determinePath=function(n,t,e,r,u){var l=[],c=[];if(n==e&&t==r)return[];var a=function(n,t,e){var r=!0,o=!1,i=void 0;try{for(var u,l=e[Symbol.iterator]();!(r=(u=l.next()).done);r=!0){var c=u.value;if(c.x==n&&c.y==t)return c}}catch(n){o=!0,i=n}finally{try{!r&&l.return&&l.return()}finally{if(o)throw i}}return!1},f=function(n,t){for(var e in t)if(t[e].x==n.x&&t[e].y==n.y)return t[e].f>n.f?(t[e].g=n.g,t[e].h=n.h,t[e].f=n.f,t[e].parent=n.parent,t):t;return t.push(n),t},y={x:n,y:t,g:0,h:10*i.calculateApproxDistance(n,t,e,r)};y.f=y.g+y.h,c.push(y);for(var p=!0;p;){var d=function(){if(console.log("Length of open:",c.length),c.length<1)return p=!1,{v:!1};var n=c.reduce(function(n,t){return n?t.f<n.f?t:t.f==n.f?t:n:t},null);if(console.log("Current:",n),c.splice(c.indexOf(n),1),l=f(n,l),n.x==e&&n.y==r){for(var t=!0,o=[],y=n;t;)o.unshift(y),y.parent?y=y.parent:t=!1;return p=!1,{v:o}}var d=i.getAdjacentCells(n.x,n.y,u);d=d.filter(function(n){return!a(n.x,n.y,l)&&("corridor"==n.cell.type||"room"==n.cell.type)}),d=d.map(function(t){var o={x:t.x,y:t.y,g:n.g,h:0,f:0,parent:n};return o.g+="n"==t.direction||"e"==t.direction||"s"==t.direction||"w"==t.direction?10:15,o.h=10*i.calculateApproxDistance(t.x,t.y,e,r),o.f=o.g+o.h,o}),d.forEach(function(n){c=f(n,c)})}();if("object"===(void 0===d?"undefined":o(d)))return d.v}},n.exports=i}});
//# sourceMappingURL=Grid.js.map