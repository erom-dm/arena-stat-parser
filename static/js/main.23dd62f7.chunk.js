(this["webpackJsonparena-data-parser"]=this["webpackJsonparena-data-parser"]||[]).push([[0],{183:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(61),s=a.n(c),o=(a(71),a(72),a(73),a(9)),l=a(5);var i=a(66),u=a(3),d="instanceData";var m="!disconnected",f="Sl\xedt",p=[572,562,559],b=["player1","player2","player3","player4","player5"];function h(e){var t=e.filter((function(e){return p.includes(e.instanceID)&&e.playerName===f&&e.hasOwnProperty("purpleTeam")&&e.hasOwnProperty("goldTeam")})),a=[];return t.forEach((function(e){var t={enteredTime:e.enteredTime,instanceID:e.instanceID,instanceName:e.instanceName,playerName:e.playerName,enemyTeamComp:[],myTeamComp:[],bracket:0,myTeam:{},enemyTeam:{},win:!1},n=function(e){var t,a,n;e.goldTeam.hasOwnProperty(f)?(t=e.goldTeam,a=e.purpleTeam,n=!!e.winningFaction):(t=e.purpleTeam,a=e.goldTeam,n=!e.winningFaction);var r=Object.keys(t),c=Object.keys(a),s=r.length,o=c.length,l=Math.max(s,o);!function(e,t,a){if(e.length<a)for(var n=0;n<a-e.length;n++)e.push(null);if(t.length<a)for(var r=0;r<a-t.length;r++)t.push(null)}(r,c,l);var i={},u=[],d={},m=[];return r.forEach((function(e,a){return j(e,a,t,i,u)})),c.forEach((function(e,t){return j(e,t,a,d,m)})),{bracket:l,win:n,myTeam:i,myTeamComp:u.sort(),enemyTeam:d,enemyTeamComp:m.sort()}}(e);Object.assign(t,n),a.push(t)})),a}function j(e,t,a,n,r){var c=null===e;n[b[t]]=c?null:Object(l.a)({name:e},a[e]),r.push(c?m:a[e].class)}function O(e,t,a){e[t]?(e[t].matchCount+=1,a.win&&e[t].wins++):e[t]={matchCount:1,wins:Number(a.win)}}var v=a(1),g=function(e){var t=e.lcHandler,a=e.lcVal,r=Object(n.useState)("Upload file here"),c=Object(o.a)(r,2),s=c[0],m=c[1],f=Object(n.useCallback)((function(e){e.forEach((function(e){var n=new FileReader;n.onabort=function(){return m("File reading was aborted")},n.onerror=function(){return m("File reading failed")},n.onload=function(){var e,r=n.result;!function(e){var t=window.localStorage.getItem(d);if(t){var a=JSON.parse(t),n=[].concat(Object(u.a)(a),Object(u.a)(e)),r=Object(u.a)(new Map(n.map((function(e){return[e.enteredTime,e]}))).values());localStorage.setItem(d,JSON.stringify(r))}else localStorage.setItem(d,JSON.stringify(e))}(h(function(e){var t=e.lastIndexOf('["instances"] = ')+17,a=e.slice(t),n=new RegExp(/, -- \[\d+\]/,"g"),r=a.replaceAll("\n","").replaceAll("\r","").replaceAll("\t","").replaceAll('["','"').replaceAll('"]','"').replaceAll(" = ",":").replaceAll(",}","}").split(n),c=[];return r.forEach((function(e,t){try{c.push(JSON.parse(e))}catch(a){}})),c}(null===(e=r)||"string"===typeof e?'{"error":true}':(new TextDecoder).decode(new Uint8Array(e))))),t(!a),m("File successfully parsed")},n.readAsArrayBuffer(e)}))}),[t,a]),p=Object(i.a)({onDrop:f}),b=p.getRootProps,j=p.getInputProps;return Object(v.jsxs)("div",Object(l.a)(Object(l.a)({},b()),{},{className:"upload-area",children:[Object(v.jsx)("input",Object(l.a)({},j())),Object(v.jsx)("p",{children:s})]}))},y=a(65),w=a(185);function x(e,t,a){var n=a.colorStart,r=a.colorEnd;return a.useEndAsStart?r-e*t:n+e*t}var C=function(e){var t=e.dataset,a=0,n=[],r=[],c=[],s=[],o={labels:n,datasets:[{label:"",data:r,wins:c,backgroundColor:s,borderColor:[],borderWidth:1,hoverOffset:6}]},l=Object.getOwnPropertyNames(t),i=[];l.forEach((function(e){var a=t[e],n=a.matchCount,r=a.wins;i.push({teamComp:e,matchCount:n,wins:r})})),i.sort((function(e,t){return t.matchCount-e.matchCount})),i.forEach((function(e){var t=e.matchCount,s=e.wins,o=e.teamComp;a+=t,n.push([o]),r.push(t),c.push(s)})),function(e,t,a,n){var r,c,s=a.colorStart,o=(a.colorEnd-s)/e;for(r=0;r<e;r++)c=x(r,o,a),n.push(t(c))}(i.length,w.a,{colorStart:.1,colorEnd:.85,useEndAsStart:!0},s);var u="Matches Played: ".concat(a);return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)("div",{className:"header",children:Object(v.jsx)("h1",{className:"title",children:u})}),Object(v.jsx)(y.a,{data:o,options:{indexAxis:"y",responsive:!0,scales:{y:{ticks:{color:"#292F36",font:{size:15,family:"'Roboto', sans-serif"},stepSize:1,beginAtZero:!0}}},plugins:{tooltip:{callbacks:{afterLabel:function(e){var t=e.dataIndex,a=e.dataset.wins[t],n=e.dataset.data[t],r=(a/n*100).toFixed(1);return["Wins: ".concat(a,", Losses: ").concat(n-a),"WR: ".concat(r,"%")]}}},legend:{display:!1}}}})]})},T=function(e){var t=Object(n.useState)([]),a=Object(o.a)(t,2),r=a[0],c=a[1],s=Object(n.useState)(!1),l=Object(o.a)(s,2),i=l[0],u=l[1],f=Object(n.useState)({}),p=Object(o.a)(f,2),b=p[0],h=p[1];return Object(n.useEffect)((function(){return function(e){var t=window.localStorage.getItem(d);t&&e(JSON.parse(t))}(c)}),[i]),Object(n.useEffect)((function(){return h(function(e){var t={};return e.forEach((function(e){var a=e.enemyTeamComp.includes(m)||e.myTeamComp.includes(m),n=e.enemyTeamComp.reduce((function(e,t){return e.concat(" \\ ",t)}));O(t,a?"DC":n,e)})),t}(r))}),[r]),Object(v.jsxs)("div",{className:"dashboard",children:[Object(v.jsxs)("div",{className:"dashboard__top-bar",children:[Object(v.jsx)(g,{lcHandler:u,lcVal:i}),Object(v.jsxs)("div",{className:"dashboard__filters",children:[Object(v.jsx)("div",{className:"dashboard__filters-btn",onClick:function(){},children:"All data"}),Object(v.jsx)("div",{className:"dashboard__filters-btn",children:"Last session"})]})]}),r&&Object(v.jsx)("div",{className:"dashboard__chart-container",children:Object(v.jsx)(C,{dataset:b})})]})};var N=function(){return Object(v.jsx)("div",{className:"main-wrap",children:Object(v.jsx)(T,{})})},S=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,186)).then((function(t){var a=t.getCLS,n=t.getFID,r=t.getFCP,c=t.getLCP,s=t.getTTFB;a(e),n(e),r(e),c(e),s(e)}))};s.a.render(Object(v.jsx)(r.a.StrictMode,{children:Object(v.jsx)(N,{})}),document.getElementById("root")),S()},72:function(e,t,a){},73:function(e,t,a){}},[[183,1,2]]]);
//# sourceMappingURL=main.23dd62f7.chunk.js.map