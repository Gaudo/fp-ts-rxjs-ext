import * as O from 'fp-ts-rxjs/Observable'
import { pipe } from 'fp-ts/lib/function'
import * as Rx from 'rxjs'

//////////////

export type StateObservable<S, A> = (s: S) => Rx.Observable<readonly [A, S]>

//////////////

type Map = <A, B>(
	f: (a: A) => B
) => <S>(so: StateObservable<S, A>) => StateObservable<S, B>

export const map: Map = f => so => s =>
	pipe(
		so(s),
		O.map(([a, s]) => [f(a), s] as const)
	)

//////////////

type Chain = <S, A, B>(
	f: (a: A) => StateObservable<S, B>
) => (so: StateObservable<S, A>) => StateObservable<S, B>

export const chain: Chain = f => so => s =>
	pipe(
		so(s),
		O.chain(([a, s2]) => f(a)(s2))
	)

//////////////

type Of = <STATE, IN>(a: IN) => StateObservable<STATE, IN>

export const of: Of = a => s => O.of([a, s])

//////////////

type Get = <STATE>() => StateObservable<STATE, STATE>

export const get: Get = () => s => O.of([s, s])

//////////////

type Modify = <STATE>(f: (s: STATE) => STATE) => StateObservable<STATE, void>

export const modify: Modify = f => s => O.of([undefined, f(s)])

//////////////

type Put = <STATE>(s: STATE) => StateObservable<STATE, void>

export const put: Put = s => () => O.of([undefined, s])
