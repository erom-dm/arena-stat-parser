(this["webpackJsonparena-data-parser"]=this["webpackJsonparena-data-parser"]||[]).push([[0],{205:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(17),o=t.n(c),s=(t(77),t(78),t(79),t(2)),i=t(5),l=t(6);var u=t(72),m="instanceData";function d(e,a){localStorage.setItem(e,JSON.stringify(a))}var f,p=t(4),v="!disconnected",h="~DC~",b=(f={},Object(p.a)(f,572,"Ruins of Lordaeron"),Object(p.a)(f,562,"Blade's Edge Arena"),Object(p.a)(f,559,"Nagrand Arena"),f),j=["player1","player2","player3","player4","player5"];function O(e){var a=[];return e.forEach((function(e){var t,n,r={enteredTime:e.enteredTime,instanceID:e.instanceID,instanceName:e.instanceName,playerName:e.playerName,enemyTeamComp:[],myTeamComp:[],myTeamName:"",bracket:0,myTeam:{},enemyTeam:{},win:!1},c=function(e){var a,t,n,r,c=e.playerName;e.goldTeam.hasOwnProperty(c)?(a=e.goldTeam,r=e.goldTeam[c].teamName,t=e.purpleTeam,n=!!e.winningFaction):(a=e.purpleTeam,r=e.purpleTeam[c].teamName,t=e.goldTeam,n=!e.winningFaction);var o=Object.keys(a),s=Object.keys(t),i=o.length,l=s.length,u=Math.max(i,l);!function(e,a,t){if(e.length<t)for(var n=0;n<t-e.length;n++)e.push(h);if(a.length<t)for(var r=0;r<t-a.length;r++)a.push(h)}(o,s,u);var m={},d=[],f={},p=[];return o.forEach((function(e,t){return y(e,t,a,m,d)})),s.forEach((function(e,a){return y(e,a,t,f,p)})),{bracket:u,win:n,myTeamName:r,myTeam:m,myTeamComp:d.sort(),enemyTeam:f,enemyTeamComp:p.sort()}}(e);Object.assign(r,c),0===(null===(t=r.myTeam.player1)||void 0===t?void 0:t.teamMMR)&&0===(null===(n=r.enemyTeam.player1)||void 0===n?void 0:n.teamMMR)||a.push(r)})),a}function g(e){var a=[];return e.forEach((function(e){a.push.apply(a,Object(s.a)(e))})),a}function y(e,a,t,n,r){var c=e===h;n[j[a]]=c?null:Object(l.a)({name:e},t[e]),r.push(c?v:t[e].class)}function S(e,a,t){var n="DC"===a,r=t.instanceID,c=t.myTeam,o=t.win,s=t.bracket,i={};if(!n)for(var l=0;l<s;l++){var u=c[j[l]];u?i[u.name]={healing:u.healing,damage:u.damage}:i.DC={healing:0,damage:0}}var m,d,f=e[a];f?(f.matchCount+=1,o&&f.wins++,f.zoneStats[r]?(f.zoneStats[r].matches++,o&&f.zoneStats[r].wins++):f.zoneStats[r]={matches:1,wins:Number(o)},!n&&(m=f.performanceStats,d=i,Object.keys(m).forEach((function(e){m[e].healing+=d[e].healing,m[e].damage+=d[e].damage})))):e[a]={matchCount:1,wins:Number(o),performanceStats:i,zoneStats:Object(p.a)({},r,{matches:1,wins:Number(o)})}}var w=t(1),T=function(e){var a=e.localStoreChangeHandler,t=e.localStorageChangeValue,r=Object(n.useState)("Upload file here"),c=Object(i.a)(r,2),o=c[0],f=c[1],p=Object(n.useCallback)((function(e){e.forEach((function(n){console.dir(e);var r=new FileReader;r.onabort=function(){return f("File reading was aborted")},r.onerror=function(){return f("File reading failed")},r.onload=function(){var e,n,c=r.result;!function(e){var a=window.localStorage.getItem(m);if(a){var t=JSON.parse(a),n=[].concat(Object(s.a)(t),Object(s.a)(e)),r=Object(s.a)(new Map(n.map((function(e){return[e.enteredTime,e]}))).values());d(m,r)}else d(m,e)}((e=function(e){var a=e.lastIndexOf('["instances"] = ')+17,t=e.slice(a),n=new RegExp(/, -- \[\d+\]/,"g"),r=t.replaceAll("\n","").replaceAll("\r","").replaceAll("\t","").replaceAll('["','"').replaceAll('"]','"').replaceAll(" = ",":").replaceAll(",}","}").split(n),c=[];return r.forEach((function(e,a){try{c.push(JSON.parse(e))}catch(t){}})),c}((n=c,null===n||"string"===typeof n?'{"error":true}':(new TextDecoder).decode(new Uint8Array(n)))),e.filter((function(e){return Object.keys(b).includes(String(e.instanceID))&&e.hasOwnProperty("purpleTeam")&&e.hasOwnProperty("goldTeam")})))),a(!t),f("File successfully parsed")},r.readAsArrayBuffer(n)}))}),[a,t]),v=Object(u.a)({onDrop:p}),h=v.getRootProps,j=v.getInputProps;return Object(w.jsxs)("div",Object(l.a)(Object(l.a)({},h()),{},{className:"upload-area",children:[Object(w.jsx)("input",Object(l.a)({},j())),Object(w.jsx)("p",{children:o})]}))},x=t(71),C=t(207);function N(e,a,t){var n=t.colorStart,r=t.colorEnd;return t.useEndAsStart?r-e*a:n+e*a}function E(e,a){return(a/e*100).toFixed(1)}var A=function(e){var a,t,n=e.dataset,r=0,c=0,o=[],s=[],i=[],l=[],u=[],m=[],d={indexAxis:"y",responsive:!0,scales:{y:{ticks:{color:"#292F36",font:{size:15,family:"'Roboto', sans-serif"},stepSize:1,beginAtZero:!0}}},plugins:{tooltip:{callbacks:{afterLabel:function(e){var a=e.dataIndex,t=e.dataset.wins[a],n=e.dataset.data[a],r=e.dataset.zoneStats[a],c=e.dataset.performanceStats[a],o=E(n,t),s=[];Object.keys(r).forEach((function(e){s.push("".concat(b[Number(e)],": ").concat(E(r[e].matches,r[e].wins),"%"))}));var i=[];return Object.keys(c).forEach((function(e){var a=+(c[e].damage/n).toFixed(0),t=+(c[e].healing/n).toFixed(0).toLocaleString();i.push("".concat(e,": damage: ").concat(a.toLocaleString()," | healing: ").concat(t.toLocaleString()))})),["Wins: ".concat(t,", Losses: ").concat(n-t),"WR: ".concat(o,"%")," ","Zone win rates:"].concat(s,[" ","Average performance stats:"],i)}}},legend:{display:!1}}},f={labels:o,datasets:[{label:"",data:s,wins:i,zoneStats:l,performanceStats:u,backgroundColor:m,borderColor:[],borderWidth:1,hoverOffset:6}]},p=Object.getOwnPropertyNames(n),v=[];p.forEach((function(e){var a=n[e],t=a.matchCount,r=a.wins,c=a.zoneStats,o=a.performanceStats;v.push({teamComp:e,matchCount:t,wins:r,zoneStats:c,performanceStats:o})})),v.sort((function(e,a){return a.matchCount-e.matchCount})),v.forEach((function(e){var a=e.matchCount,t=e.wins,n=e.zoneStats,m=e.performanceStats,d=e.teamComp;r+=a,c+=t,o.push([d]),s.push(a),i.push(t),l.push(n),u.push(m)})),function(e,a,t,n){var r,c,o=t.colorStart,s=(t.colorEnd-o)/e;for(r=0;r<e;r++)c=N(r,s,t),n.push(a(c))}(v.length,C.a,{colorStart:.1,colorEnd:.85,useEndAsStart:!0},m),a=r-c,t=E(r,c);var h="Matches Played: ".concat(r,", Wins: ").concat(c,", Losses: ").concat(a,", WR: ").concat(t,"%,");return Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)("div",{className:"header",children:Object(w.jsx)("h1",{className:"title",children:h})}),Object(w.jsx)(x.a,{data:f,options:d})]})},k=t(15),D=t.n(k),F=t(70),M=t.n(F);D.a.extend(M.a);var z=t(28),I=function(e){var a=e.sessionData,t=e.onChange,r={value:0,label:"All Data"},c=Object(n.useState)([]),o=Object(i.a)(c,2),l=o[0],u=o[1],m=Object(n.useRef)(l);m.current=l,Object(n.useEffect)((function(){if(l.length){var e=!0,t=Object(s.a)(a.keys());l.map((function(e){return e.value})).forEach((function(a){t.includes(a)||(e=!1)})),e||u([])}}),[l,a]);var d=Object(s.a)(a.keys()),f=[];d.forEach((function(e,a){var t=D.a.unix(e).format("HH:mm - DD/MM/YY"),n={value:e,label:"Session ".concat(a+1,", @ ").concat(t)};f.push(n)})),f.reverse();var p=function(){var e;return(null===m||void 0===m||null===(e=m.current)||void 0===e?void 0:e.length)===f.length};return Object(w.jsx)(z.a,{className:"session-select",classNamePrefix:"session-select",defaultValue:r,isOptionSelected:function(e){var a;return(null===m||void 0===m||null===(a=m.current)||void 0===a?void 0:a.some((function(a){return a.value===e.value})))||p()},options:[r].concat(f),value:p()?[r]:l,onChange:function(e,a){var n=[],c=a.action,o=a.option,i=a.removedValue;if("select-option"===c&&(null===o||void 0===o?void 0:o.value)===r.value)u(f),n.push.apply(n,Object(s.a)(f.map((function(e){return e.value}))));else if("deselect-option"===c&&(null===o||void 0===o?void 0:o.value)===r.value||"remove-value"===c&&(null===i||void 0===i?void 0:i.value)===r.value)u([]);else if("deselect-option"===a.action&&p()){var l=f.filter((function(e){return e.value!==(null===o||void 0===o?void 0:o.value)}));u(l),n.push.apply(n,Object(s.a)(l.map((function(e){return e.value}))))}else u(e||[]),n.push.apply(n,Object(s.a)(e.map((function(e){return e.value}))));t&&t(n)},hideSelectedOptions:!1,closeMenuOnSelect:!1,isMulti:!0})};var P=function(e){var a=e.teams,t=e.onChange,r=Object(n.useState)(),c=Object(i.a)(r,2),o=c[0],s=c[1],l=a.map((function(e){return{value:e,label:e}}));Object(n.useEffect)((function(){l.length&&!o&&s(l[0]),u(l[0])}),[a]);var u=function(e){s(e),t&&e&&t(e.value)};return Object(w.jsx)(z.a,{className:"team-select",classNamePrefix:"team-select",options:l,value:o,onChange:u})},R=function(){var e=Object(n.useState)([]),a=Object(i.a)(e,2),t=a[0],r=a[1],c=Object(n.useState)([""]),o=Object(i.a)(c,2),l=o[0],u=o[1],d=Object(n.useState)(""),f=Object(i.a)(d,2),p=f[0],h=f[1],b=Object(n.useState)(new Map),j=Object(i.a)(b,2),y=j[0],x=j[1],C=Object(n.useState)([0]),N=Object(i.a)(C,2),E=N[0],k=N[1],F=Object(n.useState)(!1),M=Object(i.a)(F,2),z=M[0],R=M[1],L=Object(n.useState)({}),J=Object(i.a)(L,2),_=J[0],B=J[1];return Object(n.useEffect)((function(){var e,a=window.localStorage.getItem(m);if(a){var t=O(JSON.parse(a));r(t),u((e=t,Object(s.a)(new Set(e.map((function(e){return e.myTeamName}))))))}}),[z]),Object(n.useEffect)((function(){var e,a=(e=p,t.filter((function(a){return a.myTeamName===e})));x(function(e){var a=new Map;e.sort((function(e,a){return e.enteredTime-a.enteredTime}));var t,n=null;return e.every((function(e){if(n){var r,c=D.a.unix(t.enteredTime);if(D.a.unix(e.enteredTime).isBetween(c,c.add(1,"hour")))return null===(r=a.get(n))||void 0===r||r.push(e),t=e,!0}return n=e.enteredTime,t=e,a.set(n,[e]),!0})),a}(a)),k([0])}),[t,p]),Object(n.useEffect)((function(){var e=[];if(null===y||void 0===y?void 0:y.size)if(E.includes(0))e.push.apply(e,Object(s.a)(g(y)));else{var a=new Map;E.forEach((function(e){var t=y.get(e);t&&a.set(e,t)})),e.push.apply(e,Object(s.a)(g(a)))}e.length&&B(function(e){var a={};return e.forEach((function(e){if(e.enemyTeamComp.includes(v)||e.myTeamComp.includes(v))S(a,"DC",e);else{var t=e.enemyTeamComp.reduce((function(e,a){return e.concat(" \\ ",a)}));S(a,t,e)}})),a}(e))}),[y,E]),Object(w.jsxs)("div",{className:"dashboard",children:[Object(w.jsxs)("div",{className:"dashboard__top-bar",children:[Object(w.jsx)(T,{localStoreChangeHandler:R,localStorageChangeValue:z}),Object(w.jsxs)("div",{className:"dashboard__filters",children:[l&&Object(w.jsx)(P,{onChange:h,teams:l}),y&&Object(w.jsx)(I,{onChange:k,sessionData:y})]})]}),t&&Object(w.jsx)("div",{className:"dashboard__chart-container",children:Object(w.jsx)(A,{dataset:_})})]})};var L=function(){return Object(w.jsx)("div",{className:"main-wrap",children:Object(w.jsx)(R,{})})},J=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,208)).then((function(a){var t=a.getCLS,n=a.getFID,r=a.getFCP,c=a.getLCP,o=a.getTTFB;t(e),n(e),r(e),c(e),o(e)}))};o.a.render(Object(w.jsx)(r.a.StrictMode,{children:Object(w.jsx)(L,{})}),document.getElementById("root")),J()},78:function(e,a,t){},79:function(e,a,t){}},[[205,1,2]]]);
//# sourceMappingURL=main.6e758a8c.chunk.js.map