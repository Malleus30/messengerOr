
export async function sendRequest( method, url, token, body){
    return await fetch(url, {
        method:method,
        body: body,
        headers: { 
            'Content-Type':'application/json;charset=utf-8',
            'Authorization': `Bearer ${token}`,
        }
    })
     .then(response => response.json())
     .catch(alert);
}

   

    
   

