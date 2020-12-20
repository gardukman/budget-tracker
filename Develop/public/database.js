let database;

//request to the current db
const request = indexedDB.open('progressive-web-app', 1);

request.onupgradeneeded = function (event) {
    const database = event.target.result;
    db.createObjectStore('new_record', { autoIncrement: true });
};

request.onsuccess = function (event) {

    database = event.target.result;

    if (navigator.onLine) uploadRecord();
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRec(record) {
    const transaction = db.transaction(['newRecord'], 'readAndWrite');
    const recObjStore = transaction.objStore('newRecord');
    const getAll = recObjStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length === 1) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application.json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) throw new Error(serverResponse);

                const transaction = db.transaction(['newRecord'], 'readAndWrite');
                const recObjStore = transaction.objStore('newRecord');
                recObjStore.clear();

                alert("You are now online and your progress was updated.");
            })
            .catch(err => console.log(err));
        }

        else if (getAll.result.length > 1) {

            fetch('/api/transaction/bulk', {
                method:'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json text/plain */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) throw new Error(serverResponse);

                const transaction = database.transaction(['newRecord'], 'readAndWrite');
                const recObjStore = transaction.objStore('newRecord');
                recObjStore.clear();

                alert("You are now online and your progress was updated.");
            })
            .catch(err => console.log(err));
        }
    }
};

window.addEventListener('online', uploadRecord);