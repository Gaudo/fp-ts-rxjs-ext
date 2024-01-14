import { option as OPT } from 'fp-ts'
import { flow } from 'fp-ts/function'
import { Observable } from 'rxjs'
import * as Rx from 'rxjs/operators'

export function filterMap<A, B>(
	f: (a: A) => OPT.Option<B>
): (obs: Observable<A>) => Observable<B> {
	return flow(
		Rx.map(f),
		Rx.filter(OPT.isSome),
		Rx.map(b => (OPT.isSome(b) ? b.value : (undefined as never)))
	)
}
