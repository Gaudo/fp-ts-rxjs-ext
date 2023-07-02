Extensions for [fp-ts-rxjs](https://github.com/gcanti/fp-ts-rxjs)

## Motivation
Fp-ts-rxjs is an awesome library, but imho it lacks some useful rxjs functions like `switchMap`, `concat` and so on..

This library also provides a slightly different implementation of `ap` and the `Apply`
instance for `ObservableEither`s, which allows a `sequenceT` to fail fast when one of the arguments returns a `Left`.

## Installation
`npm install @fgaudo/fp-ts-rxjs-extension`

## IMPORTANT NOTES
* This is just a personal library which will hopefully be superseded by newer versions of fp-ts-rxjs.
Keep in mind that i only add functions that i need in my other projects. **But** if you have a request.. just ask :)

* Remember that currently fp-ts-rxjs is fixed to rxjs v6 because of https://github.com/gcanti/fp-ts-rxjs/issues/63 .
For this reason, these extensions will also have that version as `peerDependency`.
You can still install and use v7 with this library and it will probably still work. (I do so, and still haven't had any problems)


## Suggested usage
```typescript
import * as RO from 'fp-ts-rxjs/lib/ReaderObservable'
import {readerObservable as ROx} from '@fgaudo/fp-ts-rxjs-extension'

// ROx are the ReaderObservable's extensions :)
pipe(
  RO.of('Answer to everything:'),
  ROx.switchMap(text =>
    RO.asks<string, string>(answer => `${text} ${answer}`))
)('42').subscribe(console.log)
```

