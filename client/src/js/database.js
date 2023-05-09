import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log("Adding Content to DB");

  try {
    // create connection
    const textDB = await openDB("jate", 1);

    // create a new tx
    const tx = textDB.transaction("jate", "readwrite");

    // open up the cache store
    const store = tx.objectStore("jate");

    // pass content into the cache store
    const request = store.add({ jate: content });

    await tx.done;
  } catch (err) {
    console.error(err);
  }
  console.log(`${content} posted to the database!`);
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const textDB = await openDB("jate", 1);

  const tx = textDB.transaction("jate", "readonly");

  const store = tx.objectStore("jate");

  const request = store.getAll();

  const result = await request;
  console.log(`result.value`, result);
  return result;
};

initdb();
