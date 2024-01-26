import { type either as E, function as F, type reader as R } from 'fp-ts'
import * as Rx from 'rxjs'

import * as OE from './ObservableEither'

const pipe = F.pipe

export type ReaderObservableEither<ENV, ERR, A> = R.Reader<
	ENV,
	Rx.Observable<E.Either<ERR, A>>
>

//////////////

type SwitchMapW = <ENV1, ERR1, IN, OUT>(
	f: (in_: IN, index: number) => ReaderObservableEither<ENV1, ERR1, OUT>
) => <ENV2, ERR2>(
	p: ReaderObservableEither<ENV2, ERR2, IN>
) => ReaderObservableEither<ENV1 & ENV2, ERR1 | ERR2, OUT>

export const switchMapW: SwitchMapW = f => roe => env =>
	pipe(
		roe(env),
		OE.switchMapW((in_, index) => f(in_, index)(env))
	)

//////////////

type SwitchMap = <ENV, ERR, IN, OUT>(
	f: (in_: IN, index: number) => ReaderObservableEither<ENV, ERR, OUT>
) => (
	p: ReaderObservableEither<ENV, ERR, IN>
) => ReaderObservableEither<ENV, ERR, OUT>

export const switchMap: SwitchMap = switchMapW
