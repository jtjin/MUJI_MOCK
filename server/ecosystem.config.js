module.exports = {
	apps: [
		{
			name: 'MUJI',
			script: './server.js',
			watch: true,
			exec_mode: 'cluster',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
