import Cookies from "js-cookie";

export const FetchGet = async (path: string): Promise<any> => {
  const res = await fetch(`${Cookies.get("apiUrl")}${path}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    },
  });
  // need to do this with fetch since doesn't automatically throw errors axios and graphql-request do
  if (res.ok) {
    return res.json();
  }
  throw new Error("Network response not ok"); // need to throw because react-query functions need to have error thrown to know its in error state
};

export const FetchPost = async (path: string, data: any): Promise<any> => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(`${Cookies.get("apiUrl")}${path}`, requestOptions);
  // need to do this with fetch since doesn't automatically throw errors axios and graphql-request do
  if (res.ok) {
    return res.json();
  }
  throw new Error("Network response not ok"); // need to throw because react-query functions need to have error thrown to know its in error state
};
