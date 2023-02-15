const projectID = "115G1WZI";
// const tenant = "https://tenant.vdotok.com/Login"; wrong api
const tenant = "https://q-tenant.vdotok.dev/API/v0/";

// login
(async function () {
  const payload = {
    email: "david@test.com",
    password: "password",
    project_id: projectID,
  };

  const res = await axios.post(`${tenant}Login`, payload);
  const data = res.data;
  console.log(data, "<--------data");
  if (localStorage.getItem("auth_token")) {
    localStorage.clear();
  }

  localStorage.setItem("user", JSON.stringify(res.data));
  localStorage.setItem("auth_token", res.data.auth_token);
})();

let localUser = JSON.parse(localStorage.getItem("user"));
let auth_token = localStorage.getItem("auth_token");

// connect SDK
setTimeout(() => {}, 2000);

const Client = new MVDOTOK.Client({
  projectID: `${projectID}`,
  host: `${localUser.messaging_server_map.complete_address}`,
});

Client.on("connect", (res) => {
  // you can do something after connecting the socket
  console.log("**res on connect sdk", res);
});
Client.on("subscribed", (response) => {
  console.log("**res on subscribe  ", response);
});
Client.on("message", (res) => {
  console.log(res, "------res heres mesaage");
});

Client.on("disconnect", (response) => {
  //on disconnecting
  console.log("client is disconnectiong");
});
Client.on("error", (err) => {
  console.log("error occure ", err);
});

console.log(Client, "<-------Client");

const subscribe = async () => {
  // get groups and set to local storage
  const payload = {
    auth_token: `${auth_token}`,
  };
  const res = await axios.post(`${tenant}AllGroups`, payload);
  // console.warn(res.data, "<--------groups");
  localStorage.setItem("groups", JSON.stringify(res.data.groups));

  setTimeout(() => {
    // grps to subscribe
    let grpsToSubscribe = [];
    JSON.parse(localStorage.getItem("groups")).map((e) => {
      grpsToSubscribe.push({
        key: e.channel_key,
        channel: e.channel_name,
        title: e.group_title,
      });
    });
    // console.warn(grpsToSubscribe);
    grpsToSubscribe.map((e) => {
      Client.Subscribe(e);
    });
  }, 2000);
};

const register = () => {
  Client.Register(localUser.ref_id, localUser.authorization_token);
};

const sendMessage = () => {
  let idd = new Date().getTime().toString();
  let channel_key = document.querySelector("#channel_key");
  let channel_name = document.querySelector("#channel_name");
  let messageTxt = document.querySelector("#messageTxt");
  console.log(messageTxt.value);
  let payload = {
    status: 1,
    size: 0,
    type: "text",
    from: localUser.ref_id,
    content: messageTxt.value.trim(),
    id: idd,
    date: new Date().getTime(),
    key: channel_key.value,
    to: channel_name.value,
  };
  Client.SendMessage(payload);
};
