import { fromEvent, merge, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import EventEmitter from 'events';

const logger = (type: any) => (data: any) => {
  console.log('type:', type, data);
  return of(data);
};

var emitter = new EventEmitter();
const events = [
  fromEvent(emitter, '1').pipe(concatMap(logger('1'))),
  fromEvent(emitter, '2').pipe(concatMap(logger('2'))),
  fromEvent(emitter, '3').pipe(concatMap(logger('3')))
];

var a = [];
merge(...events).subscribe(data => a.push(JSON.parse(data).d));

// emitter.emit('1', `{"d": 1, "t": ${Date.now()}}`);
// emitter.emit('2', `{"d": 2, "t": ${Date.now()}}`);
// emitter.emit('3', `{"d": 3, "t": ${Date.now()}}`);

const t1 = setInterval(() => {
  emitter.emit('1', `{"d": 1, "t": ${Date.now()}}`);
}, 200);

const t2 = setInterval(() => {
  emitter.emit('2', `{"d": 2, "t": ${Date.now()}}`);
}, 500);

const t3 = setInterval(() => {
  emitter.emit('3', `{"d": 3, "t": ${Date.now()}}`);
}, 1000);

setTimeout(() => {
  emitter.emit('2', `{"d": 22, "t": ${Date.now()}}`);
}, 500);

setTimeout(() => {
  console.log(a);
  clearInterval(t1);
  clearInterval(t2);
  clearInterval(t3);
}, 2000);
