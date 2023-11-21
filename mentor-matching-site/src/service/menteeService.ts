import menteeDb from "../dal/menteeDb";

async function readInterests() {
  return await menteeDb.readInterests();
}

const menteeService = {
  readInterests
}

export default menteeService;