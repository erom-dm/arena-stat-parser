(this["webpackJsonparena-data-parser"]=this["webpackJsonparena-data-parser"]||[]).push([[15],{239:function(e,a,t){"use strict";t.r(a);var n=t(4),c=t(0),s=t(99),u=t(2);a.default=function(e){var a=e.teams,t=e.onChange,r=Object(c.useState)(),l=Object(n.a)(r,2),o=l[0],i=l[1],f=Object(c.useMemo)((function(){return a.map((function(e){return{value:e,label:e}}))}),[a]),b=Object(c.useCallback)((function(e){i(e),t&&e&&t(e.value)}),[i,t]);return Object(c.useEffect)((function(){f.length&&i((function(e){return e?null:f[0]})),b(f[0])}),[a,f,b]),Object(u.jsx)(s.a,{className:"team-select",classNamePrefix:"team-select",options:f,value:o,onChange:b})}}}]);
//# sourceMappingURL=15.cc5f0baf.chunk.js.map