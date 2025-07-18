import { describe, it, expect } from 'vitest';
import { type GameSchema, payoutSchema, type PayoutSchema } from './schemas';
describe('calcPayouts', () => {
	it('should calculate a simple payout between two players', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 100, cashOut: 200 },
				{ name: 'Bob', cashIn: 100, cashOut: 0 }
			]
		};

		const result = payoutSchema.parse(game);

		const expected: PayoutSchema = {
			players: [
				{
					name: 'Bob',
					cashIn: 100,
					cashOut: 0,
					net: -100,
					paidBy: [{ target: 'Alice', value: 100 }],
					paidTo: []
				},
				{
					name: 'Alice',
					cashIn: 100,
					cashOut: 200,
					net: 100,
					paidBy: [],
					paidTo: [{ target: 'Bob', value: 100 }]
				}
			],
			slippage: 0
		};

		expect(result).toEqual(expected);
	});

	it('should handle a scenario where one player pays multiple others', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 50, cashOut: 150 },
				{ name: 'Bob', cashIn: 50, cashOut: 100 },
				{ name: 'Charlie', cashIn: 200, cashOut: 50 }
			]
		};

		const result = payoutSchema.parse(game);

		const charlie = result.players.find((p) => p.name === 'Charlie');
		const alice = result.players.find((p) => p.name === 'Alice');
		const bob = result.players.find((p) => p.name === 'Bob');

		expect(charlie?.net).toBe(-150);
		expect(charlie?.paidBy).toHaveLength(2);

		expect(charlie?.paidBy).toContainEqual({ target: 'Alice', value: 100 });
		expect(charlie?.paidBy).toContainEqual({ target: 'Bob', value: 50 });

		expect(alice?.paidTo).toContainEqual({ target: 'Charlie', value: 100 });
		expect(bob?.paidTo).toContainEqual({ target: 'Charlie', value: 50 });
	});

	it('should handle a scenario where multiple players pay a single winner', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 100, cashOut: 250 },
				{ name: 'Bob', cashIn: 100, cashOut: 0 },
				{ name: 'Charlie', cashIn: 50, cashOut: 0 }
			]
		};

		const result = payoutSchema.parse(game);
		const alice = result.players.find((p) => p.name === 'Alice');
		const bob = result.players.find((p) => p.name === 'Bob');
		const charlie = result.players.find((p) => p.name === 'Charlie');

		expect(alice?.net).toBe(150);
		expect(alice?.paidTo).toHaveLength(2);
		expect(alice?.paidTo).toContainEqual({ target: 'Bob', value: 100 });
		expect(alice?.paidTo).toContainEqual({ target: 'Charlie', value: 50 });

		expect(bob?.paidBy).toEqual([{ target: 'Alice', value: 100 }]);
		expect(charlie?.paidBy).toEqual([{ target: 'Alice', value: 50 }]);
	});

	it('should correctly handle players with zero net change', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 100, cashOut: 150 },
				{ name: 'Bob', cashIn: 100, cashOut: 100 },
				{ name: 'Charlie', cashIn: 100, cashOut: 50 }
			]
		};

		const result = payoutSchema.parse(game);

		const expected: PayoutSchema = {
			players: [
				{
					name: 'Alice',
					cashIn: 100,
					cashOut: 150,
					net: 50,
					paidBy: [],
					paidTo: [{ target: 'Charlie', value: 50 }]
				},
				{
					name: 'Bob',
					cashIn: 100,
					cashOut: 100,
					net: 0,
					paidBy: [],
					paidTo: []
				},
				{
					name: 'Charlie',
					cashIn: 100,
					cashOut: 50,
					net: -50,
					paidBy: [{ target: 'Alice', value: 50 }],
					paidTo: []
				}
			],
			slippage: 0
		};

		result.players.sort((a, b) => a.name.localeCompare(b.name));
		expected.players.sort((a, b) => a.name.localeCompare(b.name));

		expect(result).toEqual(expected);
	});

	it('should produce a valid payout structure for a complex multi-way pot', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 200, cashOut: 450 },
				{ name: 'Bob', cashIn: 300, cashOut: 0 },
				{ name: 'Charlie', cashIn: 100, cashOut: 200 },
				{ name: 'Dave', cashIn: 150, cashOut: 50 },
				{ name: 'Eve', cashIn: 50, cashOut: 100 }
			]
		};

		const result = payoutSchema.parse(game);

		const alice = result.players.find((p) => p.name === 'Alice');
		const bob = result.players.find((p) => p.name === 'Bob');
		const charlie = result.players.find((p) => p.name === 'Charlie');
		const dave = result.players.find((p) => p.name === 'Dave');
		const eve = result.players.find((p) => p.name === 'Eve');

		expect(bob?.paidBy).toContainEqual({ target: 'Alice', value: 250 });
		expect(bob?.paidBy).toContainEqual({ target: 'Charlie', value: 50 });

		expect(dave?.paidBy).toContainEqual({ target: 'Charlie', value: 50 });
		expect(dave?.paidBy).toContainEqual({ target: 'Eve', value: 50 });

		expect(alice?.paidTo).toContainEqual({ target: 'Bob', value: 250 });
		expect(charlie?.paidTo).toContainEqual({ target: 'Bob', value: 50 });
		expect(charlie?.paidTo).toContainEqual({ target: 'Dave', value: 50 });
		expect(eve?.paidTo).toContainEqual({ target: 'Dave', value: 50 });
	});

	it('should correctly handle a game with positive slippage', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 100, cashOut: 150 },
				{ name: 'Bob', cashIn: 100, cashOut: 40 }
			]
		};

		const result = payoutSchema.parse(game);
		expect(result.slippage).toBe(10);
		const alice = result.players.find((p) => p.name === 'Alice');
		const bob = result.players.find((p) => p.name === 'Bob');

		expect(alice?.net).toBeCloseTo(55);
		expect(bob?.net).toBeCloseTo(-55);
		expect(bob?.paidBy).toEqual([{ target: 'Alice', value: 55 }]);
		expect(alice?.paidTo).toEqual([{ target: 'Bob', value: 55 }]);
	});

	it('should correctly handle a game with negative slippage (house rake)', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 100, cashOut: 150 },
				{ name: 'Bob', cashIn: 100, cashOut: 60 }
			]
		};

		const result = payoutSchema.parse(game);
		expect(result.slippage).toBe(-10);
		const alice = result.players.find((p) => p.name === 'Alice');
		const bob = result.players.find((p) => p.name === 'Bob');

		expect(alice?.net).toBeCloseTo(45);
		expect(bob?.net).toBeCloseTo(-45);
		expect(bob?.paidBy).toEqual([{ target: 'Alice', value: 45 }]);
		expect(alice?.paidTo).toEqual([{ target: 'Bob', value: 45 }]);
	});

	it('should handle floating point values correctly', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 50.5, cashOut: 100.25 },
				{ name: 'Bob', cashIn: 75.25, cashOut: 25.75 }
			]
		};
		const result = payoutSchema.parse(game);

		expect(result.slippage).toBeCloseTo(-0.25);

		const alice = result.players.find((p) => p.name === 'Alice');
		const bob = result.players.find((p) => p.name === 'Bob');

		expect(alice?.net).toBeCloseTo(49.625);
		expect(bob?.net).toBeCloseTo(-49.625);
		expect(bob?.paidBy[0].value).toBeCloseTo(49.625);
		expect(alice?.paidTo[0].value).toBeCloseTo(49.625);
	});

	it('should handle a game where everyone breaks even', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Alice', cashIn: 100, cashOut: 100 },
				{ name: 'Bob', cashIn: 50, cashOut: 50 }
			]
		};
		const result = payoutSchema.parse(game);
		expect(result.slippage).toBe(0);
		result.players.forEach((p) => {
			expect(p.net).toBe(0);
			expect(p.paidBy).toEqual([]);
			expect(p.paidTo).toEqual([]);
		});
	});

	it('should handle a zero-sum game with many players', () => {
		const game: GameSchema = {
			players: [
				{ name: 'A', cashIn: 10, cashOut: 20 },
				{ name: 'B', cashIn: 10, cashOut: 0 },
				{ name: 'C', cashIn: 20, cashOut: 40 },
				{ name: 'D', cashIn: 20, cashOut: 0 },
				{ name: 'E', cashIn: 30, cashOut: 60 },
				{ name: 'F', cashIn: 30, cashOut: 0 }
			]
		};
		const result = payoutSchema.parse(game);
		expect(result.slippage).toBe(0);
		const sumOfNets = result.players.reduce((acc, p) => acc + p.net, 0);
		expect(sumOfNets).toBeCloseTo(0);

		const f = result.players.find((p) => p.name === 'F');
		expect(f?.net).toBe(-30);
		expect(f?.paidBy).toEqual([{ target: 'E', value: 30 }]);

		const d = result.players.find((p) => p.name === 'D');
		expect(d?.net).toBe(-20);
		expect(d?.paidBy).toEqual([{ target: 'C', value: 20 }]);

		const b = result.players.find((p) => p.name === 'B');
		expect(b?.net).toBe(-10);
		expect(b?.paidBy).toEqual([{ target: 'A', value: 10 }]);
	});

	it('should handle a game with one winner, one loser, and many break-even players', () => {
		const game: GameSchema = {
			players: [
				{ name: 'Winner', cashIn: 100, cashOut: 200 },
				{ name: 'Loser', cashIn: 100, cashOut: 0 },
				{ name: 'Even1', cashIn: 50, cashOut: 50 },
				{ name: 'Even2', cashIn: 50, cashOut: 50 },
				{ name: 'Even3', cashIn: 50, cashOut: 50 }
			]
		};
		const result = payoutSchema.parse(game);
		expect(result.slippage).toBe(0);

		const winner = result.players.find((p) => p.name === 'Winner');
		const loser = result.players.find((p) => p.name === 'Loser');
		const even1 = result.players.find((p) => p.name === 'Even1');

		expect(winner?.net).toBe(100);
		expect(loser?.net).toBe(-100);
		expect(even1?.net).toBe(0);
		expect(loser?.paidBy).toEqual([{ target: 'Winner', value: 100 }]);
		expect(winner?.paidTo).toEqual([{ target: 'Loser', value: 100 }]);
		expect(even1?.paidBy).toEqual([]);
	});
});
