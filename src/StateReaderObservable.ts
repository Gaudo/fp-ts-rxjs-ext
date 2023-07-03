import * as RO from 'fp-ts-rxjs/lib/ReaderObservable'
import { pipe } from 'fp-ts/lib/function'

//////////////

export type StateReaderObservable<STATE, ENV, IN> = (
	s: STATE
) => RO.ReaderObservable<ENV, readonly [IN, STATE]>

//////////////

type Map = <IN, OUT>(
	f: (a: IN) => OUT
) => <STATE, ENV>(
	so: StateReaderObservable<STATE, ENV, IN>
) => StateReaderObservable<STATE, ENV, OUT>

export const map: Map = f => sro => s =>
	pipe(
		sro(s),
		RO.map(([a, s]) => [f(a), s] as const)
	)

//////////////

type ChainW = <STATE, ENV2, IN, OUT>(
	f: (a: IN) => StateReaderObservable<STATE, ENV2, OUT>
) => <ENV1>(
	so: StateReaderObservable<STATE, ENV1, IN>
) => StateReaderObservable<STATE, ENV1 & ENV2, OUT>

export const chainW: ChainW = f => so => s =>
	pipe(
		so(s),
		RO.chainW(([a, s2]) => f(a)(s2))
	)

//////////////

type Chain = <STATE, ENV, IN, OUT>(
	f: (a: IN) => StateReaderObservable<STATE, ENV, OUT>
) => (
	so: StateReaderObservable<STATE, ENV, IN>
) => StateReaderObservable<STATE, ENV, OUT>

export const chain: Chain = chainW

//////////////

type Of = <STATE, ENV, IN>(a: IN) => StateReaderObservable<STATE, ENV, IN>

export const of: Of = a => s => RO.of([a, s])

//////////////

type Get = <STATE, ENV>() => StateReaderObservable<STATE, ENV, STATE>

export const get: Get = () => s => RO.of([s, s])

//////////////

type Modify = <STATE, ENV>(
	f: (s: STATE) => STATE
) => StateReaderObservable<STATE, ENV, void>

export const modify: Modify = f => s => RO.of([undefined, f(s)])

//////////////

type Put = <STATE, ENV>(s: STATE) => StateReaderObservable<STATE, ENV, void>

export const put: Put = s => () => RO.of([undefined, s])
