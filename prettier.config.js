module.exports = {
	plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
	semi: false,
	printWidth: 80,
	singleQuote: true,
	trailingComma: 'none',
	jsxBracketSameLine: true,
	useTabs: true,
	importOrder: ['^[[:alnum:]]', '^[./]'],
	singleAttributePerLine: false,
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	arrowParens: 'avoid'
}
