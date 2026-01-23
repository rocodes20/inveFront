
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error (${response.status})`);
    }

    const rawData = await response.json();

    let data = rawData;
    if (rawData?.body) {
      data = JSON.parse(rawData.body);
    }

    if (data?.success === false) {
      throw new Error(data.message || "Operation failed");
    }

    return data;
  } catch (error) {
    console.error("API Call failed:", error);

    
    alert(
      error.message === "Failed to fetch"
        ? "Server not working ."
        : error.message || "Something went wrong"
    );

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
  return await apiRequest({
    action: "view_offers"
  });
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