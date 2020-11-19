import { combineLatest } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { add, read, readAll } from './db';

const Rx = require('rxjs');

const i1 = document.querySelector('#i1');
const i2 = document.querySelector('#i2');
const button = document.querySelector('button');

const obs1 = Rx.fromEvent(i1, 'input');
const obs2 = Rx.fromEvent(i2, 'input');
let id = 1;

combineLatest(
    obs1.pipe(
        pluck('target', 'value')
    ),
    obs2.pipe(
        pluck('target', 'value')
    )
)
    .pipe(
        map((a) => a.join(' ').trim())
    )
    .subscribe({
        next(value) {
            document.querySelector('#result').textContent = value;
            button.disabled = !value;
        }
    })

const buscarTodos = () => {
    readAll().then((resultado) => {
        id = resultado.length + 1;
        const html = resultado.map((r) => {
            return `<tr>
                        <td>${r.id}</td>
                        <td>${r.name}</td>
                    </tr>`;
        }).join('');
        document.querySelector('table tbody').innerHTML = html;
    });
}

Rx.fromEvent(button, 'click')
    .subscribe({
        next() {
            add({ id: id++, name: `${i1.value} ${i2.value}` }).then(buscarTodos)
        }
    });

buscarTodos();

(async () => {
    const cache = await caches.open('teste');
    cache.add('./assets/data.json');

    for (const request of await cache.keys()) {
        //Apesar das quatro chamadas, deve aparecer a requisição somente uma vez no navegadors
        console.log(await (await cache.match(request)).json())
        console.log(await (await cache.match(request)).json())
        console.log(await (await cache.match(request)).json())
        console.log(await (await cache.match(request)).json())
    }
})();