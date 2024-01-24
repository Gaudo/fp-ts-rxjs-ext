import * as OPT from 'fp-ts/es6/Option.js'
import { flow } from 'fp-ts/es6/function.js'
import * as Rx from 'rxjs'

export function filterMap<A, B>(
	f: (a: A) => OPT.Option<B>
): (obs: Rx.Observable<A>) => Rx.Observable<B> {
	return flow(
		Rx.map(f),
		Rx.filter(OPT.isSome),
		Rx.map(b => (OPT.isSome(b) ? b.value : (undefined as never)))
	)
}
