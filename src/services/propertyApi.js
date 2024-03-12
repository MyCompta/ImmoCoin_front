import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

// GET PROPERTIES FETCH
export const getPropertiesFetch = async (filter = {}) => {
  try {
    const queryUrl = new URL(apiUrl + "/properties?" + new URLSearchParams(filter));
    console.log(queryUrl);
    const authToken = JSON.parse(Cookies.get("auth_token"));

    const authorization = filter ? authToken.token : undefined;

    const response = await fetch(queryUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      throw new Error("Get Properties failed. Please check your credentials and try again.");
    }

    return response.json();
  } catch (error) {
    return error;
  }
};

// POST NEW PROPERTY FETCH
export const createPropertyFetch = async (
  title,
  price,
  description,
  furnished,
  surface,
  room,
  floor,
  terrace,
  garden,
  caretaker,
  lift
) => {
  console.log("Attempting to get auth_token from cookies...");
  try {
    console.log("Attempting to get auth_token from cookies...");
    const authToken = await JSON.parse(Cookies.get("auth_token"));
    console.log(authToken);

    const data = {
      property: {
        title: title,
        price: price,
        description: description,
        furnished: furnished,
        surface: surface,
        room: room,
        floor: floor,
        terrace: terrace,
        garden: garden,
        caretaker: caretaker,
        lift: lift,
      },
    };
    const response = await fetch(apiUrl + "/properties", {
      method: "POST",
      headers: {
        Authorization: authToken.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //console.log("Response Headers:", [...response.headers.entries()]);
    //console.log(data)
    if (!response.ok) {
      throw new Error("Create Properties failed. Please check your credentials and try again.");
    }

    return response;
  } catch (error) {
    console.error("Error during create property:", error.message);
    return error;
  }
};

// GET PROPERTY FETCH
export const getPropertyFetch = async (id) => {
  try {
    const response = await fetch(apiUrl + "/properties/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Get Property failed. Please check your credentials and try again.");
    }

    return response.json();
  } catch (error) {
    return error;
  }
};

// UPDATE PROPERTY FETCH
export const updatePropertyFetch = async (title, price, description, id) => {
  try {
    const authToken = JSON.parse(Cookies.get("auth_token"));

    const data = {
      property: {
        title: title,
        price: price,
        description: description,
        user_id: authToken.user_id,
      },
    };
    const response = await fetch(apiUrl + "properties/" + id, {
      method: "PATCH",
      headers: {
        Authorization: authToken.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //console.log("Response Headers:", [...response.headers.entries()]);
    //console.log(data)
    if (!response.ok) {
      throw new Error("Update Properties failed. Please check your credentials and try again.");
    }

    return response;
  } catch (error) {
    console.error("Error during update property:", error.message);
    return error;
  }
};

// DELETE PROPERTY FETCH
export const deletePropertyFetch = async (id) => {
  try {
    const authToken = JSON.parse(Cookies.get("auth_token"));

    const response = await fetch(apiUrl + "/properties/" + id, {
      method: "DELETE",
      headers: {
        Authorization: authToken.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Delete Properties failed. Please check your credentials and try again.");
    }

    return response;
  } catch (error) {
    console.error("Error during delete property:", error.message);
    return error;
  }
};
