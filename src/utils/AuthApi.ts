import Cookies from 'js-cookie';

export const FetchLogin = async (path: string, data: any): Promise<void> => {
    const apiUrl = Cookies.get('apiUrl'); // => 'value'
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    var res = await fetch(`${apiUrl}/${path}`, requestOptions);
    // need to do this with fetch since doesn't automatically throw errors axios and graphql-request do
    if (res.ok) {
       return await res.json()
    }
   
};
