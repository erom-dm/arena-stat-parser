(this["webpackJsonparena-data-parser"]=this["webpackJsonparena-data-parser"]||[]).push([[13],{238:function(e,n,t){"use strict";t.r(n);var u=t(6),a=t(4),l=t(0),o=t(99),c=t(13),i=t.n(c),r=t(2);n.default=function(e){var n=e.sessionData,t=e.onChange,c=Object(l.useMemo)((function(){return{value:0,label:"All Sessions"}}),[]),s=Object(l.useState)([]),v=Object(a.a)(s,2),f=v[0],p=v[1],d=Object(l.useRef)(f);d.current=f;var b=Object(l.useMemo)((function(){return Object(u.a)(n.keys())}),[n]),O=Object(l.useMemo)((function(){return b.reduce((function(e,n,t){var u=i.a.unix(n).format("DD/MM/YY");return e.push({value:n,label:"Session ".concat(t+1," - ").concat(u)}),e}),[]).reverse()}),[b]),j=Object(l.useCallback)((function(){var e;return(null===d||void 0===d||null===(e=d.current)||void 0===e?void 0:e.length)===O.length}),[O.length]),h=Object(l.useCallback)((function(e,n){var a=[],l=n.action,o=n.option,i=n.removedValue;if("select-option"===l&&(null===o||void 0===o?void 0:o.value)===c.value)p(O),a.push.apply(a,Object(u.a)(O.map((function(e){return e.value}))));else if("deselect-option"===l&&(null===o||void 0===o?void 0:o.value)===c.value||"remove-value"===l&&(null===i||void 0===i?void 0:i.value)===c.value)p([]);else if("deselect-option"===n.action&&j()){var r=O.filter((function(e){return e.value!==(null===o||void 0===o?void 0:o.value)}));p(r),a.push.apply(a,Object(u.a)(r.map((function(e){return e.value}))))}else p(e||[]),a.push.apply(a,Object(u.a)(e.map((function(e){return e.value}))));t&&t(a)}),[j,t,O,c.value]);Object(l.useEffect)((function(){if(f.length){var e=!0;f.map((function(e){return e.value})).forEach((function(n){b.includes(n)||(e=!1)})),e||p([])}}),[f,b]),Object(l.useEffect)((function(){O.length&&p((function(e){return e?[]:[O[0]]})),h([O[0]],{action:"select-option",option:O[0]})}),[O,h]);var m=Object(l.useCallback)((function(){return j()?[c]:f}),[j,c,f]);return Object(r.jsx)(o.a,{placeholder:"Select session...",className:"session-select",classNamePrefix:"session-select",isOptionSelected:function(e){var n;return j()||(null===d||void 0===d||null===(n=d.current)||void 0===n?void 0:n.some((function(n){return n.value===e.value})))},options:[c].concat(Object(u.a)(O)),value:m(),onChange:h,hideSelectedOptions:!1,closeMenuOnSelect:!1,isMulti:!0})}}}]);
//# sourceMappingURL=13.fc778fac.chunk.js.map