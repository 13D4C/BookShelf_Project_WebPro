export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["ex01/z.txt","favicon.png","sakamoto.jpg","หนังสืออาสา.pdf"]),
	mimeTypes: {".txt":"text/plain",".png":"image/png",".jpg":"image/jpeg",".pdf":"application/pdf"},
	_: {
		client: {"start":"_app/immutable/entry/start.Dl99NrF1.js","app":"_app/immutable/entry/app.Bzhx3WCN.js","imports":["_app/immutable/entry/start.Dl99NrF1.js","_app/immutable/chunks/CPiIr9-y.js","_app/immutable/chunks/BrBxsZ45.js","_app/immutable/chunks/BkNIMPUX.js","_app/immutable/entry/app.Bzhx3WCN.js","_app/immutable/chunks/BkNIMPUX.js","_app/immutable/chunks/8GdiTE-D.js","_app/immutable/chunks/BpZ3buzO.js","_app/immutable/chunks/BpdS5ozQ.js","_app/immutable/chunks/BO1fjogy.js","_app/immutable/chunks/C8WM8afO.js","_app/immutable/chunks/Biio4a8v.js","_app/immutable/chunks/DgiSkNF1.js","_app/immutable/chunks/DU5KtJ9Q.js","_app/immutable/chunks/Cu0EAYA7.js","_app/immutable/chunks/BrBxsZ45.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/Profile",
				pattern: /^\/Profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/Register",
				pattern: /^\/Register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/Register/promax",
				pattern: /^\/Register\/promax\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/adminmanage",
				pattern: /^\/adminmanage\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/adminstore",
				pattern: /^\/adminstore\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/all",
				pattern: /^\/all\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/cart",
				pattern: /^\/cart\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/checkout",
				pattern: /^\/checkout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/details/[id]",
				pattern: /^\/details\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/main",
				pattern: /^\/main\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/managebook",
				pattern: /^\/managebook\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/managesellerbook",
				pattern: /^\/managesellerbook\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/marketdetails/[id]",
				pattern: /^\/marketdetails\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/marketplace",
				pattern: /^\/marketplace\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/payment",
				pattern: /^\/payment\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/thx",
				pattern: /^\/thx\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
