/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

///<reference path='../resources/jest.d.ts'/>
///<reference path='../dist/immutable.d.ts'/>

jest.autoMockOff();

import * as jasmineCheck from 'jasmine-check';
jasmineCheck.install();

import { Seq, is } from 'immutable';

var genHeterogeneousishArray = gen.oneOf([
  gen.array(gen.oneOf([gen.string, gen.undefined])),
  gen.array(gen.oneOf([gen.int, gen.NaN]))
]);

describe('max', () => {

  it('returns max in a sequence', () => {
    expect(Seq([1,9,2,8,3,7,4,6,5]).max()).toBe(9);
  });

  it('accepts a comparator', () => {
    expect(Seq([1,9,2,8,3,7,4,6,5]).max((a, b) => b - a)).toBe(1);
  });

  it('by a mapper', () => {
    var family = Seq([
      { name: 'Oakley', age: 7 },
      { name: 'Dakota', age: 7 },
      { name: 'Casey', age: 34 },
      { name: 'Avery', age: 34 },
    ])
    expect(family.maxBy(p => p.age).name).toBe('Casey');
  });

  it('by a mapper and a comparator', () => {
    var family = Seq([
      { name: 'Oakley', age: 7 },
      { name: 'Dakota', age: 7 },
      { name: 'Casey', age: 34 },
      { name: 'Avery', age: 34 },
    ])
    expect(family.maxBy<number>(p => p.age, (a, b) => b - a).name).toBe('Oakley');
  });

  it('surfaces NaN, null, and undefined', () => {
    expect(
      is(NaN, Seq.of(1, 2, 3, 4, 5, NaN).max())
    ).toBe(true);
    expect(
      is(NaN, Seq.of(NaN, 1, 2, 3, 4, 5).max())
    ).toBe(true);
    expect(
      is(null, Seq.of('A', 'B', 'C', 'D', null).max())
    ).toBe(true);
    expect(
      is(null, Seq.of(null, 'A', 'B', 'C', 'D').max())
    ).toBe(true);
  });

  it('null treated as 0 in default iterator', () => {
    expect(
      is(2, Seq.of(-1, -2, null, 1, 2).max())
    ).toBe(true);
  });

  check.it('is not dependent on order', [genHeterogeneousishArray], vals => {
    expect(
      is(
        Seq(shuffle(vals.slice())).max(),
        Seq(vals).max()
      )
    ).toEqual(true);
  });

});

describe('min', () => {

  it('returns min in a sequence', () => {
    expect(Seq([1,9,2,8,3,7,4,6,5]).min()).toBe(1);
  });

  it('accepts a comparator', () => {
    expect(Seq([1,9,2,8,3,7,4,6,5]).min((a, b) => b - a)).toBe(9);
  });

  it('by a mapper', () => {
    var family = Seq([
      { name: 'Oakley', age: 7 },
      { name: 'Dakota', age: 7 },
      { name: 'Casey', age: 34 },
      { name: 'Avery', age: 34 },
    ])
    expect(family.minBy(p => p.age).name).toBe('Oakley');
  });

  it('by a mapper and a comparator', () => {
    var family = Seq([
      { name: 'Oakley', age: 7 },
      { name: 'Dakota', age: 7 },
      { name: 'Casey', age: 34 },
      { name: 'Avery', age: 34 },
    ])
    expect(family.minBy<number>(p => p.age, (a, b) => b - a).name).toBe('Casey');
  });

  check.it('is not dependent on order', [genHeterogeneousishArray], vals => {
    expect(
      is(
        Seq(shuffle(vals.slice())).min(),
        Seq(vals).min()
      )
    ).toEqual(true);
  });

});

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
