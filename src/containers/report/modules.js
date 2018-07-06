const data = [
	{
		key: '1',
		name: 'overview',
		label: '概览',
		children: [
			{
				key: '1_1',
				name: 'overview_contract',
				label: '合同信息',
				selected: true
			},
            {
				key: '1_2',
				name: 'overview_cpu',
				label: '费用总览',
				selected: true
			}
		]
	},
	{
		key: '2',
		name: 'detail',
		label: '使用详情',
		children: [
			{
				key: '2_1',
				name: 'detail_cpu',
				label: '机时流水单',
				selected: true
			},
			{
				key: '2_2',
				name: 'detail_cpu_bar',
				label: '机时使用图例',
				selected: true
			}
		]
	},
	{
		key: '3',
		name: 'job',
		label: '作业统计',
		children: [
			{
				key: '3_1',
				name: 'job_overview',
				label: '作业概况',
				selected: true
			},
			{
				key: '3_2',
				name: 'job_user_used',
				label: '用户使用情况',
				selected: true
			},
		]
	}
];

function exportSelectableModules() {
	let arr = [];
	data.forEach(function(item){
		item.children.forEach(item2 => arr.push({
			key: item2.key,
			name: item2.name,
			selected: item2.selected
		}))
	});
	return arr;
}

//原始模块结构
export const reportModules = data;

//可选的模块
export const selectableModules = exportSelectableModules()

/**
 * 导出选中的模块的值，用于后续还原成模块数据
 * @param {map} selectedModules 选中的模块的列表
 * @return {string} 选中的模块的值
 */
export function exportSelectedModules(selectedModules) {
	let str = ''
	data.forEach(function(item){
		let flags = 0
		//每一项占一位，0为未选中，1为选中
		item.children.forEach(item2 => flags = (flags<<1) + (!!selectedModules[item2.key]|0))
		str += '-' + flags
	})

	return str.substr(1)
}

/**
 * 根据导出的模块值导入选中的模块
 * @param {string} str 选中的模块值
 * @return {array} 选中的模块
 */
export function importSelectedModules(str) {
	let modules = []
	let arr = (str||'').split('-')
	data.forEach(function(item, i){
		let flags = parseInt(arr[i])
		if (!flags) {
			return
		}
		let module = {
			key: item.key,
			name: item.name,
			children: []
		}
		modules.push(module)
		for (let j = item.children.length -1; j >= 0; j--) {
			let item2 = item.children[j]
			if(flags%2){
				module.children.unshift({
					key: item2.key,
					name: item2.name
				})
			}
			flags = flags>>1
		}
	})
	return modules
}
