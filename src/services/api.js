
const BASE_URL = "http://127.0.0.1:5000/company";

export async function loginUser(email, password, role) {
  return await apiRequest({
    action: "login",
    payload: {
      email,
      password,
      role
    }
  });
}

async function apiRequest(payload) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawData = await response.json();

    if (rawData && rawData.body) {
      const parsedBody = JSON.parse(rawData.body);
      
      if (!parsedBody.success) {
        throw new Error(parsedBody.message || "Server reported an error");
      }
      
      return parsedBody;
    }

    return rawData;
  } catch (error) {
    console.error("API Call failed:", error);
    throw error;
  }
}

export async function fetchContacts() {
  return await apiRequest({
    action: "get_all"
  });
}

export async function bulkCreateContacts(dataList) {
  return await apiRequest({
    action: "bulk_create",
    dataList: dataList 
  });
}

export async function createOffering(formData) {
  return await apiRequest({
    action: "add_offering",
    payload: formData 
  });
}

export async function fetchRoles() {
  return await apiRequest({
    action: "populate_roles"
  });
}

export async function fetchProjects() {
  return await apiRequest({
    action: "get_projects"
  });
}

export async function createProject(formData) {
  return await apiRequest({
    action: "create_project",
    payload: formData
  });
}

export async function fetchInvestors(offeringId) {
  return await apiRequest({
    action: "get_offering_investors",
    offering_id: offeringId 
  });
}

export async function fetchOfferings() {
  const response = await fetch("http://127.0.0.1:5000/investor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "view_investor_offers"
    })
  });

  const responseData = await response.json();

  return JSON.parse(responseData.body);
}

export async function investOffer(payload) {
  console.log(payload)
  const response = await fetch("http://127.0.0.1:5000/investor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "invest_offer",
      payload
    })
  });

  const responseData = await response.json();
  return JSON.parse(responseData.body);
}