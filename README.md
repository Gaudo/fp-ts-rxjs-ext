This library provides [fp-ts](https://github.com/gcanti/fp-ts) bindings for [rxjs](https://rxjs.dev/).
It is meant as a light alternative to [fp-ts-rxjs](https://github.com/gcanti/fp-ts-rxjs).

## Motivation
1) fp-ts-rxjs is currently fixed to rxjs 6 due to [#63](https://github.com/gcanti/fp-ts-rxjs/issues/63) and doesn't seem to be getting any updates.
2) I don't agree with some of the implementations and instances used in fp-ts-rxjs.

## Installation
`npm install @fgaudo/fp-ts-rxjs`

## IMPORTANT NOTES
- New functions will be incorporated as per my personal needs and requirements over time.
  If you specifically need one, just open an issue. :)

## Example
```typescript
import * as RO from '@fgaudo/fp-ts-rxjs/ReaderObservable'
import * as R from 'fp-ts/Reader'
import * as Rx from 'rxjs'
import { pipe } from 'fp-ts/function'

pipe(
	Rx.of('Answer to everything:'),
	R.of,
	RO.switchMap(text => R.asks(answer => Rx.of(`${text} ${answer}`)))
)('42').subscribe(console.log)

