
const url = "http://127.0.0.1:5000";
const Company = "/company";
const Investor = "/investor";

async function apiRequest(endpoint, payload) {
  try {

    const fullUrl = url + endpoint;
    
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
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
        ? "Server not working."
        : error.message || "Something went wrong"
    );
    throw error; 
  }
}

//  COMPANY ROUTES 

export async function loginUser(email, password, role) {
  return await apiRequest(Investor, {
    action: "login",
    payload: { email, password, role }
  });
}

export async function fetchContacts() {
  return await apiRequest(Company, {
    action: "get_all"
  });
}

export async function bulkCreateContacts(dataList) {
  return await apiRequest(Company, {
    action: "bulk_create",
    dataList: dataList 
  });
}

export async function createOffering(formData) {
  return await apiRequest(Company, {
    action: "add_offering",
    payload: formData 
  });
}

export async function fetchRoles() {
  return await apiRequest(Company, {
    action: "populate_roles"
  });
}

export async function fetchProjects() {
  return await apiRequest(Company, {
    action: "get_projects"
  });
}

export async function createProject(formData) {
  return await apiRequest(Company, {
    action: "create_project",
    payload: formData
  });
}

export async function fetchInvestors(offeringId) {
  return await apiRequest(Company, {
    action: "get_offering_investors",
    offering_id: offeringId 
  });
}

export async function OrganizationfetchOfferings() {
  return await apiRequest(Company, {
    action: "view_offers",
    
  });
}

//  INVESTOR ROUTES

export async function investOffer(payload) {
  return await apiRequest(Investor, {
    action: "invest_offer",
    payload: payload
  });
}

export async function InvestorfetchOfferings() {
  return await apiRequest(Investor, {
    action: "view_offers",
    payload: {
      user_id: sessionStorage.getItem("contactId")
    }
  });
}
