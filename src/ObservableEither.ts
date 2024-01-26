import { either as E, function as F } from 'fp-ts'
import * as Rx from 'rxjs'

const flow = F.flow
const pipe = F.pipe

export type ObservableEither<ERR, A> = Rx.Observable<E.Either<ERR, A>>

//////////////

type SwitchMapW = <ERR1, IN, OUT>(
	f: (in_: IN, index: number) => ObservableEither<ERR1, OUT>
) => <ERR2>(
	oe: ObservableEither<ERR2, IN>
) => ObservableEither<ERR1 | ERR2, OUT>

export const switchMapW: SwitchMapW = <ERR2, IN, OUT>(
	f: (in_: IN, index: number) => ObservableEither<ERR2, OUT>
): (<ERR1>(
	oe: ObservableEither<ERR1, IN>
) => ObservableEither<ERR1 | ERR2, OUT>) =>
	Rx.switchMap((either, index) =>
		pipe(
			either,
			E.foldW(flow(E.left, Rx.of), in_ => f(in_, index))
		)
	)

export const mergeMapW: <E2, A, B>(
	f: (a: A) => Rx.Observable<E.Either<E2, B>>
) => <E1>(
	obs: Rx.Observable<E.Either<E1, A>>
) => Rx.Observable<E.Either<E1 | E2, B>> = f =>
	Rx.mergeMap(E.foldW(flow(E.left, Rx.of), f))

export const mergeMap: <E1, A, B>(
	f: (a: A) => Rx.Observable<E.Either<E1, B>>
) => (obs: Rx.Observable<E.Either<E1, A>>) => Rx.Observable<E.Either<E1, B>> =
	mergeMapW
