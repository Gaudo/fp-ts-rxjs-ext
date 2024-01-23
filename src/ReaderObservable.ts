import * as R from 'fp-ts/Reader'
import * as RIO from 'fp-ts/ReaderIO'
import { pipe } from 'fp-ts/function'
import * as Rx from 'rxjs'
import { UnionToIntersection } from 'simplytyped'

export type ReaderObservable<ENV, A> = R.Reader<ENV, Rx.Observable<A>>

//////////////

type SwitchMapW = <ENV1, A, B>(
	project: (a: A, index: number) => ReaderObservable<ENV1, B>
) => <ENV2>(p: ReaderObservable<ENV2, A>) => ReaderObservable<ENV1 & ENV2, B>

export const switchMapW: SwitchMapW = project => ro => env =>
	pipe(
		ro(env),
		Rx.switchMap((a, index) => project(a, index)(env))
	)

//////////////

type SwitchMap = <ENV, A, B>(
	project: (a: A, index: number) => ReaderObservable<ENV, B>
) => (p: ReaderObservable<ENV, A>) => ReaderObservable<ENV, B>

export const switchMap: SwitchMap = switchMapW

//////////////

type MergeMap = <ENV, A, B>(
	project: (a: A, index: number) => ReaderObservable<ENV, B>
) => (p: ReaderObservable<ENV, A>) => ReaderObservable<ENV, B>

export const mergeMap: MergeMap = project => ro => env =>
	pipe(
		ro(env),
		Rx.mergeMap((a, index) => project(a, index)(env))
	)

//////////////

type ExhaustMap = <ENV, A, B>(
	project: (a: A, index: number) => ReaderObservable<ENV, B>
) => (p: ReaderObservable<ENV, A>) => ReaderObservable<ENV, B>

export const exhaustMap: ExhaustMap = project => ro => env =>
	pipe(
		ro(env),
		Rx.exhaustMap((a, index) => project(a, index)(env))
	)

//////////////

type Tap = <ENV, A>(
	project: (a: A) => RIO.ReaderIO<ENV, void>
) => (p: ReaderObservable<ENV, A>) => ReaderObservable<ENV, A>

export const tap: Tap = f => ro => env =>
	pipe(
		ro(env),
		Rx.tap(a => f(a)(env)())
	)

//////////////

type DistinctUntilChanged = <A>(
	f: (prev: A, next: A) => boolean
) => <ENV>(p: ReaderObservable<ENV, A>) => ReaderObservable<ENV, A>

export const distinctUntilChanged: DistinctUntilChanged = f => ro => env =>
	pipe(ro(env), Rx.distinctUntilChanged(f))

//////////////

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConcatW = <T extends readonly ReaderObservable<any, any>[]>(
	...ros: T
) => ReaderObservable<
	UnionToIntersection<
		{
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			[K in keyof T]: T[K] extends ReaderObservable<infer A, any> ? A : never
		}[number]
	>,
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[K in keyof T]: T[K] extends ReaderObservable<any, infer A> ? A : never
	}[number]
>

export const concatW: ConcatW =
	(...ros) =>
	env =>
		Rx.concat(...ros.map(ro => ro(env)))

//////////////

type Concat = <ENV, A>(
	...ros: readonly ReaderObservable<ENV, A>[]
) => ReaderObservable<ENV, A>

export const concat: Concat = concatW as any

export const map: <A, B>(
	f: (a: A) => B
) => <ENV>(
	obs: R.Reader<ENV, Rx.Observable<A>>
) => R.Reader<ENV, Rx.Observable<B>> = f => R.map(Rx.map(f))

export type ReaderObservableInputTuple<ENV, T> = {
	[K in keyof T]: R.Reader<ENV, Rx.Observable<T[K]>>
}
export function merge<ENV, A extends readonly unknown[]>(
	...sources: [...ReaderObservableInputTuple<ENV, A>]
): R.Reader<ENV, Rx.Observable<A[number]>> {
	return env => Rx.merge(...sources.map(a => a(env)))
}
