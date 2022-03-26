export function catalogRenderData() {
	return function init(items, {
		page = 1,
		limit = 12,
		sort = 'alf',
		filter = ''
	}) {
		const filterData = filterFunc([...items], filter);
		const sortData = sortFunc(filterData, sort);
		return  {
			pagination: pagination(sortData, page, limit),
			pageCount: pageCount(items.length, limit),
		};
	}

	function filterFunc(items, filter) {
		if ( !filter ) {
			return items;
		}

		// фильтрация
	}

	function sortFunc(items, sort) {
		// сортировка
		return items;
	}

	function pagination(items, page, limit) {
		return items.splice( (page - 1) * limit, limit );
	}

	function pageCount(itemsLength, limit) {
		return Math.ceil(itemsLength / limit);
	}
}
