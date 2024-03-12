import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

// GET PROPERTIES FETCH
export const getPropertiesFetch = async (filter) => {
  const queryUrl = new URLSearchParams(filter);

  try {
    const response = await fetch(
      apiUrl + "/properties" + (filter ? "?" + queryUrl.toString() : ""),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(filter && {
            Authorization: JSON.parse(Cookies.get("auth_token")).token,
          }),
        },
      }
    );

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
  lift,
  location
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
        location: location,
      },
    };

    console.log(data);

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
export const updatePropertyFetch = async (
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
  lift,
  location,
  id
) => {
  try {
    const authToken = JSON.parse(Cookies.get("auth_token"));

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
        location: location,
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
