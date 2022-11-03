import Cookies from "js-cookie";

export const FetchGet = async (path: string): Promise<any> => {
  const apiUrl: any = localStorage.getItem("apiUrl");
  const token: any = localStorage.getItem("token");
  const res = await fetch(`${apiUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
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
  const apiUrl: any = localStorage.getItem("apiUrl");
  const token: any = localStorage.getItem("token");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(`${apiUrl}${path}`, requestOptions);
  // need to do this with fetch since doesn't automatically throw errors axios and graphql-request do
  if (res.ok) {
    return res.json();
  }
  throw new Error("Network response not ok"); // need to throw because react-query functions need to have error thrown to know its in error state
};
