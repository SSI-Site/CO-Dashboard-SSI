export const giftsMock = [
	{
		id: 1,
		name: 'Caneca SSI',
		description: 'Caneca oficial do evento',
		min_presence: 2,
		total_amount: 120,
		balance: 72,
	},
	{
		id: 2,
		name: 'Camiseta SSI',
		description: 'Camiseta comemorativa edicao 2026',
		min_presence: 4,
		total_amount: 80,
		balance: 41,
	},
	{
		id: 3,
		name: 'Sticker Pack',
		description: 'Cartela de adesivos da SSI',
		min_presence: 1,
		total_amount: 300,
		balance: 220,
	},
	{
		id: 4,
		name: 'Garrafa termica',
		description: 'Garrafa personalizada para participantes',
		min_presence: 6,
		total_amount: 50,
		balance: 19,
	},
];

export const studentGiftsMock = [
	{
		id: 101,
		student: 1,
		gift: { id: 1, name: 'Caneca SSI' },
		received: true,
	},
	{
		id: 102,
		student: 1,
		gift: { id: 2, name: 'Camiseta SSI' },
		received: false,
	},
	{
		id: 103,
		student: 2,
		gift: { id: 1, name: 'Caneca SSI' },
		received: false,
	},
	{
		id: 104,
		student: 3,
		gift: { id: 1, name: 'Caneca SSI' },
		received: true,
	},
	{
		id: 105,
		student: 3,
		gift: { id: 3, name: 'Sticker Pack' },
		received: true,
	},
	{
		id: 106,
		student: 4,
		gift: { id: 3, name: 'Sticker Pack' },
		received: false,
	},
];