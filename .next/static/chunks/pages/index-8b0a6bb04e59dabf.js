(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(7246)}])},2602:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{default:function(){return i},noSSR:function(){return u}});const r=n(8754),l=n(5893),s=(n(7294),r._(n(5491))),o=!1;function a(e){return{default:(null==e?void 0:e.default)||e}}function u(e,t){if(delete t.webpack,delete t.modules,!o)return e(t);const n=t.loading;return()=>(0,l.jsx)(n,{error:null,isLoading:!0,pastDelay:!1,timedOut:!1})}function i(e,t){let n=s.default,r={loading:e=>{let{error:t,isLoading:n,pastDelay:r}=e;return null}};e instanceof Promise?r.loader=()=>e:"function"===typeof e?r.loader=e:"object"===typeof e&&(r={...r,...e}),r={...r,...t};const l=r.loader;return r.loadableGenerated&&(r={...r,...r.loadableGenerated},delete r.loadableGenerated),"boolean"!==typeof r.ssr||r.ssr?n({...r,loader:()=>null!=l?l().then(a):Promise.resolve(a((()=>null)))}):(delete r.webpack,delete r.modules,u(n,r))}("function"===typeof t.default||"object"===typeof t.default&&null!==t.default)&&"undefined"===typeof t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},1159:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"LoadableContext",{enumerable:!0,get:function(){return r}});const r=n(8754)._(n(7294)).default.createContext(null)},5491:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return p}});const r=n(8754)._(n(7294)),l=n(1159);const s=[],o=[];let a=!1;function u(e){let t=e(),n={loading:!0,loaded:null,error:null};return n.promise=t.then((e=>(n.loading=!1,n.loaded=e,e))).catch((e=>{throw n.loading=!1,n.error=e,e})),n}function i(e,t){let n=Object.assign({loader:null,loading:null,delay:200,timeout:null,webpack:null,modules:null},t),s=null;function u(){if(!s){const t=new d(e,n);s={getCurrentValue:t.getCurrentValue.bind(t),subscribe:t.subscribe.bind(t),retry:t.retry.bind(t),promise:t.promise.bind(t)}}return s.promise()}if(!a){const e=n.webpack?n.webpack():n.modules;e&&o.push((t=>{for(const n of e)if(t.includes(n))return u()}))}function i(e,t){!function(){u();const e=r.default.useContext(l.LoadableContext);e&&Array.isArray(n.modules)&&n.modules.forEach((t=>{e(t)}))}();const o=r.default.useSyncExternalStore(s.subscribe,s.getCurrentValue,s.getCurrentValue);return r.default.useImperativeHandle(t,(()=>({retry:s.retry})),[]),r.default.useMemo((()=>{return o.loading||o.error?r.default.createElement(n.loading,{isLoading:o.loading,pastDelay:o.pastDelay,timedOut:o.timedOut,error:o.error,retry:s.retry}):o.loaded?r.default.createElement((t=o.loaded)&&t.default?t.default:t,e):null;var t}),[e,o])}return i.preload=()=>u(),i.displayName="LoadableComponent",r.default.forwardRef(i)}class d{promise(){return this._res.promise}retry(){this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};const{_res:e,_opts:t}=this;e.loading&&("number"===typeof t.delay&&(0===t.delay?this._state.pastDelay=!0:this._delay=setTimeout((()=>{this._update({pastDelay:!0})}),t.delay)),"number"===typeof t.timeout&&(this._timeout=setTimeout((()=>{this._update({timedOut:!0})}),t.timeout))),this._res.promise.then((()=>{this._update({}),this._clearTimeouts()})).catch((e=>{this._update({}),this._clearTimeouts()})),this._update({})}_update(e){this._state={...this._state,error:this._res.error,loaded:this._res.loaded,loading:this._res.loading,...e},this._callbacks.forEach((e=>e()))}_clearTimeouts(){clearTimeout(this._delay),clearTimeout(this._timeout)}getCurrentValue(){return this._state}subscribe(e){return this._callbacks.add(e),()=>{this._callbacks.delete(e)}}constructor(e,t){this._loadFn=e,this._opts=t,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}}function c(e){return i(u,e)}function f(e,t){let n=[];for(;e.length;){let r=e.pop();n.push(r(t))}return Promise.all(n).then((()=>{if(e.length)return f(e,t)}))}c.preloadAll=()=>new Promise(((e,t)=>{f(s).then(e,t)})),c.preloadReady=e=>(void 0===e&&(e=[]),new Promise((t=>{const n=()=>(a=!0,t());f(o,e).then(n,n)}))),window.__NEXT_PRELOADREADY=c.preloadReady;const p=c},7246:function(e,t,n){"use strict";n.r(t);var r=n(5893),l=n(7294),s=n(5152),o=n.n(s),a=n(9008),u=n.n(a);const i=o()((()=>Promise.all([n.e(538),n.e(847),n.e(202),n.e(7)]).then(n.bind(n,1007))),{loadableGenerated:{webpack:()=>[1007]},ssr:!1});t.default=class extends l.Component{constructor(e){super(e)}render(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(u(),{children:[(0,r.jsx)("title",{children:"Scan and upload documents in browsers | Dynamic Web TWAIN sample code | React"}),(0,r.jsx)("meta",{charSet:"utf-8"}),(0,r.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),(0,r.jsx)("link",{rel:"icon",type:"image/x-icon",href:"favicon.ico"}),(0,r.jsx)("link",{href:"assets/Styles/fonts.css",type:"text/css",rel:"stylesheet"}),(0,r.jsx)("link",{href:"assets/Styles/style.css",type:"text/css",rel:"stylesheet"})]}),(0,r.jsx)(i,{})]})}}},5152:function(e,t,n){e.exports=n(2602)},9008:function(e,t,n){e.exports=n(3867)}},function(e){e.O(0,[888,774,179],(function(){return t=8312,e(e.s=t);var t}));var t=e.O();_N_E=t}]);