const dbName = 'usuario';
let dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = function (event) {
        console.log('error: ');
        reject();
    };

    request.onsuccess = function (event) {
        resolve(request.result);
        console.log('success: ' + request.result);
    };

    request.onupgradeneeded = function (event) {
        resolve(event.target.result);
        objectStore = event.target.result.createObjectStore(dbName, { keyPath: 'id' });
    }
}), objectStore;

export function add(obj) {
    return new Promise(async (resolve, reject) => {
        const db = await dbPromise;
        let request = db.transaction([dbName], 'readwrite')
            .objectStore(dbName)
            .add(obj);

        request.onsuccess = function (event) {
            resolve();
        };

        request.onerror = function (event) {
            reject();
        }
    });
}

export function read(id) {
    return new Promise(async (resolve, reject) => {
        const db = await dbPromise;
        let transaction = db.transaction([dbName]);
        let objectStore = transaction.objectStore(dbName);
        let request = objectStore.get(id);

        request.onerror = function (event) {
            reject();
        };

        request.onsuccess = function (event) {
            // Do something with the request.result!
            if (request.result) {
                resolve(request.result);
            } else {
                reject();
            }
        };
    });
}

export function readAll() {
    return new Promise(async (resolve, reject) => {
        const db = await dbPromise;
        let objectStore = db.transaction(dbName).objectStore(dbName);
        let result = [];
        objectStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;

            if (cursor) {
                result.push({
                    id: cursor.key,
                    ...cursor.value
                });
                cursor.continue();
            } else {
                resolve(result);
            }
        };
    });
}