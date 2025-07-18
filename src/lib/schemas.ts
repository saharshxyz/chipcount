import { z } from 'zod';
import { formattedDateTime } from './utils';

const uniqueArray = <T>(arr: T[]): boolean => arr.length === new Set(arr).size;

const nameSchema = z.string().min(1);
const dollarSchema = z.coerce.number().nonnegative();
const paySchema = z.object({
	target: nameSchema,
	value: dollarSchema
});
export type PaySchema = z.infer<typeof paySchema>;

const playerSchema = z.object({
	name: nameSchema,
	cashIn: dollarSchema,
	cashOut: dollarSchema
});
export type PlayerSchema = z.infer<typeof playerSchema>;

export const gameSchema = z
	.object({
		description: z.string().max(60).default(`${formattedDateTime()} Game`),
		players: z.array(playerSchema).min(2, 'At least two players are required')
	})
	.refine((data) => uniqueArray(data.players.map((p) => p.name)), {
		message: 'Player names must be unique',
		path: ['players']
	});
export type GameSchema = z.infer<typeof gameSchema>;

export const payoutSchema = gameSchema.transform((game) => {
	const EPSILON = 1e-9;
	const isZero = (n: number) => Math.abs(n) < EPSILON;
	const hasDebt = (n: number) => n < -EPSILON;
	const hasCredit = (n: number) => n > EPSILON;

	const slippage = game.players.reduce((sum, curr) => sum + curr.cashIn - curr.cashOut, 0);
	const slippagePerPlayer = slippage / game.players.length;

	const players = game.players
		.map((p) => ({
			...p,
			net: p.cashOut - p.cashIn + slippagePerPlayer,
			paidBy: [] as PaySchema[],
			paidTo: [] as PaySchema[],
			bal: p.cashOut - p.cashIn + slippagePerPlayer
		}))
		.sort((a, b) => a.bal - b.bal);

	const debtors = players.filter((p) => hasDebt(p.bal)).sort((a, b) => a.bal - b.bal);
	const creditors = players.filter((p) => hasCredit(p.bal)).sort((a, b) => b.bal - a.bal);

	for (const debtor of debtors) {
		for (const creditor of creditors) {
			if (isZero(debtor.bal) || isZero(creditor.bal)) continue;

			const payment = Math.min(-debtor.bal, creditor.bal);
			debtor.bal += payment;
			creditor.bal -= payment;

			debtor.paidBy.push({ target: creditor.name, value: payment });
			creditor.paidTo.push({ target: debtor.name, value: payment });
		}
	}

	return {
		slippage,
		players: players.map(({ bal: balance, ...p }) => p)
	};
});
export type PayoutSchema = z.infer<typeof payoutSchema>;
