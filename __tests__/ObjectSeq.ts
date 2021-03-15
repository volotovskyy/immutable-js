/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

///<reference path='../resources/jest.d.ts'/>
///<reference path='../dist/immutable.d.ts'/>

jest.autoMockOff();

import { Seq } from 'immutable';

describe('ObjectSequence', () => {

  it('maps', () => {
    var i = Seq({'a': 'A', 'b': 'B', 'c': 'C'});
    var m = i.map(x => x + x).toObject();
    expect(m).toEqual({'a': 'AA', 'b': 'BB', 'c': 'CC'});
  });

  it('reduces', () => {
    var i = Seq({'a': 'A', 'b': 'B', 'c': 'C'});
    var r = i.reduce<string>((r, x) => r + x, '');
    expect(r).toEqual('ABC');
  });

  it('extracts keys', () => {
    var i = Seq({'a': 'A', 'b': 'B', 'c': 'C'});
    var k = i.keySeq().toArray();
    expect(k).toEqual(['a', 'b', 'c']);
  });

  it('is reversable', () => {
    var i = Seq({'a': 'A', 'b': 'B', 'c': 'C'});
    var k = i.reverse().toArray();
    expect(k).toEqual(['C', 'B', 'A']);
  });

  it('can double reversable', () => {
    var i = Seq({'a': 'A', 'b': 'B', 'c': 'C'});
    var k = i.reverse().reverse().toArray();
    expect(k).toEqual(['A', 'B', 'C']);
  });

  it('can be iterated', () => {
    var obj = { a: 1, b: 2, c: 3 };
    var seq = Seq(obj);
    var entries = seq.entries();
    expect(entries.next()).toEqual({ value: ['a', 1], done: false });
    expect(entries.next()).toEqual({ value: ['b', 2], done: false });
    expect(entries.next()).toEqual({ value: ['c', 3], done: false });
    expect(entries.next()).toEqual({ value: undefined, done: true });
  });

  it('cannot be mutated after calling toObject', () => {
    var seq = Seq({ a: 1, b: 2, c: 3 });

    var obj = seq.toObject();
    obj['c'] = 10;
    var seq2 = Seq(obj);

    expect(seq.get('c')).toEqual(3);
    expect(seq2.get('c')).toEqual(10);
  });
});
