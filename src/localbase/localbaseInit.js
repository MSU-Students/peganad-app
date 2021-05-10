import localDB from "./locabaseConfig.js";

const addContents = async function(payload, category) {
  console.log(category);
  const result = await localDB
    .collection("contents")
    .add(
      { [category]: payload },
      typeof category == "string" ? category : category[0]
    )
    .catch((err) => console.log(err.message));
  return result;
};
const getContents = localDB.collection("contents").get();
const deleteContents = localDB.collection("contents").delete();

export { addContents, getContents, deleteContents };
