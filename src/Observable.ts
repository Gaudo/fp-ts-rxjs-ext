import { function as F, option as OPT } from 'fp-ts'
import * as Rx from 'rxjs'

const flow = F.flow

export function filterMap<A, B>(
	f: (a: A) => OPT.Option<B>
): (obs: Rx.Observable<A>) => Rx.Observable<B> {
	return flow(
		Rx.map(f),
		Rx.filter(OPT.isSome),
		Rx.map(b => (OPT.isSome(b) ? b.value : (undefined as never)))
	)
}
