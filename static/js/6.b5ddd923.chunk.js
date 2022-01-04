(this["webpackJsonparena-data-parser"]=this["webpackJsonparena-data-parser"]||[]).push([[6],{233:function(t,e,n){"use strict";n.r(e);var a=n(8),r=n(4),o=n(0),i=n(55),s=n(14),c=n(11),u=n(13),d=n.n(u),l=n(2);e.default=function(t){var e=t.selectedArenaMatches,n=t.selectedSessions,u=Object(o.useState)(s.b.perMatch),f=Object(r.a)(u,2),b=f[0],p=f[1],m=Object(o.useMemo)((function(){return Object(c.c)(e)}),[e]),g=Object(o.useMemo)((function(){return Object(c.e)(n)}),[n]),j=Object(o.useMemo)((function(){return Object(c.k)(m)}),[m]),O=j.teamRatingArr,v=j.teamMMRArr,h=j.enemyTeamCompArr,y=j.labelArr,E=j.winArray,w=Object(o.useMemo)((function(){return Object(c.k)(g)}),[g]),A=w.teamRatingArr,k=w.labelArr,x=Object(o.useMemo)((function(){return Array.from(n.keys()).map((function(t){return d.a.unix(t).format("DD/MM/YY")}))}),[n]),M={color:"#292F36",font:{size:15,family:"'Roboto', sans-serif"},stepSize:1,beginAtZero:!0},R={maintainAspectRatio:!1,scales:{"y-axis-1":{ticks:Object(a.a)(Object(a.a)({},M),{},{autoSkip:!0,maxTicksLimit:15}),bounds:"ticks",grid:{borderDashOffset:.9}},x:{ticks:Object(a.a)(Object(a.a)({},M),{},{autoSkip:!0,maxTicksLimit:20})}},plugins:{tooltip:{callbacks:{afterLabel:function(t){var e=t.dataIndex,n=t.dataset.enemyComp[e],a=t.dataset.win[e];return[n,"".concat(a?"Win":"Loss")]}}}}},C={labels:y,datasets:[{label:"New Team Rating",data:O,enemyComp:h,win:E,fill:!1,backgroundColor:"rgb(254,38,0)",borderColor:"rgb(254,131,0)",yAxisID:"y-axis-1"},{label:"MMR",data:v,enemyComp:h,win:E,fill:!1,backgroundColor:"rgb(0,196,255)",borderColor:"rgb(0,255,255)",yAxisID:"y-axis-1"}]},D=Object(a.a)(Object(a.a)({},R),{},{plugins:{tooltip:{callbacks:{afterLabel:function(t){console.dir(t);var e=t.dataIndex,n=t.dataset.data[e],a=t.dataset.sessionDates[e];return["Session #".concat(e+1," - ").concat(a),"End session rating: ".concat(n)]},title:function(){return""},label:function(){return""}}}}}),S={labels:k,datasets:[{label:"Session end team rating",data:A,sessionDates:x,fill:!1,backgroundColor:"rgb(254,38,0)",borderColor:"rgb(254,131,0)",yAxisID:"y-axis-1"}]},N=b===s.b.perMatch?{data:C,options:R}:{data:S,options:D};return Object(l.jsxs)("div",{className:"line-chart-wrap",children:[Object(l.jsxs)("div",{className:"header",children:[Object(l.jsx)("button",{onClick:function(){p((function(t){return t===s.b.perMatch?s.b.perSession:s.b.perMatch}))},children:b}),Object(l.jsx)("h1",{className:"title",children:"Team Rating Change"})]}),Object(l.jsx)("div",{className:"chart-container",children:Object(l.jsx)(i.b,{data:N.data,options:N.options})})]})}},55:function(t,e,n){"use strict";n.d(e,"a",(function(){return j})),n.d(e,"b",(function(){return g}));var a=n(0),r=n.n(a),o=n(56),i=n(57),s=n.n(i),c=n(70),u=n.n(c),d=n(71),l=n.n(d),f=n(53);function b(){return(b=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t}).apply(this,arguments)}function p(t,e){if(null==t)return{};var n,a,r={},o=Object.keys(t);for(a=0;a<o.length;a++)n=o[a],e.indexOf(n)>=0||(r[n]=t[n]);return r}var m=Object(a.forwardRef)((function(t,e){var n=t.id,i=t.className,c=t.height,d=void 0===c?150:c,f=t.width,m=void 0===f?300:f,g=t.redraw,j=void 0!==g&&g,O=t.type,v=t.data,h=t.options,y=void 0===h?{}:h,E=t.plugins,w=void 0===E?[]:E,A=t.getDatasetAtEvent,k=t.getElementAtEvent,x=t.getElementsAtEvent,M=t.fallbackContent,R=p(t,["id","className","height","width","redraw","type","data","options","plugins","getDatasetAtEvent","getElementAtEvent","getElementsAtEvent","fallbackContent"]),C=Object(a.useRef)(null),D=Object(a.useMemo)((function(){return"function"===typeof v?C.current?v(C.current):{}:s()({},v)}),[v,C.current]),S=Object(a.useState)(),N=S[0],I=S[1];Object(a.useImperativeHandle)(e,(function(){return N}),[N]);var T=function(){C.current&&I(new o.default(C.current,{type:O,data:D,options:y,plugins:w}))},L=function(){N&&N.destroy()};return Object(a.useEffect)((function(){return T(),function(){return L()}}),[]),Object(a.useEffect)((function(){j?(L(),setTimeout((function(){T()}),0)):function(){if(N){if(y&&(N.options=b({},y)),!N.config.data)return N.config.data=D,void N.update();var t=D.datasets,e=void 0===t?[]:t,n=p(D,["datasets"]),a=N.config.data.datasets,r=void 0===a?[]:a;u()(N.config.data,n),N.config.data.datasets=e.map((function(t){var e=l()(r,(function(e){return e.label===t.label&&e.type===t.type}));return e&&t.data?(e.data?e.data.length=t.data.length:e.data=[],u()(e.data,t.data),u()(e,b({},t,{data:e.data})),e):b({},t)})),N.update()}}()}),[t,D]),r.a.createElement("canvas",Object.assign({},R,{height:d,width:m,ref:C,id:n,className:i,onClick:function(t){N&&(A&&A(N.getElementsAtEventForMode(t,"dataset",{intersect:!0},!1),t),k&&k(N.getElementsAtEventForMode(t,"nearest",{intersect:!0},!1),t),x&&x(N.getElementsAtEventForMode(t,"index",{intersect:!0},!1),t))},"data-testid":"canvas",role:"img"}),M)})),g=Object(a.forwardRef)((function(t,e){return r.a.createElement(m,Object.assign({},t,{type:"line",ref:e,options:t.options||{}}))})),j=Object(a.forwardRef)((function(t,e){return r.a.createElement(m,Object.assign({},t,{type:"bar",ref:e,options:t.options||{}}))}));Object(a.forwardRef)((function(t,e){return r.a.createElement(m,Object.assign({},t,{type:"radar",ref:e,options:t.options||{}}))})),Object(a.forwardRef)((function(t,e){return r.a.createElement(m,Object.assign({},t,{type:"doughnut",ref:e,options:t.options||{}}))})),Object(a.forwardRef)((function(t,e){return r.a.createElement(m,Object.assign({},t,{type:"polarArea",ref:e,options:t.options||{}}))})),Object(a.forwardRef)((function(t,e){return r.a.createElement(m,Object.assign({},t,{type:"bubble",ref:e,options:t.options||{}}))})),Object(a.forwardRef)((function(t,e){return r.a.createElement(m,Object.assign({},t,{type:"pie",ref:e,options:t.options||{}}))})),Object(a.forwardRef)((function(t,e){return r.a.createElement(m,Object.assign({},t,{type:"scatter",ref:e,options:t.options||{}}))})),f.defaults,f.Chart}}]);
//# sourceMappingURL=6.b5ddd923.chunk.js.map