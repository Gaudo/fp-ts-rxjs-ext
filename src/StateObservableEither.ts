import * as OE from 'fp-ts-rxjs/lib/ObservableEither'
import { pipe } from 'fp-ts/lib/function'

//////////////

export type StateObservableEither<S, E, A> = (
	s: S
) => OE.ObservableEither<E, readonly [A, S]>

//////////////

type Map = <A, B>(
	f: (a: A) => B
) => <S, E>(
	so: StateObservableEither<S, E, A>
) => StateObservableEither<S, E, B>

export const map: Map = f => soe => s =>
	pipe(
		soe(s),
		OE.map(([a, s]) => [f(a), s] as const)
	)

//////////////

type ChainW = <S, E2, A, B>(
	f: (a: A) => StateObservableEither<S, E2, B>
) => <E1>(
	so: StateObservableEither<S, E1, A>
) => StateObservableEither<S, E1 | E2, B>

export const chainW: ChainW = f => so => s =>
	pipe(
		so(s),
		OE.chainW(([a, s2]) => f(a)(s2))
	)

//////////////

type Chain = <S, E, A, B>(
	f: (a: A) => StateObservableEither<S, E, B>
) => (so: StateObservableEither<S, E, A>) => StateObservableEither<S, E, B>

export const chain: Chain = chainW

//////////////

type Right = <STATE, E = never, A = never>(
	a: A
) => StateObservableEither<STATE, E, A>

export const right: Right = a => s => OE.right([a, s])

//////////////

type Left = <STATE, E = never, A = never>(
	e: E
) => StateObservableEither<STATE, E, A>

export const left: Left = e => () => OE.left(e)

//////////////

type Get = <STATE, E>() => StateObservableEither<STATE, E, STATE>

export const get: Get = () => s => OE.right([s, s])

//////////////

type Modify = <STATE, E>(
	f: (s: STATE) => STATE
) => StateObservableEither<STATE, E, void>

export const modify: Modify = f => s => OE.right([undefined, f(s)])

//////////////

type Put = <STATE, E>(s: STATE) => StateObservableEither<STATE, E, void>

export const put: Put = s => () => OE.right([undefined, s])
