const users = [
	new User('1', 'Jon Doe', 20, 'jon.doe@mail.com', '+380 97 123 4567', '4029-6100-1234-4321', 10000, []),
	new User('2', 'Ivan Balda', 35, 'ivan.balda@mail.com', '+38 097-38-91-123', '4029-6100-1234-0987', 500, []),
	new User('3', 'Ben Smith', 46, 'ben.smith@mail.com', '+380979876543', '4029-6100-1234-5555', 10000, []),
];

const companies = [
	new Company('1', 'Google', [], 1000000),
	new Company('2', 'NovaPoshta', [], 10000),
];

const cars = [
	new Car('1', 'Tesla model x', true, 100000, []),
	new Car('2', 'Ford Mustang', true, 50000, []),
	new Car('3', 'Jeguli', true, 1000, []),
];

const buttons = [
	{btnId: 'btn-users', value: 'Show Users', dataId: '1', objs: users, name: 'users'},
	{btnId: 'btn-companies', value: 'Show Companies', dataId: '2', objs: companies, name: 'companies'},
	{btnId: 'btn-cars', value: 'Show Cars', dataId: '3', objs: cars, name: 'cars'},
]