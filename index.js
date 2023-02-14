const projectID = "172A87QU";
const tenant = "https://tenant.vdotok.com";
const connect = async () => {
  (async function () {
    const payload = {
      email: "david@test.com",
      password: "password",
      project_id: projectID,
    };
    const res = await fetch(tenant, payload);
    const data = await res.json();
    console.log(data, "<--------data");
  })();
};
